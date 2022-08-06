import React from "react";

import type {
  TransactionsState,
  ChainTransactionsState,
  Transaction,
  BaseTransactionInfo,
  TransactionReceipt,
} from "../types";

import * as selectors from "../state/selectors";
import * as matchers from "../state/matchers";
import * as actions from "../state/actions";

import type { StorageService } from "./types";

const DEFAULT_STORAGE_KEY = "pending-transactions-state";

// Selectors
type GetAllChainTransactions<TransactionInfo extends BaseTransactionInfo> =
  () => ChainTransactionsState<TransactionInfo>;
type GetChainTransaction<TransactionInfo extends BaseTransactionInfo> = (
  transactionHash: string
) => Transaction<TransactionInfo> | undefined;

// Matchers
type MatchIsTransactionPending = (transactionHash: string) => boolean;
type MatchIsTransactionConfirmed = (transactionHash: string) => boolean;

// Actions
type AddTransaction<TransactionInfo extends BaseTransactionInfo> = (
  payloads: actions.AddTransactionPayload<TransactionInfo>
) => void;
type UpdateTransactionLastChecked = (
  payloads: actions.UpdateTransactionLastCheckedPayload
) => void;
type FinalizeTransaction = (
  payloads: actions.FinalizeTransactionPayload
) => void;
type ClearAllChainTransactions = (
  payloads: actions.ClearAllChainTransactionsPayload
) => void;

interface Options<TransactionInfo extends BaseTransactionInfo> {
  chainId: number;
  lastBlockNumber: number;
  storageKey?: string;
  storageService?: StorageService;
  getTransactionReceipt: (
    transaction: Transaction<TransactionInfo>
  ) => Promise<TransactionReceipt | undefined>;
  onSuccess: (transaction: Transaction<TransactionInfo>) => void;
  onFailure: (transaction: Transaction<TransactionInfo>) => void;
}

interface PendingTransactions<TransactionInfo extends BaseTransactionInfo> {
  state: TransactionsState<TransactionInfo>;
  getAllChainTransactions: GetAllChainTransactions<TransactionInfo>;
  getChainTransaction: GetChainTransaction<TransactionInfo>;
  matchIsTransactionPending: MatchIsTransactionPending;
  matchIsTransactionConfirmed: MatchIsTransactionConfirmed;
  addTransaction: AddTransaction<TransactionInfo>;
  updateTransactionLastChecked: UpdateTransactionLastChecked;
  finalizeTransaction: FinalizeTransaction;
  clearAllChainTransactions: ClearAllChainTransactions;
}

