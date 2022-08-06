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
>(): PendingTransactions<TransactionInfo> {
  const [state, setState] = React.useState<TransactionsState<TransactionInfo>>(
    {}
  );

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
      setState(actions.addTransaction(state, payload));
    },
    [state]
  );

  const updateTransactionLastChecked =
    React.useCallback<UpdateTransactionLastChecked>(
      (payload) => {
        setState(actions.updateTransactionLastChecked(state, payload));
      },
      [state]
    );

  const finalizeTransaction = React.useCallback<FinalizeTransaction>(
    (payload) => {
      setState(actions.finalizeTransaction(state, payload));
    },
    [state]
  );

  const clearAllChainTransactions =
    React.useCallback<ClearAllChainTransactions>(
      (payload) => {
        setState(actions.clearAllChainTransactions(state, payload));
      },
      [state]
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
