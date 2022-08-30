import type {
  ChainId,
  BaseTransactionInfo,
  TransactionsState,
} from "../../types";

export interface ClearAllChainTransactionsPayload {
  chainId: ChainId;
}

export function clearAllChainTransactions<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(
  transactionsState: TransactionsState<TransactionInfo>,
  payload: ClearAllChainTransactionsPayload
): TransactionsState<TransactionInfo> {
  const { chainId } = payload;

  if (transactionsState[chainId] === undefined) {
    return transactionsState;
  }

  return {
    ...transactionsState,
    [chainId]: {},
  };
}
