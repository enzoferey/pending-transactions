import { describe, expect, it } from "vitest";

import { MOCK_CHAIN_ID_1, MOCK_TRANSACTION } from "../../../test-utils";

import type { TransactionsState } from "../../../types";

import { getChainTransaction } from "../getChainTransaction";

describe("getChainTransaction", () => {
  it("should return the transaction", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_TRANSACTION;

    const transactionsState: TransactionsState = {
      [chainId]: {
        [transaction.hash]: transaction,
      },
    };

    const result = getChainTransaction(
      transactionsState,
      chainId,
      transaction.hash
    );

    expect(result).toBe(transaction);
  });
  it("should return undefined if the transaction does not exist on state", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_TRANSACTION;

    const transactionsState: TransactionsState = {};

    const result = getChainTransaction(
      transactionsState,
      chainId,
      transaction.hash
    );

    expect(result).toBe(undefined);
  });
});
