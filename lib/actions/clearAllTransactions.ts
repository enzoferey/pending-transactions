import type { TransactionsState } from "../types";

export interface ClearAllTransactionsPayload {
  chainId: number;
}

export function clearAllTransactions(
  transactionsState: TransactionsState,
  payload: ClearAllTransactionsPayload
): void {
  const { chainId } = payload;

  if (transactionsState[chainId] === undefined) {
    return;
  }

  transactionsState[chainId] = {};
}
