import type {
  BaseTransactionInfo,
  OracleTransaction,
  TransactionsState,
} from "../../types";

import { getNow } from "../../utils/getNow";
import { getValueOrDefault } from "../../utils/getValueOrDefault";

export interface AddOracleTransactionPayload<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
> {
  chainId: number;
  from: string;
  hash: string;
  info: TransactionInfo;
}

export function addOracleTransaction<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(
  transactionsState: TransactionsState<TransactionInfo>,
  payload: AddOracleTransactionPayload<TransactionInfo>
): TransactionsState<TransactionInfo> {
  const { chainId, from, hash, info } = payload;

  const chainTransactions = getValueOrDefault(transactionsState[chainId], {});

  if (chainTransactions[hash] !== undefined) {
    throw Error("TRANSACTION_HASH_ALREADY_ADDED");
  }

  const transaction: OracleTransaction<TransactionInfo> = {
    from,
    hash,
    info,
    addedTime: getNow(),
    isOracleTransaction: true,
  };

  return {
    ...transactionsState,
    [chainId]: {
      ...chainTransactions,
      [hash]: transaction,
    },
  };
}
