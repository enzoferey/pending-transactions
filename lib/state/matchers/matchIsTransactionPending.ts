import type { TransactionsState } from "../../types";

import { getChainTransaction } from "../selectors";

export function matchIsTransactionPending(
  transactionsState: TransactionsState,
  chainId: number,
  transactionHash: string
): boolean {
  const transaction = getChainTransaction(
    transactionsState,
    chainId,
    transactionHash
  );

  if (transaction === undefined) {
    return false;
  }

  return (
    transaction.receipt === undefined && transaction.confirmedTime === undefined
  );
}
