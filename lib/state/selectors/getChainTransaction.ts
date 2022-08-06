import type {
  BaseTransactionInfo,
  Transaction,
  TransactionsState,
} from "../../types";

import { getAllChainTransactions } from "./getAllChainTransactions";

export function getChainTransaction<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(
  transactionsState: TransactionsState<TransactionInfo>,
  chainId: number,
  transactionHash: string
): Transaction<TransactionInfo> | undefined {
  const chainTransactions = getAllChainTransactions(transactionsState, chainId);
  const transaction = chainTransactions[transactionHash];
  return transaction;
}
