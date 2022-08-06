import type { TransactionsState } from "../../types";

export interface ClearAllChainTransactionsPayload {
  chainId: number;
}

export function clearAllChainTransactions(
  transactionsState: TransactionsState,
  payload: ClearAllChainTransactionsPayload
): TransactionsState {
  const { chainId } = payload;

  if (transactionsState[chainId] === undefined) {
    return transactionsState;
  }

  return {
    ...transactionsState,
    [chainId]: {},
  };
}
