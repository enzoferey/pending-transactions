import type { Transaction } from "../../types";

import { matchIsTransactionPending } from "./matchIsTransactionPending";

export function matchIsTransactionConfirmed(transaction: Transaction): boolean {
  return matchIsTransactionPending(transaction) === false;
}
