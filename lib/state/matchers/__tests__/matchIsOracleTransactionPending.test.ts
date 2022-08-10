import { describe, expect, it } from "vitest";

import {
  MOCK_CHAIN_ID_1,
  MOCK_CONFIRMED_ORACLE_TRANSACTION,
  MOCK_ORACLE_TRANSACTION,
} from "../../../test-utils";

import type { TransactionsState } from "../../../types";

import { matchIsOracleTransactionPending } from "../matchIsOracleTransactionPending";

describe("matchIsOracleTransactionPending", () => {
  it("should return true if the transaction does not have an oracle receipt or an oracle confirmed time", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_ORACLE_TRANSACTION;

    const transactionsState: TransactionsState = {
      [chainId]: {
        [transaction.hash]: transaction,
      },
    };

    const result = matchIsOracleTransactionPending(
      transactionsState,
      chainId,
      transaction.hash
    );

    expect(result).toBe(true);
  });
  it("should return false if the transaction has an oracle receipt and an oracle confirmed time", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_CONFIRMED_ORACLE_TRANSACTION;

    const transactionsState: TransactionsState = {
      [chainId]: {
        [transaction.hash]: transaction,
      },
    };

    const result = matchIsOracleTransactionPending(
      transactionsState,
      chainId,
      transaction.hash
    );

    expect(result).toBe(false);
  });
  it("should return false if the transaction does not exist on state", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_ORACLE_TRANSACTION;

    const transactionsState: TransactionsState = {};

    const result = matchIsOracleTransactionPending(
      transactionsState,
      chainId,
      transaction.hash
    );

    expect(result).toBe(false);
  });
});
