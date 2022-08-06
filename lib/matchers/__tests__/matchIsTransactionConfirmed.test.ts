import { describe, expect, it } from "vitest";

import {
  MOCK_CHAIN_ID_1,
  MOCK_CONFIRMED_TRANSACTION,
  MOCK_TRANSACTION,
} from "../../test-utils";

import type { TransactionsState } from "../../types";

import { matchIsTransactionConfirmed } from "../matchIsTransactionConfirmed";

describe("matchIsTransactionConfirmed", () => {
  it("should return true if the transaction has a receipt and a confirmed time", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_CONFIRMED_TRANSACTION;

    const transactionsState: TransactionsState = {
      [chainId]: {
        [transaction.hash]: transaction,
      },
    };

    const result = matchIsTransactionConfirmed(
      transactionsState,
      chainId,
      transaction.hash
    );

    expect(result).toBe(true);
  });
  it("should return false if the transaction does not have a receipt or a confirmed time", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_TRANSACTION;

    const transactionsState: TransactionsState = {
      [chainId]: {
        [transaction.hash]: transaction,
      },
    };

    const result = matchIsTransactionConfirmed(
      transactionsState,
      chainId,
      transaction.hash
    );

    expect(result).toBe(false);
  });
  it("should return false if the transaction does not exist on state", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_TRANSACTION;

    const transactionsState: TransactionsState = {};

    const result = matchIsTransactionConfirmed(
      transactionsState,
      chainId,
      transaction.hash
    );

    expect(result).toBe(false);
  });
});
