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
): TransactionsState {
  const { chainId, hash, receipt } = payload;

  const chainTransactions = transactionsState[chainId];

  if (chainTransactions === undefined) {
    return transactionsState;
  }

  const transaction = chainTransactions[hash];

  if (transaction === undefined) {
    return transactionsState;
  }

  return {
    ...transactionsState,
    [chainId]: {
      ...chainTransactions,
      [hash]: {
        ...transaction,
        receipt,
        confirmedTime: getNow(),
      },
    },
  };
}
