import React from "react";

import type { BaseTransactionInfo, TransactionsState } from "../../types";

import type { StorageService } from "../types";
import { getTransactionsStateFromStorageService } from "../utils/getTransactionsStateFromStorageService";

interface Options {
  storageKey?: string;
  storageService?: StorageService;
}

interface ReturnValue<TransactionInfo extends BaseTransactionInfo> {
  state: TransactionsState<TransactionInfo>;
  setState: React.Dispatch<
    React.SetStateAction<TransactionsState<TransactionInfo>>
  >;
}

export function useTransactionsState<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(options: Options = {}): ReturnValue<TransactionInfo> {
  const { storageKey, storageService } = options;

  const [state, setState] = React.useState<TransactionsState<TransactionInfo>>(
    storageKey !== undefined && storageService !== undefined
      ? getTransactionsStateFromStorageService(storageKey, storageService)
      : {}
  );

  // Reset state when the local storage service instance changes
  React.useEffect(() => {
    if (storageKey === undefined || storageService === undefined) {
      return;
    }

    setState(
      getTransactionsStateFromStorageService(storageKey, storageService)
    );
  }, [storageKey, storageService]);

  const value = React.useMemo<ReturnValue<TransactionInfo>>(() => {
    return {
      state,
      setState,
    };
  }, [state, setState]);

  return value;
}
