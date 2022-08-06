import type { TransactionReceipt, TransactionsState } from "../types";

import { getNow } from "../utils/getNow";

export interface FinalizeTransactionPayload {
  chainId: number;
  hash: string;
  receipt: TransactionReceipt;
}

export function finalizeTransaction(
  transactionsState: TransactionsState,
  payload: FinalizeTransactionPayload
): void {
  const { chainId, hash, receipt } = payload;

  const chainTransactions = transactionsState[chainId];

  if (chainTransactions === undefined) {
    return;
  }

  const transaction = chainTransactions[hash];

  if (transaction === undefined) {
    return;
  }

  chainTransactions[hash] = {
    ...transaction,
    receipt,
    confirmedTime: getNow(),
  };
}
