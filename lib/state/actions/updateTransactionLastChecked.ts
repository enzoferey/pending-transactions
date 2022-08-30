import type {
  ChainId,
  BaseTransactionInfo,
  TransactionsState,
} from "../../types";

export interface UpdateTransactionLastCheckedPayload {
  chainId: ChainId;
  hash: string;
  blockNumber: number;
}

export function updateTransactionLastChecked<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(
  transactionsState: TransactionsState<TransactionInfo>,
  payload: UpdateTransactionLastCheckedPayload
): TransactionsState<TransactionInfo> {
  const { chainId, hash, blockNumber } = payload;

  const chainTransactions = transactionsState[chainId];

  if (chainTransactions === undefined) {
    return transactionsState;
  }

  const transaction = chainTransactions[hash];

  if (transaction === undefined) {
    return transactionsState;
  }

  const updatedLastCheckedBlockNumber =
    transaction.lastCheckedBlockNumber === undefined
      ? blockNumber
      : Math.max(transaction.lastCheckedBlockNumber, blockNumber);

  return {
    ...transactionsState,
    [chainId]: {
      ...chainTransactions,
      [hash]: {
        ...transaction,
        lastCheckedBlockNumber: updatedLastCheckedBlockNumber,
      },
    },
  };
}
