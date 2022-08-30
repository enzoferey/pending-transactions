/**
 * @vitest-environment jsdom
 */

import { describe, it, vi, Mock, expect } from "vitest";

import { renderHook } from "@testing-library/react";

import { MOCK_CHAIN_ID_1 } from "../../test-utils";

import type { TransactionsState } from "../../types";

import type { StorageService } from "../types";

import { useTransactionsState } from "../hooks/useTransactionsState";
import { useTransactionsSelectors } from "../hooks/useTransactionsSelectors";
import { useTransactionsMatchers } from "../hooks/useTransactionsMatchers";
import { useTransactionsActions } from "../hooks/useTransactionsActions";
import { useCheckTransactions } from "../hooks/useCheckTransactions";

import { usePendingTransactions } from "../usePendingTransactions";

vi.mock("../hooks/useTransactionsState");
vi.mock("../hooks/useTransactionsSelectors");
vi.mock("../hooks/useTransactionsMatchers");
vi.mock("../hooks/useTransactionsActions");
vi.mock("../hooks/useCheckTransactions");

describe("usePendingTransactions", () => {
  it("should wire all hooks together", () => {
    const chainId = MOCK_CHAIN_ID_1;
    const lastBlockNumber = 100;
    const storageKey = "test-key";
    const storageService = {} as StorageService;
    const getTransactionReceipt = vi.fn();
    const getOracleTransactionReceipt = vi.fn();
    const onSuccess = vi.fn();
    const onFailure = vi.fn();

    // State
    const mockedState: TransactionsState = {};
    const mockedSetState = vi.fn();

    // Selectors
    const mockGetAllChainTransactions = vi.fn();
    const mockGetChainTransaction = vi.fn();

    // Matchers
    const mockMatchIsTransactionPending = vi.fn();
    const mockMatchIsTransactionConfirmed = vi.fn();
    const mockMatchIsOracleTransactionPending = vi.fn();
    const mockMatchIsOracleTransactionConfirmed = vi.fn();

    // Actions
    const mockAddTransaction = vi.fn();
    const mockAddOracleTransaction = vi.fn();
    const mockUpdateTransactionLastChecked = vi.fn();
    const mockConfirmTransaction = vi.fn();
    const mockConfirmOracleTransaction = vi.fn();
    const mockClearAllChainTransactions = vi.fn();

    (useTransactionsState as Mock).mockImplementation(() => {
      return { state: mockedState, setState: mockedSetState };
    });
    (useTransactionsSelectors as Mock).mockImplementation(() => {
      return {
        getAllChainTransactions: mockGetAllChainTransactions,
        getChainTransaction: mockGetChainTransaction,
      };
    });
    (useTransactionsMatchers as Mock).mockImplementation(() => {
      return {
        matchIsTransactionPending: mockMatchIsTransactionPending,
        matchIsTransactionConfirmed: mockMatchIsTransactionConfirmed,
        matchIsOracleTransactionPending: mockMatchIsOracleTransactionPending,
        matchIsOracleTransactionConfirmed:
          mockMatchIsOracleTransactionConfirmed,
      };
    });
    (useTransactionsActions as Mock).mockImplementation(() => {
      return {
        addTransaction: mockAddTransaction,
        addOracleTransaction: mockAddOracleTransaction,
        updateTransactionLastChecked: mockUpdateTransactionLastChecked,
        confirmTransaction: mockConfirmTransaction,
        confirmOracleTransaction: mockConfirmOracleTransaction,
        clearAllChainTransactions: mockClearAllChainTransactions,
      };
    });
    (useCheckTransactions as Mock).mockImplementation(() => {
      return;
    });

    const { result } = renderHook(() => {
      return usePendingTransactions({
        chainId,
        lastBlockNumber,
        storageKey,
        storageService,
        getTransactionReceipt,
        getOracleTransactionReceipt,
        onSuccess,
        onFailure,
      });
    });

    expect(result.current).toEqual({
      state: mockedState,
      getAllChainTransactions: mockGetAllChainTransactions,
      getChainTransaction: mockGetChainTransaction,
      matchIsTransactionPending: mockMatchIsTransactionPending,
      matchIsTransactionConfirmed: mockMatchIsTransactionConfirmed,
      matchIsOracleTransactionPending: mockMatchIsOracleTransactionPending,
      matchIsOracleTransactionConfirmed: mockMatchIsOracleTransactionConfirmed,
      addTransaction: mockAddTransaction,
      addOracleTransaction: mockAddOracleTransaction,
      updateTransactionLastChecked: mockUpdateTransactionLastChecked,
      confirmTransaction: mockConfirmTransaction,
      confirmOracleTransaction: mockConfirmOracleTransaction,
      clearAllChainTransactions: mockClearAllChainTransactions,
    });

    expect(useTransactionsState).toHaveBeenCalledTimes(1);
    expect(useTransactionsState).toHaveBeenCalledWith({
      storageKey,
      storageService,
    });

    expect(useTransactionsSelectors).toHaveBeenCalledTimes(1);
    expect(useTransactionsSelectors).toHaveBeenCalledWith({
      state: mockedState,
      chainId,
    });

    expect(useTransactionsMatchers).toHaveBeenCalledTimes(1);
    expect(useTransactionsMatchers).toHaveBeenCalledWith({
      state: mockedState,
      chainId,
    });

    expect(useTransactionsActions).toHaveBeenCalledTimes(1);
    expect(useTransactionsActions).toHaveBeenCalledWith({
      storageKey,
      storageService,
      setState: mockedSetState,
    });

    expect(useCheckTransactions).toHaveBeenCalledTimes(1);
    expect(useCheckTransactions).toHaveBeenCalledWith({
      chainId,
      lastBlockNumber,
      getAllChainTransactions: mockGetAllChainTransactions,
      getTransactionReceipt,
      getOracleTransactionReceipt,
      updateTransactionLastChecked: mockUpdateTransactionLastChecked,
      confirmTransaction: mockConfirmTransaction,
      confirmOracleTransaction: mockConfirmOracleTransaction,
      onSuccess,
      onFailure,
    });
  });
});
