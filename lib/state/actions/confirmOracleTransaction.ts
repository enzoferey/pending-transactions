import type {
  ChainId,
  BaseTransactionInfo,
  TransactionReceipt,
  TransactionsState,
} from "../../types";

import { getNow } from "../../utils/getNow";

import * as utils from "../utils";

export interface ConfirmOracleTransactionPayload {
  chainId: ChainId;
  hash: string;
  oracleReceipt: TransactionReceipt;
}

export function confirmOracleTransaction<
  TransactionInfo extends BaseTransactionInfo = BaseTransactionInfo
>(
  transactionsState: TransactionsState<TransactionInfo>,
  payload: ConfirmOracleTransactionPayload
): TransactionsState<TransactionInfo> {
  const { chainId, hash, oracleReceipt } = payload;

  const chainTransactions = transactionsState[chainId];

  if (chainTransactions === undefined) {
    return transactionsState;
  }

  const transaction = chainTransactions[hash];

  if (transaction === undefined) {
    return transactionsState;
  }

  if (utils.matchIsOracleTransaction(transaction) === false) {
    return transactionsState;
  }

  return {
    ...transactionsState,
    [chainId]: {
      ...chainTransactions,
      [hash]: {
        ...transaction,
        oracleReceipt,
        oracleConfirmedTime: getNow(),
      },
    },
  };
}
