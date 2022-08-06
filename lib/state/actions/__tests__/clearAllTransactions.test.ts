import { describe, expect, it } from "vitest";

import {
  MOCK_CHAIN_ID_1,
  MOCK_CHAIN_ID_2,
  MOCK_TRANSACTION,
} from "../../../test-utils";

import type { ChainTransactionsState, TransactionsState } from "../../../types";

import { clearAllTransactions } from "../clearAllTransactions";

describe("clearAllTransactions", () => {
  describe("logic", () => {
    it("should clear all transactions for a given chain id", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const chainTransactions: ChainTransactionsState = {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      };

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
      };

      const result = clearAllTransactions(transactionsState, { chainId });

      expect(result[chainId]).toEqual({});
    });
    it("should do nothing if there are no transactions for the given chain id", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transactionsState: TransactionsState = {};

      const result = clearAllTransactions(transactionsState, { chainId });

      expect(result).toBe(transactionsState);
      expect(result).toEqual({});
    });
  });
  describe("pureness", () => {
    it("should return a new state object", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const chainTransactions: ChainTransactionsState = {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      };

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
      };

      const result = clearAllTransactions(transactionsState, {
        chainId,
      });

      expect(result).not.toBe(transactionsState);
    });
    it("should not mutate the received state", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const chainTransactions: ChainTransactionsState = {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      };

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
      };

      clearAllTransactions(transactionsState, {
        chainId,
      });

      expect(transactionsState).toEqual({
        [chainId]: chainTransactions,
      });
      expect(chainTransactions).toEqual({
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      });
    });
    it("should not mutate transactions of other chains neither in value nor in reference", () => {
      const chainId = MOCK_CHAIN_ID_1;
      const otherChainId = MOCK_CHAIN_ID_2;

      const chainTransactions: ChainTransactionsState = {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      };
      const otherChainTransactions: ChainTransactionsState = {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      };

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
        [otherChainId]: otherChainTransactions,
      };

      const result = clearAllTransactions(transactionsState, { chainId });

      expect(result[otherChainId]).toBe(otherChainTransactions);
      expect(result[otherChainId]).toEqual({
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      });
    });
  });
});
