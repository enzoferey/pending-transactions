import { describe, expect, it } from "vitest";

import type { Transaction } from "../../../types";

import {
  MOCK_CONFIRMED_TRANSACTION,
  MOCK_TRANSACTION,
} from "../../../test-utils";

import { matchHasTransactionToBeChecked } from "../matchHasTransactionToBeChecked";

describe("matchHasTransactionToBeChecked", () => {
  it("should return true if the transaction has not been checked on the given block and it is pending", () => {
    const blockNumber = 10;

    const transaction: Transaction = {
      ...MOCK_TRANSACTION,
      lastCheckedBlockNumber: undefined,
      receipt: undefined,
      confirmedTime: undefined,
    };

    const result = matchHasTransactionToBeChecked(transaction, blockNumber);

    expect(result).toBe(true);
  });
  it("should return false if the transaction has been checked on the given block", () => {
    const blockNumber = 10;

    const transaction: Transaction = {
      ...MOCK_TRANSACTION,
      lastCheckedBlockNumber: blockNumber,
    };

    const result = matchHasTransactionToBeChecked(transaction, blockNumber);

    expect(result).toBe(false);
  });
  it("should return false if the transaction is confirmed", () => {
    const blockNumber = 10;

    const transaction: Transaction = {
      ...MOCK_CONFIRMED_TRANSACTION,
      lastCheckedBlockNumber: undefined,
    };

    const result = matchHasTransactionToBeChecked(transaction, blockNumber);

    expect(result).toBe(false);
  });
});
