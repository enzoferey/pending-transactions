/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from "vitest";

import { act, renderHook } from "@testing-library/react";

import {
  MOCK_CONFIRMED_TRANSACTION,
  MOCK_TRANSACTION,
} from "../../../test-utils";

import type { TransactionsState } from "../../../types";

import type { StorageService } from "../../types";

import { useTransactionsState } from "../useTransactionsState";

describe("useTransactionsState", () => {
  it("should set the initial state to an empty object", () => {
    const { result } = renderHook(() => {
      return useTransactionsState();
    });

    expect(result.current.state).toEqual({});
  });
  it("should get the initial state from the storage service if passed", () => {
    const storageState: TransactionsState = {
      1: {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      },
    };

    const storageKey = "test-key";
    const storageService = {
      getItem: () => {
        return JSON.stringify(storageState);
      },
    } as unknown as StorageService;

    const { result } = renderHook(() => {
      return useTransactionsState({
        storageKey,
        storageService,
      });
    });

    expect(result.current.state).toEqual(storageState);
  });
  it("should update the state if the storage service changes", () => {
    const storageState: TransactionsState = {
      1: {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      },
    };
    const updatedStorageState: TransactionsState = {
      2: {
        [MOCK_CONFIRMED_TRANSACTION.hash]: MOCK_CONFIRMED_TRANSACTION,
      },
    };

    const storageKey = "test-key";
    const updatedStorageKey = "updated-test-key";

    const storageService = {
      getItem: () => {
        return JSON.stringify(storageState);
      },
    } as unknown as StorageService;
    const updatedStorageService = {
      getItem: () => {
        return JSON.stringify(updatedStorageState);
      },
    } as unknown as StorageService;

    const { result, rerender } = renderHook(
      (props) => {
        return useTransactionsState({
          storageKey: props.storageKey,
          storageService: props.storageService,
        });
      },
      { initialProps: { storageKey, storageService } }
    );

    expect(result.current.state).toEqual(storageState);

    rerender({
      storageKey: updatedStorageKey,
      storageService: updatedStorageService,
    });

    expect(result.current.state).toEqual(updatedStorageState);
  });
  it("should return a function to set the state", () => {
    const { result } = renderHook(() => {
      return useTransactionsState();
    });

    const newState: TransactionsState = {
      1: {
        [MOCK_TRANSACTION.hash]: MOCK_TRANSACTION,
      },
    };

    act(() => {
      result.current.setState(newState);
    });

    expect(result.current.state).toEqual(newState);
  });
});
