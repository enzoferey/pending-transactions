/**
 * @vitest-environment jsdom
 */

import { describe, expect, it, Mock, vi } from "vitest";

import { renderHook } from "@testing-library/react";

import { MOCK_CHAIN_ID_1, MOCK_TRANSACTION_HASH_1 } from "../../../test-utils";

import type { TransactionsState } from "../../../types";

import * as matchers from "../../../state/matchers";

import { useTransactionsMatchers } from "../useTransactionsMatchers";

vi.mock("../../../state/matchers");

describe("useTransactionsMatchers", () => {
  it("should curry the matchIsTransactionPending matcher", () => {
    const state: TransactionsState = {};
    const chainId = MOCK_CHAIN_ID_1;
    const transactionHash = MOCK_TRANSACTION_HASH_1;

    const mockedMatchIsTransactionPending = true;

    (matchers.matchIsTransactionPending as Mock).mockImplementation(() => {
      return mockedMatchIsTransactionPending;
    });

    const { result } = renderHook(() => {
      return useTransactionsMatchers({
        state,
        chainId,
      });
    });

    expect(matchers.matchIsTransactionPending).toHaveBeenCalledTimes(0);

    const isTransactionPending =
      result.current.matchIsTransactionPending(transactionHash);

    expect(matchers.matchIsTransactionPending).toHaveBeenCalledTimes(1);
    expect(matchers.matchIsTransactionPending).toHaveBeenCalledWith(
      state,
      chainId,
      transactionHash
    );

    expect(isTransactionPending).toEqual(mockedMatchIsTransactionPending);
  });
  it("should curry the matchIsTransactionConfirmed matcher", () => {
    const state: TransactionsState = {};
    const chainId = MOCK_CHAIN_ID_1;
    const transactionHash = MOCK_TRANSACTION_HASH_1;

    const mockedMatchIsTransactionConfirmed = true;

    (matchers.matchIsTransactionConfirmed as Mock).mockImplementation(() => {
      return mockedMatchIsTransactionConfirmed;
    });

    const { result } = renderHook(() => {
      return useTransactionsMatchers({
        state,
        chainId,
      });
    });

    expect(matchers.matchIsTransactionConfirmed).toHaveBeenCalledTimes(0);

    const isTransactionConfirmed =
      result.current.matchIsTransactionConfirmed(transactionHash);

    expect(matchers.matchIsTransactionConfirmed).toHaveBeenCalledTimes(1);
    expect(matchers.matchIsTransactionConfirmed).toHaveBeenCalledWith(
      state,
      chainId,
      transactionHash
    );

    expect(isTransactionConfirmed).toEqual(mockedMatchIsTransactionConfirmed);
  });
  it("should curry the matchIsOracleTransactionPending matcher", () => {
    const state: TransactionsState = {};
    const chainId = MOCK_CHAIN_ID_1;
    const transactionHash = MOCK_TRANSACTION_HASH_1;

    const mockedMatchIsOracleTransactionPending = true;

    (matchers.matchIsOracleTransactionPending as Mock).mockImplementation(
      () => {
        return mockedMatchIsOracleTransactionPending;
      }
    );

    const { result } = renderHook(() => {
      return useTransactionsMatchers({
        state,
        chainId,
      });
    });

    expect(matchers.matchIsOracleTransactionPending).toHaveBeenCalledTimes(0);

    const isOracleTransactionPending =
      result.current.matchIsOracleTransactionPending(transactionHash);

    expect(matchers.matchIsOracleTransactionPending).toHaveBeenCalledTimes(1);
    expect(matchers.matchIsOracleTransactionPending).toHaveBeenCalledWith(
      state,
      chainId,
      transactionHash
    );

    expect(isOracleTransactionPending).toEqual(
      mockedMatchIsOracleTransactionPending
    );
  });
  it("should curry the matchIsOracleTransactionConfirmed matcher", () => {
    const state: TransactionsState = {};
    const chainId = MOCK_CHAIN_ID_1;
    const transactionHash = MOCK_TRANSACTION_HASH_1;

    const mockedMatchIsOracleTransactionConfirmed = true;

    (matchers.matchIsOracleTransactionConfirmed as Mock).mockImplementation(
      () => {
        return mockedMatchIsOracleTransactionConfirmed;
      }
    );

    const { result } = renderHook(() => {
      return useTransactionsMatchers({
        state,
        chainId,
      });
    });

    expect(matchers.matchIsOracleTransactionConfirmed).toHaveBeenCalledTimes(0);

    const isOracleTransactionConfirmed =
      result.current.matchIsOracleTransactionConfirmed(transactionHash);

    expect(matchers.matchIsOracleTransactionConfirmed).toHaveBeenCalledTimes(1);
    expect(matchers.matchIsOracleTransactionConfirmed).toHaveBeenCalledWith(
      state,
      chainId,
      transactionHash
    );

    expect(isOracleTransactionConfirmed).toEqual(
      mockedMatchIsOracleTransactionConfirmed
    );
  });
});
