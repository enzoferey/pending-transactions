import type { TransactionsState } from "../types";

export interface UpdateTransactionLastCheckedPayload {
  chainId: number;
  hash: string;
  blockNumber: number;
}

export function updateTransactionLastChecked(
  transactionsState: TransactionsState,
  payload: UpdateTransactionLastCheckedPayload
) {
  const { chainId, hash, blockNumber } = payload;

  const chainTransactions = transactionsState[chainId];

  if (chainTransactions === undefined) {
    return;
  }

  const transaction = chainTransactions[hash];

  if (transaction === undefined) {
    return;
  }

  if (transaction.lastCheckedBlockNumber === undefined) {
    chainTransactions[hash] = {
      ...transaction,
      lastCheckedBlockNumber: blockNumber,
    };
  } else {
    chainTransactions[hash] = {
      ...transaction,
      lastCheckedBlockNumber: Math.max(
        transaction.lastCheckedBlockNumber,
        blockNumber
      ),
    };
  }
}
