import { describe, expect, it } from "vitest";
import {
  MOCK_CHAIN_ID_1,
  MOCK_CHAIN_ID_2,
  MOCK_TRANSACTION,
  MOCK_TRANSACTION_HASH_1,
} from "../../test-utils";

import type { ChainTransactionsState, TransactionsState } from "../../types";

import { updateTransactionLastChecked } from "../updateTransactionLastChecked";

describe("updateTransactionLastChecked", () => {
  it("should set the last checked block number of the transaction", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_TRANSACTION;

    const transactionState: TransactionsState = {
      [chainId]: {
        [transaction.hash]: transaction,
      },
    };

    expect(
      transactionState[chainId]?.[transaction.hash]?.lastCheckedBlockNumber
    ).toBe(undefined);

    const blockNumber = 123;

    updateTransactionLastChecked(transactionState, {
      chainId,
      hash: transaction.hash,
      blockNumber,
    });

    expect(
      transactionState[chainId]?.[transaction.hash]?.lastCheckedBlockNumber
    ).toEqual(blockNumber);
  });
  it("should set the bigger last checked block number of the transaction", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const lastCheckedBlockNumber = 123;

    const transaction = {
      ...MOCK_TRANSACTION,
      lastCheckedBlockNumber: lastCheckedBlockNumber,
    };

    const transactionState: TransactionsState = {
      [chainId]: {
        [transaction.hash]: transaction,
      },
    };

    expect(
      transactionState[chainId]?.[transaction.hash]?.lastCheckedBlockNumber
    ).toBe(lastCheckedBlockNumber);

    updateTransactionLastChecked(transactionState, {
      chainId,
      hash: MOCK_TRANSACTION_HASH_1,
      blockNumber: lastCheckedBlockNumber - 1,
    });

    expect(
      transactionState[chainId]?.[transaction.hash]?.lastCheckedBlockNumber
    ).toBe(lastCheckedBlockNumber);
  });
  it("should change the transaction reference", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_TRANSACTION;

    const transactionState: TransactionsState = {
      [chainId]: {
        [transaction.hash]: transaction,
      },
    };

    expect(transaction.lastCheckedBlockNumber).toBe(undefined);

    updateTransactionLastChecked(transactionState, {
      chainId,
      hash: MOCK_TRANSACTION_HASH_1,
      blockNumber: 123,
    });

    expect(transaction.lastCheckedBlockNumber).toBe(undefined);

    expect(transactionState[chainId]?.[transaction.hash]).not.toBe(transaction);
  });
  it("should do nothing if the transaction chain id state is empty", () => {
    const chainId = MOCK_CHAIN_ID_1;
    const otherChainId = MOCK_CHAIN_ID_2;

    const otherChainTransactions: ChainTransactionsState = {};

    const transactionState: TransactionsState = {
      [otherChainId]: otherChainTransactions,
    };

    updateTransactionLastChecked(transactionState, {
      chainId,
      hash: MOCK_TRANSACTION_HASH_1,
      blockNumber: 0,
    });

    expect(transactionState[chainId]).toBe(undefined);

    expect(transactionState[otherChainId]).toEqual({});
    expect(transactionState[otherChainId]).toBe(otherChainTransactions);
  });
  it("should do nothing if the transaction hash state is empty", () => {
    const chainId = MOCK_CHAIN_ID_1;
    const otherChainId = MOCK_CHAIN_ID_2;

    const chainTransactions: ChainTransactionsState = {};
    const otherChainTransactions: ChainTransactionsState = {};

    const transactionState: TransactionsState = {
      [chainId]: chainTransactions,
      [otherChainId]: otherChainTransactions,
    };

    updateTransactionLastChecked(transactionState, {
      chainId,
      hash: MOCK_TRANSACTION_HASH_1,
      blockNumber: 0,
    });

    expect(transactionState[chainId]).toEqual({});
    expect(transactionState[chainId]).toBe(chainTransactions);

    expect(transactionState[otherChainId]).toEqual({});
    expect(transactionState[otherChainId]).toBe(otherChainTransactions);
  });
});
