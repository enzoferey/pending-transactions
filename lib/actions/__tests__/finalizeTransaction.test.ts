import { describe, expect, it, vi } from "vitest";

import {
  MOCK_CHAIN_ID_1,
  MOCK_CHAIN_ID_2,
  MOCK_TRANSACTION,
  MOCK_TRANSACTION_RECEIPT,
} from "../../test-utils";

import type { ChainTransactionsState, TransactionsState } from "../../types";

import { finalizeTransaction } from "../finalizeTransaction";

const MOCKED_NOW = 123456789;

vi.mock("../../utils/getNow", () => {
  return {
    getNow: () => {
      return MOCKED_NOW;
    },
  };
});

describe("finalizeTransaction", () => {
  it("should set the receipt and confirmed time of the transaction", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_TRANSACTION;

    const transactionState: TransactionsState = {
      [chainId]: {
        [transaction.hash]: transaction,
      },
    };

    expect(transactionState[chainId]?.[transaction.hash]?.receipt).toBe(
      undefined
    );
    expect(transactionState[chainId]?.[transaction.hash]?.confirmedTime).toBe(
      undefined
    );

    finalizeTransaction(transactionState, {
      chainId,
      hash: transaction.hash,
      receipt: MOCK_TRANSACTION_RECEIPT,
    });

    expect(transactionState[chainId]?.[transaction.hash]?.receipt).toEqual(
      MOCK_TRANSACTION_RECEIPT
    );
    expect(transactionState[chainId]?.[transaction.hash]?.confirmedTime).toBe(
      MOCKED_NOW
    );
  });
  it("should change the transaction reference", () => {
    const chainId = MOCK_CHAIN_ID_1;

    const transaction = MOCK_TRANSACTION;

    const transactionState: TransactionsState = {
      [chainId]: {
        [transaction.hash]: transaction,
      },
    };

    expect(transaction.receipt).toBe(undefined);
    expect(transaction.confirmedTime).toBe(undefined);

    finalizeTransaction(transactionState, {
      chainId,
      hash: transaction.hash,
      receipt: MOCK_TRANSACTION_RECEIPT,
    });

    expect(transaction.receipt).toBe(undefined);
    expect(transaction.confirmedTime).toBe(undefined);

    expect(transactionState[chainId]?.[transaction.hash]).not.toBe(transaction);
  });
  it("should do nothing if the transaction chain id state is empty", () => {
    const chainId = MOCK_CHAIN_ID_1;
    const otherChainId = MOCK_CHAIN_ID_2;

    const otherChainTransactions: ChainTransactionsState = {};

    const transactionState: TransactionsState = {
      [otherChainId]: otherChainTransactions,
    };

    finalizeTransaction(transactionState, {
      chainId,
      hash: "NON EXISTING HASH",
      receipt: MOCK_TRANSACTION_RECEIPT,
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

    finalizeTransaction(transactionState, {
      chainId,
      hash: "NON EXISTING HASH",
      receipt: MOCK_TRANSACTION_RECEIPT,
    });

    expect(transactionState[chainId]).toEqual({});
    expect(transactionState[chainId]).toBe(chainTransactions);

    expect(transactionState[otherChainId]).toEqual({});
    expect(transactionState[otherChainId]).toBe(otherChainTransactions);
  });
});
