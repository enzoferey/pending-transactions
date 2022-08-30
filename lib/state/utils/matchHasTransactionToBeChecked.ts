import type { Transaction } from "../../types";

import { matchHasTransactionBeenCheckedOnBlock } from "./matchHasTransactionBeenCheckedOnBlock";
import { matchIsTransactionPending } from "./matchIsTransactionPending";

export function matchHasTransactionToBeChecked(
  transaction: Transaction,
  blockNumber: number
): boolean {
  return (
    matchHasTransactionBeenCheckedOnBlock(transaction, blockNumber) === false &&
    matchIsTransactionPending(transaction)
  );
}
