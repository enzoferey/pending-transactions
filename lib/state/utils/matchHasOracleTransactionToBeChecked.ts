import type { OracleTransaction } from "../../types";

import { matchHasTransactionBeenCheckedOnBlock } from "./matchHasTransactionBeenCheckedOnBlock";
import { matchIsTransactionConfirmed } from "./matchIsTransactionConfirmed";
import { matchIsOracleTransactionPending } from "./matchIsOracleTransactionPending";

export function matchHasOracleTransactionToBeChecked(
  transaction: OracleTransaction,
  blockNumber: number
): boolean {
  return (
    matchHasTransactionBeenCheckedOnBlock(transaction, blockNumber) === false &&
    matchIsTransactionConfirmed(transaction) &&
    matchIsOracleTransactionPending(transaction)
  );
}
