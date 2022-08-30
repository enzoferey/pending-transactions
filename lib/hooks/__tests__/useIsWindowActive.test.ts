/**
 * @vitest-environment jsdom
 */

import { describe, expect, it, vi, Mock } from "vitest";

import { act, renderHook } from "@testing-library/react";

import { matchIsDocumentVisible } from "../../utils/matchIsDocumentVisible";

import { useIsWindowActive } from "../useIsWindowActive";

vi.mock("../../utils/matchIsDocumentVisible");

describe("useIsWindowActive", () => {
  it("should initially return true", () => {
    const { result } = renderHook(() => {
      return useIsWindowActive();
    });

    expect(result.current).toBe(true);
  });
  it("should subscribe to the window visibilitychange and focus event on mount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    expect(addEventListenerSpy).toHaveBeenCalledTimes(0);

    renderHook(() => {
      return useIsWindowActive();
    });

    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "focus",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
  });
  it("should set the value based on the visibility of the document when receiving an visibilitychange window event", () => {
    const visibilityChangeSubscriptions: Array<() => void> = [];

    const addEventListenerSpy = vi
      .spyOn(window, "addEventListener")
      .mockImplementation((eventName, subscription) => {
        if (eventName === "visibilitychange") {
          visibilityChangeSubscriptions.push(subscription as () => void);
        }
      });

    const { result } = renderHook(() => {
      return useIsWindowActive();
    });

    expect(result.current).toBe(true);

    (matchIsDocumentVisible as Mock).mockImplementation(() => {
      return false;
    });

    act(() => {
      visibilityChangeSubscriptions.forEach((subscription) => {
        subscription();
      });
    });

    expect(result.current).toBe(false);

    (matchIsDocumentVisible as Mock).mockImplementation(() => {
      return true;
    });

    act(() => {
      visibilityChangeSubscriptions.forEach((subscription) => {
        subscription();
      });
    });

    expect(result.current).toBe(true);

    addEventListenerSpy.mockRestore();
  });
  it("should set the value based on the visibility of the document when receiving an focus window event", () => {
    const focusSubscriptions: Array<() => void> = [];

    const addEventListenerSpy = vi
      .spyOn(window, "addEventListener")
      .mockImplementation((eventName, subscription) => {
        if (eventName === "focus") {
          focusSubscriptions.push(subscription as () => void);
        }
      });

    const { result } = renderHook(() => {
      return useIsWindowActive();
    });

    expect(result.current).toBe(true);

    (matchIsDocumentVisible as Mock).mockImplementation(() => {
      return false;
    });

    act(() => {
      focusSubscriptions.forEach((subscription) => {
        subscription();
      });
    });

    expect(result.current).toBe(false);

    (matchIsDocumentVisible as Mock).mockImplementation(() => {
      return true;
    });

    act(() => {
      focusSubscriptions.forEach((subscription) => {
        subscription();
      });
    });

    expect(result.current).toBe(true);

    addEventListenerSpy.mockRestore();
  });
  it("should unsubscribe to the window online and offline events on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => {
      return useIsWindowActive();
    });

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(0);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "focus",
      expect.any(Function)
    );
  });
});
