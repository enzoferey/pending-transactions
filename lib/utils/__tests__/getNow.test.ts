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
    const date1 = new Date("1970-01-01T00:00:00.000Z");
    vi.setSystemTime(date1);

    const result1 = getNow();
    expect(result1).toBe(0);

    const date2 = new Date("2022-09-06T10:05:54.000Z");
    vi.setSystemTime(date2);

    const result2 = getNow();
    expect(result2).toBe(1662458754000);
  });
});
