import type { Transaction, TransactionsState } from "../types";

import { getAllChainTransactions } from "./getAllChainTransactions";

export function getChainTransaction(
  transactionsState: TransactionsState,
  chainId: number,
  transactionHash: string
): Transaction | undefined {
  const chainTransactions = getAllChainTransactions(transactionsState, chainId);
  const transaction = chainTransactions[transactionHash];
  return transaction;
}
