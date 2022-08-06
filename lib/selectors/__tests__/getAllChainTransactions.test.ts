import { describe, expect, it } from "vitest";

import { MOCK_CHAIN_ID_1, MOCK_TRANSACTION } from "../../test-utils";

import type { ChainTransactionsState, TransactionsState } from "../../types";

import { getAllChainTransactions } from "../getAllChainTransactions";

describe("getAllChainTransactions", () => {
  it("should return the transactions for the given chain", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const chainTransactions: ChainTransactionsState = {
      [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
    };

    const transactionsState: TransactionsState = {
      [chainId]: chainTransactions,
    };

    const result = getAllChainTransactions(transactionsState, chainId);

    expect(result).toBe(chainTransactions);
  });
  it("should return an empty object if the state does not have transactions for the given chain", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transactionsState: TransactionsState = {};

    const result = getAllChainTransactions(transactionsState, chainId);

    expect(result).toEqual({});
  });
});
