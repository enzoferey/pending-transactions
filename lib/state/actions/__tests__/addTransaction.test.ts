import { describe, expect, it, vi } from "vitest";

import {
  MOCK_CHAIN_ID_1,
  MOCK_CHAIN_ID_2,
  MOCK_ADDRESS_1,
  MOCK_TRANSACTION_HASH_1,
  MOCK_TRANSACTION_TYPE,
  MOCK_TRANSACTION,
} from "../../../test-utils";

import type { ChainTransactionsState, TransactionsState } from "../../../types";

import { addTransaction, AddTransactionPayload } from "../addTransaction";

vi.mock("../../../utils/getNow", () => {
  return {
    getNow: () => {
      return 1662458754000;
    },
  };
});

describe("addTransaction", () => {
  describe("logic", () => {
    it("should add a transaction to the state", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const chainTransactions: ChainTransactionsState = {};

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
      };

      const transactionPayload: AddTransactionPayload = {
        chainId,
        from: MOCK_ADDRESS_1,
        hash: MOCK_TRANSACTION_HASH_1,
        info: { type: MOCK_TRANSACTION_TYPE },
      };

      const result = addTransaction(transactionsState, transactionPayload);

      expect(result[chainId]?.[transactionPayload.hash]).toMatchInlineSnapshot(`
        {
          "addedTime": 1662458754000,
          "from": "0x0000000000000000000000000000000000000001",
          "hash": "0x1000000000000000000000000000000000000001",
          "info": {
            "type": "test-type",
          },
        }
      `);
    });
    it("should add a transaction to the state when no transactions exist for that chain id yet", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transactionsState: TransactionsState = {};

      const transactionPayload: AddTransactionPayload = {
        chainId,
        from: MOCK_ADDRESS_1,
        hash: MOCK_TRANSACTION_HASH_1,
        info: { type: MOCK_TRANSACTION_TYPE },
      };

      const result = addTransaction(transactionsState, transactionPayload);

      expect(result[chainId]).toMatchInlineSnapshot(`
        {
          "0x1000000000000000000000000000000000000001": {
            "addedTime": 1662458754000,
            "from": "0x0000000000000000000000000000000000000001",
            "hash": "0x1000000000000000000000000000000000000001",
            "info": {
              "type": "test-type",
            },
          },
        }
      `);
    });
    it("should throw an error if the transaction already exists", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transactionPayload: AddTransactionPayload = {
        chainId,
        from: MOCK_ADDRESS_1,
        hash: MOCK_TRANSACTION_HASH_1,
        info: { type: MOCK_TRANSACTION_TYPE },
      };

      const transactionsState: TransactionsState = {
        [chainId]: {
          [transactionPayload.hash]: {
            from: transactionPayload.from,
            hash: transactionPayload.hash,
            info: transactionPayload.info,
            addedTime: 0,
          },
        },
      };

      expect(() => {
        addTransaction(transactionsState, transactionPayload);
      }).toThrowError("TRANSACTION_HASH_ALREADY_ADDED");
    });
  });
  describe("pureness", () => {
    it("should return a new state object", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const chainTransactions: ChainTransactionsState = {};

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
      };

      const transactionPayload: AddTransactionPayload = {
        chainId,
        from: MOCK_ADDRESS_1,
        hash: MOCK_TRANSACTION_HASH_1,
        info: { type: MOCK_TRANSACTION_TYPE },
      };

      const result = addTransaction(transactionsState, transactionPayload);

      expect(result).not.toBe(transactionsState);
    });
    it("should not mutate the received state", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const chainTransactions: ChainTransactionsState = {};

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
      };

      const transactionPayload: AddTransactionPayload = {
        chainId,
        from: MOCK_ADDRESS_1,
        hash: MOCK_TRANSACTION_HASH_1,
        info: { type: MOCK_TRANSACTION_TYPE },
      };

      addTransaction(transactionsState, transactionPayload);

      expect(transactionsState).toEqual({
        [chainId]: chainTransactions,
      });
      expect(chainTransactions).toEqual({});
    });
    it("should not mutate transactions of other chains neither in value nor in reference", () => {
      const chainId = MOCK_CHAIN_ID_1;
      const otherChainId = MOCK_CHAIN_ID_2;

      const chainTransactions: ChainTransactionsState = {};
      const otherChainTransactions: ChainTransactionsState = {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      };

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
        [otherChainId]: otherChainTransactions,
      };

      const transactionPayload: AddTransactionPayload = {
        chainId,
        from: MOCK_ADDRESS_1,
        hash: MOCK_TRANSACTION_HASH_1,
        info: { type: MOCK_TRANSACTION_TYPE },
      };

      const result = addTransaction(transactionsState, transactionPayload);

      expect(result[otherChainId]).toBe(otherChainTransactions);
      expect(result[otherChainId]).toEqual({
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      });
    });
    it("should not mutate the other transactions in same chain neither in value nor in reference", () => {
      const chainId = MOCK_CHAIN_ID_1;

      const transaction = { ...MOCK_TRANSACTION };

      const chainTransactions: ChainTransactionsState = {
        [transaction.hash]: transaction,
      };

      const transactionsState: TransactionsState = {
        [chainId]: chainTransactions,
      };

      const transactionPayload: AddTransactionPayload = {
        chainId,
        from: MOCK_ADDRESS_1,
        hash: MOCK_TRANSACTION_HASH_1,
        info: { type: MOCK_TRANSACTION_TYPE },
      };

      const result = addTransaction(transactionsState, transactionPayload);

      expect(result[chainId]?.[transaction.hash]).toBe(transaction);
      expect(result[chainId]?.[transaction.hash]).toEqual(MOCK_TRANSACTION);
    });
  });
});
