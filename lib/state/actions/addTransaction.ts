import type {
  ChainId,
  BaseTransactionInfo,
  Transaction,
  TransactionsState,
} from "../../types";

import { getNow } from "../../utils/getNow";
import { getValueOrDefault } from "../../utils/getValueOrDefault";

export interface AddTransactionPayload<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
> {
  chainId: ChainId;
  from: string;
  hash: string;
  info: TransactionInfo;
}

export function addTransaction<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(
  transactionsState: TransactionsState<TransactionInfo>,
  payload: AddTransactionPayload<TransactionInfo>
): TransactionsState<TransactionInfo> {
  const { chainId, from, hash, info } = payload;

  const chainTransactions = getValueOrDefault(transactionsState[chainId], {});

  if (chainTransactions[hash] !== undefined) {
    throw Error("TRANSACTION_HASH_ALREADY_ADDED");
  }

  const transaction: Transaction<TransactionInfo> = {
    from,
    hash,
    info,
    addedTime: getNow(),
  };

  return {
    ...transactionsState,
    [chainId]: {
      ...chainTransactions,
      [hash]: transaction,
    },
  };
}
