import React from "react";

import type {
  TransactionsState,
  Transaction,
  BaseTransactionInfo,
  TransactionReceipt,
} from "../types";

import type { StorageService } from "./types";

import { useTransactionsState } from "./hooks/useTransactionsState";
import { useTransactionsSelectors } from "./hooks/useTransactionsSelectors";
import { useTransactionsMatchers } from "./hooks/useTransactionsMatchers";
import { useTransactionsActions } from "./hooks/useTransactionsActions";
import { useCheckTransactions } from "./hooks/useCheckTransactions";

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

interface ReturnValue<TransactionInfo extends BaseTransactionInfo> {
  state: TransactionsState<TransactionInfo>;
}

export function usePendingTransactions<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(options: Options<TransactionInfo>): ReturnValue<TransactionInfo> {
  const {
    chainId,
    lastBlockNumber,
    storageKey,
    storageService,
    getTransactionReceipt,
    onSuccess,
    onFailure,
  } = options;

  const { state, setState } = useTransactionsState<TransactionInfo>({
    storageKey,
    storageService,
  });

  const { getAllChainTransactions, getChainTransaction } =
    useTransactionsSelectors<TransactionInfo>({
      state,
      chainId,
    });

  const { matchIsTransactionPending, matchIsTransactionConfirmed } =
    useTransactionsMatchers({ state, chainId });

  const {
    addTransaction,
    updateTransactionLastChecked,
    finalizeTransaction,
    clearAllChainTransactions,
  } = useTransactionsActions<TransactionInfo>({
    storageKey,
    storageService,
    setState,
  });

  useCheckTransactions<TransactionInfo>({
    chainId,
    lastBlockNumber,
    storageKey,
    storageService,
    setState,
    getAllChainTransactions,
    getTransactionReceipt,
    onSuccess,
    onFailure,
  });

  const value = React.useMemo<ReturnValue<TransactionInfo>>(() => {
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
