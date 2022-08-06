import type {
  BaseTransactionInfo,
  Transaction,
  TransactionsState,
} from "../types";

import { getNow } from "../utils/getNow";
import { getValueOrDefault } from "../utils/getValueOrDefault";

export interface AddTransactionPayload {
  chainId: number;
  from: string;
  hash: string;
  info: BaseTransactionInfo;
}

export function addTransaction(
  transactionsState: TransactionsState,
  payload: AddTransactionPayload
): void {
  const { chainId, from, hash, info } = payload;

  const chainTransactions = getValueOrDefault(transactionsState[chainId], {});

  if (chainTransactions[hash] !== undefined) {
    throw Error("TRANSACTION_HASH_ALREADY_ADDED");
  }

  const transaction: Transaction = {
    from,
    hash,
    info,
    addedTime: getNow(),
  };

  chainTransactions[hash] = transaction;

  transactionsState[chainId] = chainTransactions;
}
