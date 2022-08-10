import React from "react";

import type {
  TransactionsState,
  Transaction,
  BaseTransactionInfo,
  TransactionReceipt,
  OracleTransaction,
} from "../types";

import type { StorageService } from "./types";

import { useTransactionsState } from "./hooks/useTransactionsState";
import {
  GetAllChainTransactions,
  GetChainTransaction,
  useTransactionsSelectors,
} from "./hooks/useTransactionsSelectors";
import {
  MatchIsTransactionPending,
  MatchIsTransactionConfirmed,
  useTransactionsMatchers,
  MatchIsOracleTransactionConfirmed,
  MatchIsOracleTransactionPending,
} from "./hooks/useTransactionsMatchers";
import {
  AddTransaction,
  AddOracleTransaction,
  UpdateTransactionLastChecked,
  ConfirmTransaction,
  ConfirmOracleTransaction,
  ClearAllChainTransactions,
  useTransactionsActions,
} from "./hooks/useTransactionsActions";
import { useCheckTransactions } from "./hooks/useCheckTransactions";

interface Options<TransactionInfo extends BaseTransactionInfo> {
  chainId: number;
  lastBlockNumber: number;
  storageKey?: string;
  storageService?: StorageService;
  getTransactionReceipt: (
    transaction: Transaction<TransactionInfo>,
    blockNumber: number
  ) => Promise<TransactionReceipt | undefined>;
  getOracleTransactionReceipt: (
    transaction: OracleTransaction<TransactionInfo>,
    blockNumber: number
  ) => Promise<TransactionReceipt | undefined>;
  onSuccess: (transaction: Transaction<TransactionInfo>) => void;
  onFailure: (transaction: Transaction<TransactionInfo>) => void;
}

interface ReturnValue<TransactionInfo extends BaseTransactionInfo> {
  state: TransactionsState<TransactionInfo>;
  getAllChainTransactions: GetAllChainTransactions<TransactionInfo>;
  getChainTransaction: GetChainTransaction<TransactionInfo>;
  matchIsTransactionPending: MatchIsTransactionPending;
  matchIsTransactionConfirmed: MatchIsTransactionConfirmed;
  matchIsOracleTransactionPending: MatchIsOracleTransactionPending;
  matchIsOracleTransactionConfirmed: MatchIsOracleTransactionConfirmed;
  addTransaction: AddTransaction<TransactionInfo>;
  addOracleTransaction: AddOracleTransaction<TransactionInfo>;
  updateTransactionLastChecked: UpdateTransactionLastChecked;
  confirmTransaction: ConfirmTransaction;
  confirmOracleTransaction: ConfirmOracleTransaction;
  clearAllChainTransactions: ClearAllChainTransactions;
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
    getOracleTransactionReceipt,
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

  const {
    matchIsTransactionPending,
    matchIsTransactionConfirmed,
    matchIsOracleTransactionPending,
    matchIsOracleTransactionConfirmed,
  } = useTransactionsMatchers({ state, chainId });

  const {
    addTransaction,
    addOracleTransaction,
    updateTransactionLastChecked,
    confirmTransaction,
    confirmOracleTransaction,
    clearAllChainTransactions,
  } = useTransactionsActions<TransactionInfo>({
    storageKey,
    storageService,
    setState,
  });

  useCheckTransactions<TransactionInfo>({
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
  });

  const value = React.useMemo<ReturnValue<TransactionInfo>>(() => {
    return {
      state,
      getAllChainTransactions,
      getChainTransaction,
      matchIsTransactionPending,
      matchIsTransactionConfirmed,
      matchIsOracleTransactionPending,
      matchIsOracleTransactionConfirmed,
      addTransaction,
      addOracleTransaction,
      updateTransactionLastChecked,
      confirmTransaction,
      confirmOracleTransaction,
      clearAllChainTransactions,
    };
  }, [
    state,
    getAllChainTransactions,
    getChainTransaction,
    matchIsTransactionPending,
    matchIsTransactionConfirmed,
    matchIsOracleTransactionPending,
    matchIsOracleTransactionConfirmed,
    addTransaction,
    addOracleTransaction,
    updateTransactionLastChecked,
    confirmTransaction,
    confirmOracleTransaction,
    clearAllChainTransactions,
  ]);

  return value;
}
