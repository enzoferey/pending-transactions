import type {
  ChainId,
  BaseTransactionInfo,
  TransactionReceipt,
  TransactionsState,
} from "../../types";

import { getNow } from "../../utils/getNow";

export interface ConfirmTransactionPayload {
  chainId: ChainId;
  hash: string;
  receipt: TransactionReceipt;
}

export function confirmTransaction<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(
  transactionsState: TransactionsState<TransactionInfo>,
  payload: ConfirmTransactionPayload
): TransactionsState<TransactionInfo> {
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
