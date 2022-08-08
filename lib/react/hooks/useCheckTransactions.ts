import React from "react";

import type {
  BaseTransactionInfo,
  ChainTransactionsState,
  OracleTransaction,
  Transaction,
  TransactionReceipt,
  TransactionsState,
} from "../../types";

import { useIsOnline } from "../../hooks/useIsOnline";
import { useIsWindowActive } from "../../hooks/useIsWindowActive";

import * as actions from "../../state/actions";
import * as utils from "../../state/utils";

import type { StorageService } from "../types";

interface Options<TransactionInfo extends BaseTransactionInfo> {
  chainId: number;
  lastBlockNumber: number;
  storageKey?: string;
  storageService?: StorageService;
  setState: React.Dispatch<
    React.SetStateAction<TransactionsState<TransactionInfo>>
  >;
  getAllChainTransactions: () => ChainTransactionsState<TransactionInfo>;
  getTransactionReceipt: (
    transaction: Transaction<TransactionInfo>
  ) => Promise<TransactionReceipt | undefined>;
  getOracleTransactionReceipt: (
    transaction: OracleTransaction<TransactionInfo>
  ) => Promise<TransactionReceipt | undefined>;
  onSuccess: (transaction: Transaction<TransactionInfo>) => void;
  onFailure: (transaction: Transaction<TransactionInfo>) => void;
}

export function useCheckTransactions<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(options: Options<TransactionInfo>): void {
  const {
    chainId,
    lastBlockNumber,
    storageKey,
    storageService,
    setState,
    getAllChainTransactions,
    getTransactionReceipt,
    getOracleTransactionReceipt,
    onSuccess,
    onFailure,
  } = options;

  const isWindowActive = useIsWindowActive();
  const isOnline = useIsOnline();

  React.useEffect(() => {
    if (isWindowActive === false || isOnline === false) {
      return;
    }

    const handleReceipt = (
      transaction: Transaction<TransactionInfo>,
      receipt: TransactionReceipt | undefined
    ) => {
      if (receipt === undefined) {
        setState((currentState) => {
          const updatedState = actions.updateTransactionLastChecked(
            currentState,
            {
              chainId,
              hash: transaction.hash,
              blockNumber: lastBlockNumber,
            }
          );

          if (storageKey !== undefined && storageService !== undefined) {
            storageService.setItem(storageKey, JSON.stringify(updatedState));
          }

          return updatedState;
        });
      } else {
        setState((currentState) => {
          const updatedState = actions.confirmTransaction(currentState, {
            chainId,
            hash: transaction.hash,
            receipt,
          });

          if (storageKey !== undefined && storageService !== undefined) {
            storageService.setItem(storageKey, JSON.stringify(updatedState));
          }

          return updatedState;
        });

        if (receipt.hadSuccess) {
          onSuccess(transaction);
        } else {
          onFailure(transaction);
        }
      }
    };

    const handleOracleReceipt = (
      transaction: OracleTransaction<TransactionInfo>,
      receipt: TransactionReceipt | undefined
    ) => {
      if (receipt === undefined) {
        setState((currentState) => {
          const updatedState = actions.updateTransactionLastChecked(
            currentState,
            {
              chainId,
              hash: transaction.hash,
              blockNumber: lastBlockNumber,
            }
          );

          if (storageKey !== undefined && storageService !== undefined) {
            storageService.setItem(storageKey, JSON.stringify(updatedState));
          }

          return updatedState;
        });
      } else {
        setState((currentState) => {
          const updatedState = actions.confirmTransaction(currentState, {
            chainId,
            hash: transaction.hash,
            receipt,
          });

          if (storageKey !== undefined && storageService !== undefined) {
            storageService.setItem(storageKey, JSON.stringify(updatedState));
          }

          return updatedState;
        });

        if (receipt.hadSuccess) {
          onSuccess(transaction);
        } else {
          onFailure(transaction);
        }
      }
    };

    const checkAllChainTransactions = async () => {
      const allChainTransactions = getAllChainTransactions();

      const transactionsToCheckPromises = Object.values(allChainTransactions)
        .filter((transaction) => {
          return utils.matchHasTransactionToBeChecked(
            transaction,
            lastBlockNumber
          );
        })
        .map((transaction) => {
          return getTransactionReceipt(transaction).then((receipt) => {
            handleReceipt(transaction, receipt);
          });
        });

      const oracletransactionsToCheckPromises = Object.values(
        allChainTransactions
      )
        .filter(utils.matchIsOracleTransaction)
        .filter((transaction) => {
          return utils.matchHasOracleTransactionToBeChecked(
            transaction,
            lastBlockNumber
          );
        })
        .map((transaction) => {
          return getOracleTransactionReceipt(transaction).then((receipt) => {
            handleOracleReceipt(transaction, receipt);
          });
        });

      await Promise.all([
        ...transactionsToCheckPromises,
        ...oracletransactionsToCheckPromises,
      ]);
    };

    checkAllChainTransactions();
  }, [
    isWindowActive,
    isOnline,
    chainId,
    lastBlockNumber,
    storageKey,
    storageService,
    setState,
    getAllChainTransactions,
    getTransactionReceipt,
    getOracleTransactionReceipt,
    onSuccess,
    onFailure,
  ]);
}
