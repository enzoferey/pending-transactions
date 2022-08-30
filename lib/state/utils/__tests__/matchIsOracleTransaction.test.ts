import { describe, expect, it } from "vitest";

import { MOCK_ORACLE_TRANSACTION, MOCK_TRANSACTION } from "../../../test-utils";

import { matchIsOracleTransaction } from "../matchIsOracleTransaction";

describe("matchIsOracleTransaction", () => {
  it("should return true if the transaction is an oracle transaction", () => {
    const result = matchIsOracleTransaction(MOCK_ORACLE_TRANSACTION);
    expect(result).toBe(true);
  });
  it("should return false if the transaction is not an oracle transaction", () => {
    const result = matchIsOracleTransaction(MOCK_TRANSACTION);
    expect(result).toBe(false);
  });
});
