import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";

import { getNow } from "../getNow";

describe("getNow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the UNIX timestamp of the current time", () => {
    const date1 = new Date(1970, 0, 1, 1, 0, 0, 0);
    vi.setSystemTime(date1);

    const result1 = getNow();
    expect(result1).toBe(0);

    const date2 = new Date(2022, 8, 6, 12, 5, 54, 0);
    vi.setSystemTime(date2);

    const result2 = getNow();
    expect(result2).toBe(1662458754000);
  });
});
