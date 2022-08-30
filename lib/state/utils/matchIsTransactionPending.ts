import type { Transaction } from "../../types";

export function matchIsTransactionPending(transaction: Transaction): boolean {
  return (
    transaction.receipt === undefined && transaction.confirmedTime === undefined
  );
}
