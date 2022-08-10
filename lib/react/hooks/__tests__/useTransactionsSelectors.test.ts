/**
 * @vitest-environment jsdom
 */

import { describe, expect, it, Mock, vi } from "vitest";

import { renderHook } from "@testing-library/react";

import {
  MOCK_CHAIN_ID_1,
  MOCK_TRANSACTION,
  MOCK_TRANSACTION_HASH_1,
} from "../../../test-utils";

import type { ChainTransactionsState, TransactionsState } from "../../../types";

import * as selectors from "../../../state/selectors";

import { useTransactionsSelectors } from "../useTransactionsSelectors";

vi.mock("../../../state/selectors");

describe("useTransactionsSelectors", () => {
  it("should curry the getAllChainTransactions selector", () => {
    const state: TransactionsState = {};
    const chainId = MOCK_CHAIN_ID_1;

    const mockedAllChainTransactions: ChainTransactionsState = {
      [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
    };

    (selectors.getAllChainTransactions as Mock).mockImplementation(() => {
      return mockedAllChainTransactions;
    });

    const { result } = renderHook(() => {
      return useTransactionsSelectors({
        state,
        chainId,
      });
    });

    expect(selectors.getAllChainTransactions).toHaveBeenCalledTimes(0);

    const allChainTransactions = result.current.getAllChainTransactions();

    expect(selectors.getAllChainTransactions).toHaveBeenCalledTimes(1);
    expect(selectors.getAllChainTransactions).toHaveBeenCalledWith(
      state,
      chainId
    );

    expect(allChainTransactions).toEqual(mockedAllChainTransactions);
  });
  it("should curry the getChainTransaction selector", () => {
    const state: TransactionsState = {};
    const chainId = MOCK_CHAIN_ID_1;
    const transactionHash = MOCK_TRANSACTION_HASH_1;

    const mockedTransaction = MOCK_TRANSACTION;
    (selectors.getChainTransaction as Mock).mockImplementation(() => {
      return mockedTransaction;
    });

    const { result } = renderHook(() => {
      return useTransactionsSelectors({
        state,
        chainId,
      });
    });

    expect(selectors.getChainTransaction).toHaveBeenCalledTimes(0);

    const chainTransaction =
      result.current.getChainTransaction(transactionHash);

    expect(selectors.getChainTransaction).toHaveBeenCalledTimes(1);
    expect(selectors.getChainTransaction).toHaveBeenCalledWith(
      state,
      chainId,
      transactionHash
    );

    expect(chainTransaction).toEqual(mockedTransaction);
  });
});
