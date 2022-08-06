import React from "react";

import type {
  BaseTransactionInfo,
  ChainTransactionsState,
  Transaction,
  TransactionReceipt,
  TransactionsState,
} from "../../types";

import * as actions from "../../state/actions";

import type { StorageService } from "../types";
import { useIsOnline } from "./useIsOnline";
import { useIsWindowActive } from "./useIsWindowActive";

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
    onSuccess,
    onFailure,
  } = options;

  const isWindowActive = useIsWindowActive();
  const isOnline = useIsOnline();

  React.useEffect(() => {
    if (isWindowActive === false || isOnline === false) {
      return;
    }

    const checkAllChainTransactions = async () => {
      const allChainTransactions = getAllChainTransactions();

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
            const updatedState = actions.finalizeTransaction(currentState, {
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
    isWindowActive,
    isOnline,
    chainId,
    lastBlockNumber,
    storageKey,
    storageService,
    setState,
    getAllChainTransactions,
    getTransactionReceipt,
    onSuccess,
    onFailure,
  ]);
}
