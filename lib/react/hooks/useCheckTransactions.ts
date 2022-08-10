import React from "react";

import type {
  BaseTransactionInfo,
  ChainTransactionsState,
  OracleTransaction,
  Transaction,
  TransactionReceipt,
} from "../../types";

import { useIsOnline } from "../../hooks/useIsOnline";
import { useIsWindowActive } from "../../hooks/useIsWindowActive";

import * as utils from "../../state/utils";

interface Options<TransactionInfo extends BaseTransactionInfo> {
  chainId: number;
  lastBlockNumber: number;
  getAllChainTransactions: () => ChainTransactionsState<TransactionInfo>;
  getTransactionReceipt: (
    transaction: Transaction<TransactionInfo>,
    blockNumber: number
  ) => Promise<TransactionReceipt | undefined>;
  getOracleTransactionReceipt: (
    transaction: OracleTransaction<TransactionInfo>,
    blockNumber: number
  ) => Promise<TransactionReceipt | undefined>;
  updateTransactionLastChecked: (payload: {
    chainId: number;
    hash: string;
    blockNumber: number;
  }) => void;
  confirmTransaction: (payload: {
    chainId: number;
    hash: string;
    receipt: TransactionReceipt;
  }) => void;
  confirmOracleTransaction: (payload: {
    chainId: number;
    hash: string;
    oracleReceipt: TransactionReceipt;
  }) => void;
  onSuccess: (transaction: Transaction<TransactionInfo>) => void;
  onFailure: (transaction: Transaction<TransactionInfo>) => void;
}

export function useCheckTransactions<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(options: Options<TransactionInfo>): void {
  const {
    chainId,
    lastBlockNumber,
    getAllChainTransactions,
    getTransactionReceipt,
    getOracleTransactionReceipt,
    updateTransactionLastChecked,
    confirmTransaction,
    confirmOracleTransaction,
    onSuccess,
    onFailure,
  } = options;

  const isWindowActive = useIsWindowActive();
  const isOnline = useIsOnline();

  const handleReceipt = React.useCallback(
    (
      transaction: Transaction<TransactionInfo>,
      receipt: TransactionReceipt | undefined
    ): void => {
      if (receipt === undefined) {
        updateTransactionLastChecked({
          chainId,
          hash: transaction.hash,
          blockNumber: lastBlockNumber,
        });
      } else {
        confirmTransaction({
          chainId,
          hash: transaction.hash,
          receipt,
        });

        if (receipt.hadSuccess) {
          onSuccess(transaction);
        } else {
          onFailure(transaction);
        }
      }
    },
    [
      chainId,
      lastBlockNumber,
      updateTransactionLastChecked,
      confirmTransaction,
      onSuccess,
      onFailure,
    ]
  );

  const handleOracleReceipt = React.useCallback(
    (
      transaction: OracleTransaction<TransactionInfo>,
      receipt: TransactionReceipt | undefined
    ): void => {
      if (receipt === undefined) {
        updateTransactionLastChecked({
          chainId,
          hash: transaction.hash,
          blockNumber: lastBlockNumber,
        });
      } else {
        confirmOracleTransaction({
          chainId,
          hash: transaction.hash,
          oracleReceipt: receipt,
        });

        if (receipt.hadSuccess) {
          onSuccess(transaction);
        } else {
          onFailure(transaction);
        }
      }
    },
    [
      chainId,
      lastBlockNumber,
      updateTransactionLastChecked,
      confirmOracleTransaction,
      onSuccess,
      onFailure,
    ]
  );

  React.useEffect(() => {
    if (isWindowActive === false || isOnline === false) {
      return;
    }

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
          return getTransactionReceipt(transaction, lastBlockNumber).then(
            (receipt) => {
              handleReceipt(transaction, receipt);
            }
          );
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
          return getOracleTransactionReceipt(transaction, lastBlockNumber).then(
            (receipt) => {
              handleOracleReceipt(transaction, receipt);
            }
          );
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
    lastBlockNumber,
    getAllChainTransactions,
    getTransactionReceipt,
    getOracleTransactionReceipt,
    handleReceipt,
    handleOracleReceipt,
  ]);
}
