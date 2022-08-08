import type { OracleTransaction } from "../../types";

import { matchIsOracleTransactionPending } from "./matchIsOracleTransactionPending";

export function matchIsOracleTransactionConfirmed(
  transaction: OracleTransaction
): boolean {
  return matchIsOracleTransactionPending(transaction) === false;
}
