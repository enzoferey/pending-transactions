import React from "react";

import type { BaseTransactionInfo, TransactionsState } from "../../types";

import * as actions from "../../state/actions";

import type { StorageService } from "../types";

interface Options<TransactionInfo extends BaseTransactionInfo> {
  storageKey?: string;
  storageService?: StorageService;
  setState: React.Dispatch<
    React.SetStateAction<TransactionsState<TransactionInfo>>
  >;
}

export type AddTransaction<TransactionInfo extends BaseTransactionInfo> = (
  payload: actions.AddTransactionPayload<TransactionInfo>
) => void;

export type AddOracleTransaction<TransactionInfo extends BaseTransactionInfo> =
  (payload: actions.AddOracleTransactionPayload<TransactionInfo>) => void;

export type UpdateTransactionLastChecked = (
  payload: actions.UpdateTransactionLastCheckedPayload
) => void;

export type ConfirmTransaction = (
  payload: actions.ConfirmTransactionPayload
) => void;

export type ConfirmOracleTransaction = (
  payload: actions.ConfirmOracleTransactionPayload
) => void;

export type ClearAllChainTransactions = (
  payload: actions.ClearAllChainTransactionsPayload
) => void;

interface ReturnValue<TransactionInfo extends BaseTransactionInfo> {
  addTransaction: AddTransaction<TransactionInfo>;
  addOracleTransaction: AddOracleTransaction<TransactionInfo>;
  updateTransactionLastChecked: UpdateTransactionLastChecked;
  confirmTransaction: ConfirmTransaction;
  confirmOracleTransaction: ConfirmOracleTransaction;
  clearAllChainTransactions: ClearAllChainTransactions;
}

export function useTransactionsActions<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(options: Options<TransactionInfo>): ReturnValue<TransactionInfo> {
  const { storageKey, storageService, setState } = options;

  const addTransaction = React.useCallback<AddTransaction<TransactionInfo>>(
    (payload) => {
      setState((currentState) => {
        const updatedState = actions.addTransaction(currentState, payload);

        if (storageKey !== undefined && storageService !== undefined) {
          storageService.setItem(storageKey, JSON.stringify(updatedState));
        }

        return updatedState;
      });
    },
    [storageKey, storageService, setState]
  );

  const addOracleTransaction = React.useCallback<
    AddOracleTransaction<TransactionInfo>
  >(
    (payload) => {
      setState((currentState) => {
        const updatedState = actions.addOracleTransaction(
          currentState,
          payload
        );

        if (storageKey !== undefined && storageService !== undefined) {
          storageService.setItem(storageKey, JSON.stringify(updatedState));
        }

        return updatedState;
      });
    },
    [storageKey, storageService, setState]
  );

  const updateTransactionLastChecked =
    React.useCallback<UpdateTransactionLastChecked>(
      (payload) => {
        setState((currentState) => {
          const updatedState = actions.updateTransactionLastChecked(
            currentState,
            payload
          );

          if (storageKey !== undefined && storageService !== undefined) {
            storageService.setItem(storageKey, JSON.stringify(updatedState));
          }

          return updatedState;
        });
      },
      [storageKey, storageService, setState]
    );

  const confirmTransaction = React.useCallback<ConfirmTransaction>(
    (payload) => {
      setState((currentState) => {
        const updatedState = actions.confirmTransaction(currentState, payload);

        if (storageKey !== undefined && storageService !== undefined) {
          storageService.setItem(storageKey, JSON.stringify(updatedState));
        }

        return updatedState;
      });
    },
    [storageKey, storageService, setState]
  );

  const confirmOracleTransaction = React.useCallback<ConfirmOracleTransaction>(
    (payload) => {
      setState((currentState) => {
        const updatedState = actions.confirmOracleTransaction(
          currentState,
          payload
        );

        if (storageKey !== undefined && storageService !== undefined) {
          storageService.setItem(storageKey, JSON.stringify(updatedState));
        }

        return updatedState;
      });
    },
    [storageKey, storageService, setState]
  );

  const clearAllChainTransactions =
    React.useCallback<ClearAllChainTransactions>(
      (payload) => {
        setState((currentState) => {
          const updatedState = actions.clearAllChainTransactions(
            currentState,
            payload
          );

          if (storageKey !== undefined && storageService !== undefined) {
            storageService.setItem(storageKey, JSON.stringify(updatedState));
          }

          return updatedState;
        });
      },
      [storageKey, storageService, setState]
    );

  const value = React.useMemo<ReturnValue<TransactionInfo>>(() => {
    return {
      addTransaction,
      addOracleTransaction,
      updateTransactionLastChecked,
      confirmTransaction,
      confirmOracleTransaction,
      clearAllChainTransactions,
    };
  }, [
    addTransaction,
    addOracleTransaction,
    updateTransactionLastChecked,
    confirmTransaction,
    confirmOracleTransaction,
    clearAllChainTransactions,
  ]);

  return value;
}
