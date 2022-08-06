import React from "react";

import type {
  TransactionsState,
  ChainTransactionsState,
  Transaction,
  BaseTransactionInfo,
} from "../types";

import * as selectors from "../state/selectors";
import * as matchers from "../state/matchers";
import * as actions from "../state/actions";

import type { StorageService } from "./types";

const DEFAULT_STORAGE_KEY = "pending-transactions-state";

// Selectors
type GetAllChainTransactions = (chainId: number) => ChainTransactionsState;
type GetChainTransaction = (
  chainId: number,
  transactionHash: string
) => Transaction | undefined;

// Matchers
type MatchIsTransactionPending = (
  chainId: number,
  transactionHash: string
) => boolean;
type MatchIsTransactionConfirmed = (
  chainId: number,
  transactionHash: string
) => boolean;

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

interface Options {
  storageKey?: string;
  storageService?: StorageService;
}

interface PendingTransactions<TransactionInfo extends BaseTransactionInfo> {
  state: TransactionsState<TransactionInfo>;
  getAllChainTransactions: GetAllChainTransactions;
  getChainTransaction: GetChainTransaction;
  matchIsTransactionPending: MatchIsTransactionPending;
  matchIsTransactionConfirmed: MatchIsTransactionConfirmed;
  addTransaction: AddTransaction<TransactionInfo>;
  updateTransactionLastChecked: UpdateTransactionLastChecked;
  finalizeTransaction: FinalizeTransaction;
  clearAllChainTransactions: ClearAllChainTransactions;
}

export function usePendingTransactions<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(options: Options): PendingTransactions<TransactionInfo> {
  const { storageKey = DEFAULT_STORAGE_KEY, storageService } = options;

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
    []
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

  const getAllChainTransactions = React.useCallback<GetAllChainTransactions>(
    (chainId) => {
      return selectors.getAllChainTransactions(state, chainId);
    },
    [state]
  );

  const getChainTransaction = React.useCallback<GetChainTransaction>(
    (chainId, transactionHash) => {
      return selectors.getChainTransaction(state, chainId, transactionHash);
    },
    [state]
  );

  const matchIsTransactionPending =
    React.useCallback<MatchIsTransactionPending>(
      (chainId, transactionHash) => {
        return matchers.matchIsTransactionPending(
          state,
          chainId,
          transactionHash
        );
      },
      [state]
    );

  const matchIsTransactionConfirmed =
    React.useCallback<MatchIsTransactionConfirmed>(
      (chainId, transactionHash) => {
        return matchers.matchIsTransactionConfirmed(
          state,
          chainId,
          transactionHash
        );
      },
      [state]
    );

  const addTransaction = React.useCallback<AddTransaction<TransactionInfo>>(
    (payload) => {
      const updatedState = actions.addTransaction(state, payload);
      setState(updatedState);

      if (storageService !== undefined) {
        storageService.setItem(storageKey, JSON.stringify(updatedState));
      }
    },
    [state, storageKey, storageService]
  );

  const updateTransactionLastChecked =
    React.useCallback<UpdateTransactionLastChecked>(
      (payload) => {
        const updatedState = actions.updateTransactionLastChecked(
          state,
          payload
        );
        setState(updatedState);

        if (storageService !== undefined) {
          storageService.setItem(storageKey, JSON.stringify(updatedState));
        }
      },
      [state, storageKey, storageService]
    );

  const finalizeTransaction = React.useCallback<FinalizeTransaction>(
    (payload) => {
      const updatedState = actions.finalizeTransaction(state, payload);
      setState(updatedState);

      if (storageService !== undefined) {
        storageService.setItem(storageKey, JSON.stringify(updatedState));
      }
    },
    [state, storageKey, storageService]
  );

  const clearAllChainTransactions =
    React.useCallback<ClearAllChainTransactions>(
      (payload) => {
        const updatedState = actions.clearAllChainTransactions(state, payload);
        setState(updatedState);

        if (storageService !== undefined) {
          storageService.setItem(storageKey, JSON.stringify(updatedState));
        }
      },
      [state, storageKey, storageService]
    );

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
