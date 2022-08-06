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

interface ReturnValue<TransactionInfo extends BaseTransactionInfo> {
  addTransaction: AddTransaction<TransactionInfo>;
  updateTransactionLastChecked: UpdateTransactionLastChecked;
  finalizeTransaction: FinalizeTransaction;
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

  const finalizeTransaction = React.useCallback<FinalizeTransaction>(
    (payload) => {
      setState((currentState) => {
        const updatedState = actions.finalizeTransaction(currentState, payload);

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
      updateTransactionLastChecked,
      finalizeTransaction,
      clearAllChainTransactions,
    };
  }, [
    addTransaction,
    updateTransactionLastChecked,
    finalizeTransaction,
    clearAllChainTransactions,
  ]);

  return value;
}
