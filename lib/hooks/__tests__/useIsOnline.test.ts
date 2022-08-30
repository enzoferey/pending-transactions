/**
 * @vitest-environment jsdom
 */

import { describe, expect, it, vi } from "vitest";

import { act, renderHook } from "@testing-library/react";

import { useIsOnline } from "../useIsOnline";

describe("useIsOnline", () => {
  it("should initially return true", () => {
    const { result } = renderHook(() => {
      return useIsOnline();
    });

    expect(result.current).toBe(true);
  });
  it("should subscribe to the window online and offline event on mount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    expect(addEventListenerSpy).toHaveBeenCalledTimes(0);

    renderHook(() => {
      return useIsOnline();
    });

    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "online",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "offline",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
  });
  it("should toggle the value on when receiving an online window event and toggle the value off when receiving an offline window event", () => {
    const onlineSubscriptions: Array<() => void> = [];
    const offlineSubscriptions: Array<() => void> = [];

    const addEventListenerSpy = vi
      .spyOn(window, "addEventListener")
      .mockImplementation((eventName, subscription) => {
        if (eventName === "online") {
          onlineSubscriptions.push(subscription as () => void);
        }
        if (eventName === "offline") {
          offlineSubscriptions.push(subscription as () => void);
        }
      });

    const { result } = renderHook(() => {
      return useIsOnline();
    });

    expect(result.current).toBe(true);

    act(() => {
      offlineSubscriptions.forEach((subscription) => {
        subscription();
      });
    });

    expect(result.current).toBe(false);

    act(() => {
      onlineSubscriptions.forEach((subscription) => {
        subscription();
      });
    });

    expect(result.current).toBe(true);

    addEventListenerSpy.mockRestore();
  });
  it("should unsubscribe to the window online and offline events on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => {
      return useIsOnline();
    });

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(0);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "online",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "offline",
      expect.any(Function)
    );
  });
});
