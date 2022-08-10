/**
 * @vitest-environment jsdom
 */

import { describe, it, vi, Mock, expect } from "vitest";

import { renderHook } from "@testing-library/react";

import {
  MOCK_ADDRESS_1,
  MOCK_CHAIN_ID_1,
  MOCK_TRANSACTION,
  MOCK_TRANSACTION_HASH_1,
  MOCK_TRANSACTION_RECEIPT,
} from "../../../test-utils";

import type { TransactionsState } from "../../../types";

import type { StorageService } from "../../types";

import * as actions from "../../../state/actions";

import { useTransactionsActions } from "../useTransactionsActions";

vi.mock("../../../state/actions");

describe("useTransactionsActions", () => {
  it("should curry the addTransaction action and persist it into the local storage", () => {
    const storageKey = "test-key";
    const storageService = { setItem: vi.fn() } as unknown as StorageService;
    const chainId = MOCK_CHAIN_ID_1;

    const state: TransactionsState = {};

    const mockedUpdatedState: TransactionsState = {
      [chainId]: {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      },
    };

    (actions.addTransaction as Mock).mockImplementation(() => {
      return mockedUpdatedState;
    });

    const mockedSetState = vi.fn().mockImplementation((updaterCallback) => {
      const result = updaterCallback(state);
      expect(result).toEqual(mockedUpdatedState);
    });

    const { result } = renderHook(() => {
      return useTransactionsActions({
        storageKey,
        storageService,
        setState: mockedSetState,
      });
    });

    expect(actions.addTransaction).toHaveBeenCalledTimes(0);

    const payload: actions.AddTransactionPayload = {
      chainId,
      from: MOCK_ADDRESS_1,
      hash: MOCK_TRANSACTION_HASH_1,
      info: { type: "test-key" },
    };

    result.current.addTransaction(payload);

    expect(actions.addTransaction).toHaveBeenCalledTimes(1);
    expect(actions.addTransaction).toHaveBeenCalledWith(state, payload);

    expect(storageService.setItem).toHaveBeenCalledTimes(1);
    expect(storageService.setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(mockedUpdatedState)
    );
  });
  it("should curry the addOracleTransaction action and persist it into the local storage", () => {
    const storageKey = "test-key";
    const storageService = { setItem: vi.fn() } as unknown as StorageService;
    const chainId = MOCK_CHAIN_ID_1;

    const state: TransactionsState = {};

    const mockedUpdatedState: TransactionsState = {
      [chainId]: {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      },
    };

    (actions.addOracleTransaction as Mock).mockImplementation(() => {
      return mockedUpdatedState;
    });

    const mockedSetState = vi.fn().mockImplementation((updaterCallback) => {
      const result = updaterCallback(state);
      expect(result).toEqual(mockedUpdatedState);
    });

    const { result } = renderHook(() => {
      return useTransactionsActions({
        storageKey,
        storageService,
        setState: mockedSetState,
      });
    });

    expect(actions.addOracleTransaction).toHaveBeenCalledTimes(0);

    const payload: actions.AddTransactionPayload = {
      chainId,
      from: MOCK_ADDRESS_1,
      hash: MOCK_TRANSACTION_HASH_1,
      info: { type: "test-key" },
    };

    result.current.addOracleTransaction(payload);

    expect(actions.addOracleTransaction).toHaveBeenCalledTimes(1);
    expect(actions.addOracleTransaction).toHaveBeenCalledWith(state, payload);

    expect(storageService.setItem).toHaveBeenCalledTimes(1);
    expect(storageService.setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(mockedUpdatedState)
    );
  });
  it("should curry the updateTransactionLastChecked action and persist it into the local storage", () => {
    const storageKey = "test-key";
    const storageService = { setItem: vi.fn() } as unknown as StorageService;
    const chainId = MOCK_CHAIN_ID_1;

    const state: TransactionsState = {};

    const mockedUpdatedState: TransactionsState = {
      [chainId]: {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      },
    };

    (actions.updateTransactionLastChecked as Mock).mockImplementation(() => {
      return mockedUpdatedState;
    });

    const mockedSetState = vi.fn().mockImplementation((updaterCallback) => {
      const result = updaterCallback(state);
      expect(result).toEqual(mockedUpdatedState);
    });

    const { result } = renderHook(() => {
      return useTransactionsActions({
        storageKey,
        storageService,
        setState: mockedSetState,
      });
    });

    expect(actions.updateTransactionLastChecked).toHaveBeenCalledTimes(0);

    const payload: actions.UpdateTransactionLastCheckedPayload = {
      chainId,
      hash: MOCK_TRANSACTION_HASH_1,
      blockNumber: 0,
    };

    result.current.updateTransactionLastChecked(payload);

    expect(actions.updateTransactionLastChecked).toHaveBeenCalledTimes(1);
    expect(actions.updateTransactionLastChecked).toHaveBeenCalledWith(
      state,
      payload
    );

    expect(storageService.setItem).toHaveBeenCalledTimes(1);
    expect(storageService.setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(mockedUpdatedState)
    );
  });
  it("should curry the confirmTransaction action and persist it into the local storage", () => {
    const storageKey = "test-key";
    const storageService = { setItem: vi.fn() } as unknown as StorageService;
    const chainId = MOCK_CHAIN_ID_1;

    const state: TransactionsState = {};

    const mockedUpdatedState: TransactionsState = {
      [chainId]: {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      },
    };

    (actions.confirmTransaction as Mock).mockImplementation(() => {
      return mockedUpdatedState;
    });

    const mockedSetState = vi.fn().mockImplementation((updaterCallback) => {
      const result = updaterCallback(state);
      expect(result).toEqual(mockedUpdatedState);
    });

    const { result } = renderHook(() => {
      return useTransactionsActions({
        storageKey,
        storageService,
        setState: mockedSetState,
      });
    });

    expect(actions.confirmTransaction).toHaveBeenCalledTimes(0);

    const payload: actions.ConfirmTransactionPayload = {
      chainId,
      hash: MOCK_TRANSACTION_HASH_1,
      receipt: MOCK_TRANSACTION_RECEIPT,
    };

    result.current.confirmTransaction(payload);

    expect(actions.confirmTransaction).toHaveBeenCalledTimes(1);
    expect(actions.confirmTransaction).toHaveBeenCalledWith(state, payload);

    expect(storageService.setItem).toHaveBeenCalledTimes(1);
    expect(storageService.setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(mockedUpdatedState)
    );
  });
  it("should curry the confirmOracleTransaction action and persist it into the local storage", () => {
    const storageKey = "test-key";
    const storageService = { setItem: vi.fn() } as unknown as StorageService;
    const chainId = MOCK_CHAIN_ID_1;

    const state: TransactionsState = {};

    const mockedUpdatedState: TransactionsState = {
      [chainId]: {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      },
    };

    (actions.confirmOracleTransaction as Mock).mockImplementation(() => {
      return mockedUpdatedState;
    });

    const mockedSetState = vi.fn().mockImplementation((updaterCallback) => {
      const result = updaterCallback(state);
      expect(result).toEqual(mockedUpdatedState);
    });

    const { result } = renderHook(() => {
      return useTransactionsActions({
        storageKey,
        storageService,
        setState: mockedSetState,
      });
    });

    expect(actions.confirmOracleTransaction).toHaveBeenCalledTimes(0);

    const payload: actions.ConfirmOracleTransactionPayload = {
      chainId,
      hash: MOCK_TRANSACTION_HASH_1,
      oracleReceipt: MOCK_TRANSACTION_RECEIPT,
    };

    result.current.confirmOracleTransaction(payload);

    expect(actions.confirmOracleTransaction).toHaveBeenCalledTimes(1);
    expect(actions.confirmOracleTransaction).toHaveBeenCalledWith(
      state,
      payload
    );

    expect(storageService.setItem).toHaveBeenCalledTimes(1);
    expect(storageService.setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(mockedUpdatedState)
    );
  });
  it("should curry the clearAllChainTransactions action and persist it into the local storage", () => {
    const storageKey = "test-key";
    const storageService = { setItem: vi.fn() } as unknown as StorageService;
    const chainId = MOCK_CHAIN_ID_1;

    const state: TransactionsState = {};

    const mockedUpdatedState: TransactionsState = {
      [chainId]: {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      },
    };

    (actions.clearAllChainTransactions as Mock).mockImplementation(() => {
      return mockedUpdatedState;
    });

    const mockedSetState = vi.fn().mockImplementation((updaterCallback) => {
      const result = updaterCallback(state);
      expect(result).toEqual(mockedUpdatedState);
    });

    const { result } = renderHook(() => {
      return useTransactionsActions({
        storageKey,
        storageService,
        setState: mockedSetState,
      });
    });

    expect(actions.clearAllChainTransactions).toHaveBeenCalledTimes(0);

    const payload: actions.ClearAllChainTransactionsPayload = {
      chainId,
    };

    result.current.clearAllChainTransactions(payload);

    expect(actions.clearAllChainTransactions).toHaveBeenCalledTimes(1);
    expect(actions.clearAllChainTransactions).toHaveBeenCalledWith(
      state,
      payload
    );

    expect(storageService.setItem).toHaveBeenCalledTimes(1);
    expect(storageService.setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(mockedUpdatedState)
    );
  });
});
