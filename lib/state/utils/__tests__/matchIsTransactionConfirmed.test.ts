import { describe, expect, it } from "vitest";

import {
  MOCK_CONFIRMED_TRANSACTION,
  MOCK_TRANSACTION,
} from "../../../test-utils";

import { matchIsTransactionConfirmed } from "../matchIsTransactionConfirmed";

describe("matchIsTransactionConfirmed", () => {
  it("should return true if the transaction has a receipt and a confirmed time", () => {
    const result = matchIsTransactionConfirmed(MOCK_CONFIRMED_TRANSACTION);
    expect(result).toBe(true);
  });
  it("should return false if the transaction does not have a receipt or a confirmed time", () => {
    const result = matchIsTransactionConfirmed(MOCK_TRANSACTION);
    expect(result).toBe(false);
  });
});
