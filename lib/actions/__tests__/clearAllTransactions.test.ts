import { describe, expect, it } from "vitest";

import {
  MOCK_CHAIN_ID_1,
  MOCK_CHAIN_ID_2,
  MOCK_TRANSACTION,
} from "../../test-utils";

import type { ChainTransactionsState, TransactionsState } from "../../types";

import { clearAllTransactions } from "../clearAllTransactions";

describe("clearAllTransactions", () => {
  it("should clear all transactions for a given chain id", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const chainTransactions: ChainTransactionsState = {
      [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
    };

    const transactionsState: TransactionsState = {
      [chainId]: chainTransactions,
    };

    clearAllTransactions(transactionsState, { chainId });

    expect(transactionsState[chainId]).toEqual({});
  });
  it("should mutate the chain transaction state for the given chain", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const chainTransactions: ChainTransactionsState = {
      [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
    };

    const transactionsState: TransactionsState = {
      [chainId]: chainTransactions,
    };

    clearAllTransactions(transactionsState, { chainId });

    expect(transactionsState[chainId]).not.toBe(chainTransactions);
  });
  it("should not clear transactions of other chains nor change their reference", () => {
    const chainId = MOCK_CHAIN_ID_1;
    const otherChainId = MOCK_CHAIN_ID_2;

    const otherChainTransactions: ChainTransactionsState = {
      [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
    };

    const transactionsState: TransactionsState = {
      [chainId]: {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      },
      [otherChainId]: otherChainTransactions,
    };

    clearAllTransactions(transactionsState, { chainId });

    expect(transactionsState[otherChainId]).not.toEqual({});
    expect(transactionsState[otherChainId]).toBe(otherChainTransactions);
  });
  it("should do nothing if there are no transactions for the given chain id", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transactionsState: TransactionsState = {};

    clearAllTransactions(transactionsState, { chainId });

    expect(transactionsState[chainId]).toBe(undefined);
  });
});
