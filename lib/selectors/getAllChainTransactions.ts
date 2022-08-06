import type { ChainTransactionsState, TransactionsState } from "../types";

import { getValueOrDefault } from "../utils/getValueOrDefault";

export function getAllChainTransactions(
  transactionsState: TransactionsState,
  chainId: number
): ChainTransactionsState {
  return getValueOrDefault(transactionsState[chainId], {});
}
