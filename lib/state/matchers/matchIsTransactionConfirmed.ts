import type { TransactionsState } from "../../types";

import { getChainTransaction } from "../selectors";

import { matchIsTransactionPending } from "./matchIsTransactionPending";

export function matchIsTransactionConfirmed(
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
    matchIsTransactionPending(transactionsState, chainId, transactionHash) ===
    false
  );
}
