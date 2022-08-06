import { describe, expect, it, vi } from "vitest";

import {
  MOCK_CHAIN_ID_1,
  MOCK_CHAIN_ID_2,
  MOCK_ADDRESS_1,
  MOCK_TRANSACTION_HASH_1,
  MOCK_TRANSACTION_TYPE,
} from "../../test-utils";

import type { ChainTransactionsState, TransactionsState } from "../../types";

import { addTransaction, AddTransactionPayload } from "../addTransaction";

vi.mock("../../utils/getNow", () => {
  return {
    getNow: () => {
      return 1662458754000;
    },
  };
});

describe("addTransaction", () => {
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

    addTransaction(transactionsState, transactionPayload);

    // The chain transactions state has not changed reference
    expect(transactionsState[chainId]).toBe(chainTransactions);

    // The chains transactions now include the added transaction
    expect(transactionsState[chainId]?.[transactionPayload.hash])
      .toMatchInlineSnapshot(`
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
  it("should not change other chains transactions state neither in value nor in reference", () => {
    const chainId = MOCK_CHAIN_ID_1;
    const otherChainId = MOCK_CHAIN_ID_2;

    const chainTransactions: ChainTransactionsState = {};
    const otherChainTransactions: ChainTransactionsState = {};

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

    addTransaction(transactionsState, transactionPayload);

    expect(transactionsState[otherChainId]).toEqual({});
    expect(transactionsState[otherChainId]).toBe(otherChainTransactions);
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

    addTransaction(transactionsState, transactionPayload);

    expect(transactionsState[chainId]).toMatchInlineSnapshot(`
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
