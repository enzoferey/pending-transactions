import { describe, expect, it } from "vitest";

import {
  MOCK_CONFIRMED_ORACLE_TRANSACTION,
  MOCK_ORACLE_TRANSACTION,
} from "../../../test-utils";

import { matchIsOracleTransactionConfirmed } from "../matchIsOracleTransactionConfirmed";

describe("matchIsOracleTransactionConfirmed", () => {
  it("should return true if the oracle transaction has a receipt and a confirmed time", () => {
    const result = matchIsOracleTransactionConfirmed(
      MOCK_CONFIRMED_ORACLE_TRANSACTION
    );
    expect(result).toBe(true);
  });
  it("should return false if the oracle transaction does not have a receipt or a confirmed time", () => {
    const result = matchIsOracleTransactionConfirmed(MOCK_ORACLE_TRANSACTION);
    expect(result).toBe(false);
  });
});
