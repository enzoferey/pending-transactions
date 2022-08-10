/**
 * @vitest-environment jsdom
 */

import { describe, it, vi, Mock, expect } from "vitest";

import { act, renderHook } from "@testing-library/react";

import type { providers } from "ethers";

import { useIsWindowActive } from "../../hooks/useIsWindowActive";
import { useIsOnline } from "../../hooks/useIsOnline";

import { useLastBlockNumber } from "../useLastBlockNumber";

vi.mock("../../hooks/useIsWindowActive");
vi.mock("../../hooks/useIsOnline");

describe("useLastBlockNumber", () => {
  it("should return the last block number reported by the passed provider", () => {
    (useIsWindowActive as Mock).mockImplementationOnce(() => {
      return true;
    });
    (useIsOnline as Mock).mockImplementationOnce(() => {
      return true;
    });

    const subscriptions: Array<(lastBlockNumber: number) => void> = [];

    const provider = {
      on: vi.fn().mockImplementation((_, subscription) => {
        subscriptions.push(subscription);
      }),
      off: vi.fn(),
    } as unknown as providers.Provider;

    const { result } = renderHook(() => {
      return useLastBlockNumber(provider);
    });

    expect(result.current).toBe(0);

    expect(provider.on).toHaveBeenCalledTimes(1);
    expect(provider.on).toHaveBeenCalledWith("block", expect.any(Function));

    act(() => {
      subscriptions.forEach((subscription) => {
        subscription(1);
      });
    });

    expect(result.current).toBe(1);
  });
  it("should pause when the window is not visible", () => {
    (useIsWindowActive as Mock).mockImplementationOnce(() => {
      return false;
    });
    (useIsOnline as Mock).mockImplementationOnce(() => {
      return true;
    });

    const provider = {
      on: vi.fn(),
      off: vi.fn(),
    } as unknown as providers.Provider;

    const { result, rerender } = renderHook(() => {
      return useLastBlockNumber(provider);
    });

    expect(result.current).toBe(0);

    expect(provider.on).toHaveBeenCalledTimes(0);

    (useIsWindowActive as Mock).mockImplementationOnce(() => {
      return true;
    });

    rerender();

    expect(provider.on).toHaveBeenCalledTimes(1);
    expect(provider.on).toHaveBeenCalledWith("block", expect.any(Function));
  });
  it("should pause when the network status is offline", () => {
    (useIsWindowActive as Mock).mockImplementationOnce(() => {
      return true;
    });
    (useIsOnline as Mock).mockImplementationOnce(() => {
      return false;
    });

    const provider = {
      on: vi.fn(),
      off: vi.fn(),
    } as unknown as providers.Provider;

    const { result, rerender } = renderHook(() => {
      return useLastBlockNumber(provider);
    });

    expect(result.current).toBe(0);

    expect(provider.on).toHaveBeenCalledTimes(0);

    (useIsOnline as Mock).mockImplementationOnce(() => {
      return true;
    });

    rerender();

    expect(provider.on).toHaveBeenCalledTimes(1);
    expect(provider.on).toHaveBeenCalledWith("block", expect.any(Function));
  });
  it("should unsubscribe from the provider when unmounted", () => {
    (useIsWindowActive as Mock).mockImplementationOnce(() => {
      return true;
    });
    (useIsOnline as Mock).mockImplementationOnce(() => {
      return true;
    });

    const provider = {
      on: vi.fn(),
      off: vi.fn(),
    } as unknown as providers.Provider;

    const { unmount } = renderHook(() => {
      return useLastBlockNumber(provider);
    });

    expect(provider.off).toHaveBeenCalledTimes(0);

    unmount();

    expect(provider.off).toHaveBeenCalledTimes(1);
    expect(provider.off).toHaveBeenCalledWith("block", expect.any(Function));
  });
});