export function usePendingTransactions<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(options: Options<TransactionInfo>): PendingTransactions<TransactionInfo> {
  const {
    chainId,
    lastBlockNumber,
    storageKey = DEFAULT_STORAGE_KEY,
    storageService,
    getTransactionReceipt,
    onSuccess,
    onFailure,
  } = options;

  const getStateFromStorageService = React.useCallback(
    (storageService: StorageService): TransactionsState<TransactionInfo> => {
      const serializedState = storageService.getItem(storageKey);

      if (serializedState === null) {
        return {};
      }

      try {
        return JSON.parse(serializedState);
      } catch {
        return {};
      }
    },
    [storageKey]
  );

  const [state, setState] = React.useState<TransactionsState<TransactionInfo>>(
    storageService !== undefined
      ? getStateFromStorageService(storageService)
      : {}
  );

  // Reset state when the local storage service instance changes
  React.useEffect(() => {
    if (storageService === undefined) {
      return;
    }

    setState(getStateFromStorageService(storageService));
  }, [storageService, getStateFromStorageService]);

  // Sync state when local storage key changes on other documents
  React.useEffect(() => {
    if (storageService === undefined) {
      return;
    }

    const listener = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return;
      }

      setState(getStateFromStorageService(storageService));
    };

    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [storageKey, storageService, getStateFromStorageService]);

  const getAllChainTransactions = React.useCallback<
    GetAllChainTransactions<TransactionInfo>
  >(() => {
    return selectors.getAllChainTransactions(state, chainId);
  }, [state, chainId]);

  const getChainTransaction = React.useCallback<
    GetChainTransaction<TransactionInfo>
  >(
    (transactionHash) => {
      return selectors.getChainTransaction(state, chainId, transactionHash);
    },
    [state, chainId]
  );

  const matchIsTransactionPending =
    React.useCallback<MatchIsTransactionPending>(
      (transactionHash) => {
        return matchers.matchIsTransactionPending(
          state,
          chainId,
          transactionHash
        );
      },
      [state, chainId]
    );

  const matchIsTransactionConfirmed =
    React.useCallback<MatchIsTransactionConfirmed>(
      (transactionHash) => {
        return matchers.matchIsTransactionConfirmed(
          state,
          chainId,
          transactionHash
        );
      },
      [state, chainId]
    );

  const addTransaction = React.useCallback<AddTransaction<TransactionInfo>>(
    (payload) => {
      setState((currentState) => {
        const updatedState = actions.addTransaction(currentState, payload);

        if (storageService !== undefined) {
          storageService.setItem(storageKey, JSON.stringify(updatedState));
        }

        return updatedState;
      });
    },
    [storageKey, storageService]
  );

  const updateTransactionLastChecked =
    React.useCallback<UpdateTransactionLastChecked>(
      (payload) => {
        setState((currentState) => {
          const updatedState = actions.updateTransactionLastChecked(
            currentState,
            payload
          );

          if (storageService !== undefined) {
            storageService.setItem(storageKey, JSON.stringify(updatedState));
          }

          return updatedState;
        });
      },
      [storageKey, storageService]
    );

  const finalizeTransaction = React.useCallback<FinalizeTransaction>(
    (payload) => {
      setState((currentState) => {
        const updatedState = actions.finalizeTransaction(currentState, payload);

        if (storageService !== undefined) {
          storageService.setItem(storageKey, JSON.stringify(updatedState));
        }

        return updatedState;
      });
    },
    [storageKey, storageService]
  );

  const clearAllChainTransactions =
    React.useCallback<ClearAllChainTransactions>(
      (payload) => {
        setState((currentState) => {
          const updatedState = actions.clearAllChainTransactions(
            currentState,
            payload
          );

          if (storageService !== undefined) {
            storageService.setItem(storageKey, JSON.stringify(updatedState));
          }

          return updatedState;
        });
      },
      [storageKey, storageService]
    );

  // Check transactions whenever the last block number changes
  React.useEffect(() => {
    const checkAllChainTransactions = async () => {
      const allChainTransactions = getAllChainTransactions();

      const handleReceipt = (
        transaction: Transaction<TransactionInfo>,
        receipt: TransactionReceipt | undefined
      ) => {
        if (receipt === undefined) {
          setState((currentState) => {
            return actions.updateTransactionLastChecked(currentState, {
              chainId,
              hash: transaction.hash,
              blockNumber: lastBlockNumber,
            });
          });
        } else {
          setState((currentState) => {
            return actions.finalizeTransaction(currentState, {
              chainId,
              hash: transaction.hash,
              receipt,
            });
          });

          if (receipt.hadSuccess) {
            onSuccess(transaction);
          } else {
            onFailure(transaction);
          }
        }
      };

      await Promise.all(
        Object.values(allChainTransactions).map((transaction) => {
          return getTransactionReceipt(transaction).then((receipt) => {
            handleReceipt(transaction, receipt);
          });
        })
      );
    };

    checkAllChainTransactions();
  }, [
    chainId,
    lastBlockNumber,
    getAllChainTransactions,
    getTransactionReceipt,
  ]);

  const value = React.useMemo<PendingTransactions<TransactionInfo>>(() => {
    return {
      state,
      getAllChainTransactions,
      getChainTransaction,
      matchIsTransactionPending,
      matchIsTransactionConfirmed,
      addTransaction,
      updateTransactionLastChecked,
      finalizeTransaction,
      clearAllChainTransactions,
    };
  }, [
    state,
    getAllChainTransactions,
    getChainTransaction,
    matchIsTransactionPending,
    matchIsTransactionConfirmed,
    addTransaction,
    updateTransactionLastChecked,
    finalizeTransaction,
    clearAllChainTransactions,
  ]);

  return value;
}
