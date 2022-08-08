import type { OracleTransaction } from "../../types";

export function matchIsOracleTransactionPending(
  transaction: OracleTransaction
): boolean {
  return (
    transaction.oracleReceipt === undefined &&
    transaction.oracleConfirmedTime === undefined
  );
}
