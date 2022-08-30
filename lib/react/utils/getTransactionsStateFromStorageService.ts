import type { BaseTransactionInfo, TransactionsState } from "../../types";

import type { StorageService } from "../types";

export function getTransactionsStateFromStorageService<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(
  storageKey: string,
  storageService: StorageService
): TransactionsState<TransactionInfo> {
  const serializedState = storageService.getItem(storageKey);

  if (serializedState === null) {
    return {};
  }

  try {
    return JSON.parse(serializedState);
  } catch {
    return {};
  }
}
