import { describe, expect, it } from "vitest";

import { MOCK_TRANSACTION } from "../../../test-utils";

import type { Transaction } from "../../../types";

import { matchHasTransactionBeenCheckedOnBlock } from "../matchHasTransactionBeenCheckedOnBlock";

describe("matchHasTransactionBeenCheckedOnBlock", () => {
  it("should return true if the transaction was checked one the given block", () => {
    const blockNumber = 10;

    const transaction: Transaction = {
      ...MOCK_TRANSACTION,
      lastCheckedBlockNumber: blockNumber,
    };

    const result = matchHasTransactionBeenCheckedOnBlock(
      transaction,
      blockNumber
    );

    expect(result).toBe(true);
  });
  it("should return true if the transaction was checked for a later block", () => {
    const blockNumber = 10;

    const transaction: Transaction = {
      ...MOCK_TRANSACTION,
      lastCheckedBlockNumber: blockNumber + 1,
    };

    const result = matchHasTransactionBeenCheckedOnBlock(
      transaction,
      blockNumber
    );

    expect(result).toBe(true);
  });
  it("should return false if the transaction was last checked on a previous block", () => {
    const blockNumber = 10;

    const transaction: Transaction = {
      ...MOCK_TRANSACTION,
      lastCheckedBlockNumber: blockNumber - 1,
    };

    const result = matchHasTransactionBeenCheckedOnBlock(
      transaction,
      blockNumber
    );

    expect(result).toBe(false);
  });
  it("should return false if the transaction has never been checked yet", () => {
    const blockNumber = 10;

    const transaction: Transaction = {
      ...MOCK_TRANSACTION,
      lastCheckedBlockNumber: undefined,
    };

    const result = matchHasTransactionBeenCheckedOnBlock(
      transaction,
      blockNumber
    );

    expect(result).toBe(false);
  });
});
