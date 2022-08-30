import { describe, expect, it } from "vitest";

import {
  MOCK_CONFIRMED_ORACLE_TRANSACTION,
  MOCK_ORACLE_TRANSACTION,
} from "../../../test-utils";

import { matchIsTransactionPending } from "../matchIsTransactionPending";

describe("matchIsTransactionPending", () => {
  it("should return true if the transaction does not have a receipt or a confirmed time", () => {
    const result = matchIsTransactionPending(MOCK_ORACLE_TRANSACTION);
    expect(result).toBe(true);
  });
  it("should return false if the transaction has a receipt and a confirmed time", () => {
    const result = matchIsTransactionPending(MOCK_CONFIRMED_ORACLE_TRANSACTION);
    expect(result).toBe(false);
  });
});
