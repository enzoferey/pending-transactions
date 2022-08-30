import type {
  ChainId,
  BaseTransactionInfo,
  ChainTransactionsState,
  TransactionsState,
} from "../../types";

import { getValueOrDefault } from "../../utils/getValueOrDefault";

export function getAllChainTransactions<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(
  transactionsState: TransactionsState<TransactionInfo>,
  chainId: ChainId
): ChainTransactionsState<TransactionInfo> {
  return getValueOrDefault(transactionsState[chainId], {});
}
