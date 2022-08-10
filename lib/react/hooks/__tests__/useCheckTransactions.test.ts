/**
 * @vitest-environment jsdom
 */

import { describe, it, vi, Mock, expect } from "vitest";

import { renderHook } from "@testing-library/react";

import { useIsWindowActive } from "../../../hooks/useIsWindowActive";
import { useIsOnline } from "../../../hooks/useIsOnline";

import type { ChainTransactionsState } from "../../../types";

import { useCheckTransactions } from "../useCheckTransactions";
import {
  MOCK_CHAIN_ID_1,
  MOCK_CONFIRMED_ORACLE_TRANSACTION,
  MOCK_CONFIRMED_TRANSACTION,
  MOCK_NON_SUCCESSFUL_TRANSACTION_RECEIPT,
  MOCK_ORACLE_TRANSACTION,
  MOCK_ORACLE_TRANSACTION_WITH_CONFIRMED_TRANSACTION,
  MOCK_SUCCESSFUL_TRANSACTION_RECEIPT,
  MOCK_TRANSACTION,
} from "../../../test-utils";

vi.mock("../../../hooks/useIsWindowActive");
vi.mock("../../../hooks/useIsOnline");

describe("useCheckTransactions", () => {
  it("should check transactions that need to be checked", async () => {
    (useIsWindowActive as Mock).mockImplementationOnce(() => {
      return true;
    });
    (useIsOnline as Mock).mockImplementationOnce(() => {
      return true;
    });

    const chainId = MOCK_CHAIN_ID_1;
    let lastBlockNumber = 100;

    const transactionToCheck = MOCK_TRANSACTION;
    const transactionNotToCheck = MOCK_CONFIRMED_TRANSACTION;

    const mockAllChainTransactions: ChainTransactionsState = {
      [transactionToCheck.hash]: transactionToCheck,
      [transactionNotToCheck.hash]: transactionNotToCheck,
    };

    const mockGetAllChainTransactions = vi.fn().mockImplementation(() => {
      return mockAllChainTransactions;
    });

    const mockGetTransactionReceipt = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });
    const mockGetOracleTransactionReceipt = vi.fn();

    const mockUpdateTransactionLastChecked = vi.fn();
    const mockConfirmTransaction = vi.fn();
    const mockConfirmOracleTransaction = vi.fn();

    const mockOnSuccess = vi.fn();
    const mockOnFailure = vi.fn();

    const { rerender } = renderHook(
      (props) => {
        return useCheckTransactions({
          chainId,
          lastBlockNumber: props.lastBlockNumber,
          getAllChainTransactions: mockGetAllChainTransactions,
          getTransactionReceipt: mockGetTransactionReceipt,
          getOracleTransactionReceipt: mockGetOracleTransactionReceipt,
          updateTransactionLastChecked: mockUpdateTransactionLastChecked,
          confirmTransaction: mockConfirmTransaction,
          confirmOracleTransaction: mockConfirmOracleTransaction,
          onSuccess: mockOnSuccess,
          onFailure: mockOnFailure,
        });
      },
      { initialProps: { lastBlockNumber } }
    );

    await new Promise(process.nextTick);

    // 1) Receipt is not available
    vi.clearAllMocks();

    mockGetTransactionReceipt.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    lastBlockNumber = lastBlockNumber + 1;
    rerender({ lastBlockNumber });

    await new Promise(process.nextTick);

    expect(mockGetTransactionReceipt).toHaveBeenCalledTimes(1);
    expect(mockGetTransactionReceipt).toHaveBeenCalledWith(
      transactionToCheck,
      lastBlockNumber
    );

    expect(mockGetOracleTransactionReceipt).toHaveBeenCalledTimes(0);

    expect(mockUpdateTransactionLastChecked).toHaveBeenCalledTimes(1);
    expect(mockUpdateTransactionLastChecked).toHaveBeenCalledWith({
      chainId,
      hash: transactionToCheck.hash,
      blockNumber: lastBlockNumber,
    });

    expect(mockOnSuccess).toHaveBeenCalledTimes(0);
    expect(mockOnFailure).toHaveBeenCalledTimes(0);

    // 2) Receipt is available and successful
    vi.clearAllMocks();

    mockGetTransactionReceipt.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve(MOCK_SUCCESSFUL_TRANSACTION_RECEIPT);
      });
    });

    lastBlockNumber = lastBlockNumber + 1;
    rerender({ lastBlockNumber });

    await new Promise(process.nextTick);

    expect(mockGetTransactionReceipt).toHaveBeenCalledTimes(1);
    expect(mockGetTransactionReceipt).toHaveBeenCalledWith(
      transactionToCheck,
      lastBlockNumber
    );

    expect(mockGetOracleTransactionReceipt).toHaveBeenCalledTimes(0);

    expect(mockConfirmTransaction).toHaveBeenCalledTimes(1);
    expect(mockConfirmTransaction).toHaveBeenCalledWith({
      chainId,
      hash: transactionToCheck.hash,
      receipt: MOCK_SUCCESSFUL_TRANSACTION_RECEIPT,
    });

    expect(mockConfirmOracleTransaction).toHaveBeenCalledTimes(0);

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnSuccess).toHaveBeenCalledWith(transactionToCheck);

    // 3) Receipt is available and not successful
    vi.clearAllMocks();

    mockGetTransactionReceipt.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve(MOCK_NON_SUCCESSFUL_TRANSACTION_RECEIPT);
      });
    });

    lastBlockNumber = lastBlockNumber + 1;
    rerender({ lastBlockNumber });

    await new Promise(process.nextTick);

    expect(mockGetTransactionReceipt).toHaveBeenCalledTimes(1);
    expect(mockGetTransactionReceipt).toHaveBeenCalledWith(
      transactionToCheck,
      lastBlockNumber
    );

    expect(mockGetOracleTransactionReceipt).toHaveBeenCalledTimes(0);

    expect(mockConfirmTransaction).toHaveBeenCalledTimes(1);
    expect(mockConfirmTransaction).toHaveBeenCalledWith({
      chainId,
      hash: transactionToCheck.hash,
      receipt: MOCK_NON_SUCCESSFUL_TRANSACTION_RECEIPT,
    });

    expect(mockConfirmOracleTransaction).toHaveBeenCalledTimes(0);

    expect(mockOnFailure).toHaveBeenCalledTimes(1);
    expect(mockOnFailure).toHaveBeenCalledWith(transactionToCheck);
  });
  it("should check oracle transactions that need to be checked", async () => {
    (useIsWindowActive as Mock).mockImplementationOnce(() => {
      return true;
    });
    (useIsOnline as Mock).mockImplementationOnce(() => {
      return true;
    });

    const chainId = MOCK_CHAIN_ID_1;
    let lastBlockNumber = 100;

    const transactionToCheck =
      MOCK_ORACLE_TRANSACTION_WITH_CONFIRMED_TRANSACTION;
    const transactionNotToCheck = MOCK_CONFIRMED_ORACLE_TRANSACTION;

    const mockAllChainTransactions: ChainTransactionsState = {
      [transactionToCheck.hash]: transactionToCheck,
      [transactionNotToCheck.hash]: transactionNotToCheck,
    };

    const mockGetAllChainTransactions = vi.fn().mockImplementation(() => {
      return mockAllChainTransactions;
    });

    const mockGetTransactionReceipt = vi.fn();
    const mockGetOracleTransactionReceipt = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    const mockUpdateTransactionLastChecked = vi.fn();
    const mockConfirmTransaction = vi.fn();
    const mockConfirmOracleTransaction = vi.fn();

    const mockOnSuccess = vi.fn();
    const mockOnFailure = vi.fn();

    const { rerender } = renderHook(
      (props) => {
        return useCheckTransactions({
          chainId,
          lastBlockNumber: props.lastBlockNumber,
          getAllChainTransactions: mockGetAllChainTransactions,
          getTransactionReceipt: mockGetTransactionReceipt,
          getOracleTransactionReceipt: mockGetOracleTransactionReceipt,
          updateTransactionLastChecked: mockUpdateTransactionLastChecked,
          confirmTransaction: mockConfirmTransaction,
          confirmOracleTransaction: mockConfirmOracleTransaction,
          onSuccess: mockOnSuccess,
          onFailure: mockOnFailure,
        });
      },
      { initialProps: { lastBlockNumber } }
    );

    await new Promise(process.nextTick);

    // 1) Receipt is not available
    vi.clearAllMocks();

    mockGetOracleTransactionReceipt.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    });

    lastBlockNumber = lastBlockNumber + 1;
    rerender({ lastBlockNumber });

    await new Promise(process.nextTick);

    expect(mockGetOracleTransactionReceipt).toHaveBeenCalledTimes(1);
    expect(mockGetOracleTransactionReceipt).toHaveBeenCalledWith(
      transactionToCheck,
      lastBlockNumber
    );

    expect(mockGetTransactionReceipt).toHaveBeenCalledTimes(0);

    expect(mockUpdateTransactionLastChecked).toHaveBeenCalledTimes(1);
    expect(mockUpdateTransactionLastChecked).toHaveBeenCalledWith({
      chainId,
      hash: transactionToCheck.hash,
      blockNumber: lastBlockNumber,
    });

    expect(mockOnSuccess).toHaveBeenCalledTimes(0);
    expect(mockOnFailure).toHaveBeenCalledTimes(0);

    // 2) Receipt is available and successful
    vi.clearAllMocks();

    mockGetOracleTransactionReceipt.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve(MOCK_SUCCESSFUL_TRANSACTION_RECEIPT);
      });
    });

    lastBlockNumber = lastBlockNumber + 1;
    rerender({ lastBlockNumber });

    await new Promise(process.nextTick);

    expect(mockGetOracleTransactionReceipt).toHaveBeenCalledTimes(1);
    expect(mockGetOracleTransactionReceipt).toHaveBeenCalledWith(
      transactionToCheck,
      lastBlockNumber
    );

    expect(mockGetTransactionReceipt).toHaveBeenCalledTimes(0);

    expect(mockConfirmOracleTransaction).toHaveBeenCalledTimes(1);
    expect(mockConfirmOracleTransaction).toHaveBeenCalledWith({
      chainId,
      hash: transactionToCheck.hash,
      oracleReceipt: MOCK_SUCCESSFUL_TRANSACTION_RECEIPT,
    });

    expect(mockConfirmTransaction).toHaveBeenCalledTimes(0);

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnSuccess).toHaveBeenCalledWith(transactionToCheck);

    // 3) Receipt is available and not successful
    vi.clearAllMocks();

    mockGetOracleTransactionReceipt.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve(MOCK_NON_SUCCESSFUL_TRANSACTION_RECEIPT);
      });
    });

    lastBlockNumber = lastBlockNumber + 1;
    rerender({ lastBlockNumber });

    await new Promise(process.nextTick);

    expect(mockGetOracleTransactionReceipt).toHaveBeenCalledTimes(1);
    expect(mockGetOracleTransactionReceipt).toHaveBeenCalledWith(
      transactionToCheck,
      lastBlockNumber
    );

    expect(mockGetTransactionReceipt).toHaveBeenCalledTimes(0);

    expect(mockConfirmOracleTransaction).toHaveBeenCalledTimes(1);
    expect(mockConfirmOracleTransaction).toHaveBeenCalledWith({
      chainId,
      hash: transactionToCheck.hash,
      oracleReceipt: MOCK_NON_SUCCESSFUL_TRANSACTION_RECEIPT,
    });

    expect(mockConfirmTransaction).toHaveBeenCalledTimes(0);

    expect(mockOnFailure).toHaveBeenCalledTimes(1);
    expect(mockOnFailure).toHaveBeenCalledWith(transactionToCheck);
  });
  it("should pause checking if the window is not active", () => {
    (useIsWindowActive as Mock).mockImplementationOnce(() => {
      return false;
    });
    (useIsOnline as Mock).mockImplementationOnce(() => {
      return true;
    });

    const chainId = MOCK_CHAIN_ID_1;
    const lastBlockNumber = 100;

    const getAllChainTransactions = vi.fn();

    const getTransactionReceipt = vi.fn();
    const getOracleTransactionReceipt = vi.fn();

    const updateTransactionLastChecked = vi.fn();
    const confirmTransaction = vi.fn();
    const confirmOracleTransaction = vi.fn();

    const onSuccess = vi.fn();
    const onFailure = vi.fn();

    renderHook(() => {
      return useCheckTransactions({
        chainId,
        lastBlockNumber,
        getAllChainTransactions,
        getTransactionReceipt,
        getOracleTransactionReceipt,
        updateTransactionLastChecked,
        confirmTransaction,
        confirmOracleTransaction,
        onSuccess,
        onFailure,
      });
    });

    expect(getTransactionReceipt).toHaveBeenCalledTimes(0);
    expect(getOracleTransactionReceipt).toHaveBeenCalledTimes(0);
  });
  it("should pause checking if the network is offline", () => {
    (useIsWindowActive as Mock).mockImplementationOnce(() => {
      return true;
    });
    (useIsOnline as Mock).mockImplementationOnce(() => {
      return false;
    });

    const chainId = MOCK_CHAIN_ID_1;
    const lastBlockNumber = 100;

    const getAllChainTransactions = vi.fn();

    const getTransactionReceipt = vi.fn();
    const getOracleTransactionReceipt = vi.fn();

    const updateTransactionLastChecked = vi.fn();
    const confirmTransaction = vi.fn();
    const confirmOracleTransaction = vi.fn();

    const onSuccess = vi.fn();
    const onFailure = vi.fn();

    renderHook(() => {
      return useCheckTransactions({
        chainId,
        lastBlockNumber,
        getAllChainTransactions,
        getTransactionReceipt,
        getOracleTransactionReceipt,
        updateTransactionLastChecked,
        confirmTransaction,
        confirmOracleTransaction,
        onSuccess,
        onFailure,
      });
    });

    expect(getTransactionReceipt).toHaveBeenCalledTimes(0);
    expect(getOracleTransactionReceipt).toHaveBeenCalledTimes(0);
  });
});
