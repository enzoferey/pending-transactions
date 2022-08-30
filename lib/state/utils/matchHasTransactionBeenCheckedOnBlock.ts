import type { Transaction } from "../../types";

export function matchHasTransactionBeenCheckedOnBlock(
  transaction: Transaction,
  blockNumber: number
): boolean {
  return (
    transaction.lastCheckedBlockNumber !== undefined &&
    transaction.lastCheckedBlockNumber >= blockNumber
  );
}
