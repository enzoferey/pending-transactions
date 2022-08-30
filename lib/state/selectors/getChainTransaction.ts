import type {
  ChainId,
  BaseTransactionInfo,
  OracleTransaction,
  Transaction,
  TransactionsState,
} from "../../types";

import { getAllChainTransactions } from "./getAllChainTransactions";

export function getChainTransaction<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(
  transactionsState: TransactionsState<TransactionInfo>,
  chainId: ChainId,
  transactionHash: string
):
  | Transaction<TransactionInfo>
  | OracleTransaction<TransactionInfo>
  | undefined {
  const chainTransactions = getAllChainTransactions(transactionsState, chainId);
  const transaction = chainTransactions[transactionHash];
  return transaction;
}
