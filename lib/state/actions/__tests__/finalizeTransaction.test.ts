import { describe, expect, it, vi } from "vitest";

import {
  MOCK_CHAIN_ID_1,
  MOCK_CHAIN_ID_2,
  MOCK_TRANSACTION,
  MOCK_TRANSACTION_HASH_1,
  MOCK_TRANSACTION_RECEIPT,
} from "../../../test-utils";

import type { ChainTransactionsState, TransactionsState } from "../../../types";

import { finalizeTransaction } from "../finalizeTransaction";

const MOCKED_NOW = 123456789;

vi.mock("../../../utils/getNow", () => {
  return {
    getNow: () => {
      return MOCKED_NOW;
    },
  };
});

describe("finalizeTransaction", () => {
  describe("logic", () => {
    it("should set the receipt and confirmed time of the transaction", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transaction = MOCK_TRANSACTION;

      const transactionsState: TransactionsState = {
        [chainId]: {
          [transaction.hash]: transaction,
        },
      };

      expect(transactionsState[chainId]?.[transaction.hash]?.receipt).toBe(
        undefined
      );
      expect(
        transactionsState[chainId]?.[transaction.hash]?.confirmedTime
      ).toBe(undefined);

      const result = finalizeTransaction(transactionsState, {
        chainId,
        hash: transaction.hash,
        receipt: MOCK_TRANSACTION_RECEIPT,
      });

      expect(result[chainId]?.[transaction.hash]?.receipt).toEqual(
        MOCK_TRANSACTION_RECEIPT
      );
      expect(result[chainId]?.[transaction.hash]?.confirmedTime).toBe(
        MOCKED_NOW
      );
    });
    it("should do nothing if the transaction chain id state is empty", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transactionsState: TransactionsState = {};

      const result = finalizeTransaction(transactionsState, {
        chainId,
        hash: MOCK_TRANSACTION_HASH_1,
        receipt: MOCK_TRANSACTION_RECEIPT,
      });

      expect(result).toBe(transactionsState);
      expect(result).toEqual({});
    });
    it("should do nothing if the transaction hash state is empty", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transactionsState: TransactionsState = {
        [chainId]: {},
      };

      const result = finalizeTransaction(transactionsState, {
        chainId,
        hash: MOCK_TRANSACTION_HASH_1,
        receipt: MOCK_TRANSACTION_RECEIPT,
      });

      expect(result).toBe(transactionsState);
      expect(result).toEqual({
        [chainId]: {},
      });
    });
  });
  describe("pureness", () => {
    it("should return a new state object", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transaction = MOCK_TRANSACTION;

      const transactionsState: TransactionsState = {
        [chainId]: {
          [transaction.hash]: transaction,
        },
      };

      const result = finalizeTransaction(transactionsState, {
        chainId,
        hash: transaction.hash,
        receipt: MOCK_TRANSACTION_RECEIPT,
      });

      expect(result).not.toBe(transactionsState);
    });
    it("should return a new chain transactions object", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transaction = MOCK_TRANSACTION;

      const chainTransactions: ChainTransactionsState = {
        [transaction.hash]: transaction,
      };

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
      };

      const result = finalizeTransaction(transactionsState, {
        chainId,
        hash: transaction.hash,
        receipt: MOCK_TRANSACTION_RECEIPT,
      });

      expect(result[chainId]).not.toBe(chainTransactions);
    });
    it("should return a new transaction object", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transaction = MOCK_TRANSACTION;

      const chainTransactions: ChainTransactionsState = {
        [transaction.hash]: transaction,
      };

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
      };

      const result = finalizeTransaction(transactionsState, {
        chainId,
        hash: transaction.hash,
        receipt: MOCK_TRANSACTION_RECEIPT,
      });

      expect(result[chainId]?.[transaction.hash]).not.toBe(transaction);
    });
    it("should not mutate the received state", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transaction = MOCK_TRANSACTION;

      const chainTransactions: ChainTransactionsState = {
        [transaction.hash]: transaction,
      };

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
      };

      const result = finalizeTransaction(transactionsState, {
        chainId,
        hash: transaction.hash,
        receipt: MOCK_TRANSACTION_RECEIPT,
      });

      expect(result).not.toBe(transactionsState);

      expect(transactionsState).toEqual({
        [chainId]: chainTransactions,
      });
      expect(chainTransactions).toEqual({
        [transaction.hash]: transaction,
      });
    });
    it("should not mutate transactions of other chains neither in value nor in reference", () => {
      const chainId = MOCK_CHAIN_ID_1;
      const otherChainId = MOCK_CHAIN_ID_2;

      const transaction = MOCK_TRANSACTION;

      const chainTransactions: ChainTransactionsState = {
        [transaction.hash]: transaction,
      };
      const otherChainTransactions: ChainTransactionsState = {
        [transaction.hash]: transaction,
      };

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
        [otherChainId]: otherChainTransactions,
      };

      const result = finalizeTransaction(transactionsState, {
        chainId,
        hash: transaction.hash,
        receipt: MOCK_TRANSACTION_RECEIPT,
      });

      expect(result[otherChainId]).toBe(otherChainTransactions);
      expect(result[otherChainId]).toEqual({
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      });
    });
    it("should not mutate the other transactions in same chain neither in value nor in reference", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transaction = MOCK_TRANSACTION;
      const otherTransaction = { ...MOCK_TRANSACTION, hash: "OTHER HASH" };

      const chainTransactions: ChainTransactionsState = {
        [transaction.hash]: transaction,
        [otherTransaction.hash]: otherTransaction,
      };

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
      };

      const result = finalizeTransaction(transactionsState, {
        chainId,
        hash: transaction.hash,
        receipt: MOCK_TRANSACTION_RECEIPT,
      });

      expect(result[chainId]?.[otherTransaction.hash]).toBe(otherTransaction);
      expect(result[chainId]?.[otherTransaction.hash]).toEqual({
        ...MOCK_TRANSACTION,
        hash: "OTHER HASH",
      });
    });
  });
});
