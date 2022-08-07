import type {
  BaseTransactionInfo,
  OracleTransaction,
  Transaction,
} from "../../types";

export function matchIsOracleTransaction<
  TransactionInfo extends BaseTransactionInfo
>(
  transaction: Transaction<TransactionInfo> | OracleTransaction<TransactionInfo>
): transaction is OracleTransaction<TransactionInfo> {
  return (
    (transaction as OracleTransaction<TransactionInfo>).isOracleTransaction ===
    true
  );
}
