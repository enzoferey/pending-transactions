import { describe, expect, it } from "vitest";

import { getValueOrDefault } from "../getValueOrDefault";

describe("getValueOrDefault", () => {
  it("should return the value if the value not undefined", () => {
    const result = getValueOrDefault(1, 2);
    expect(result).toBe(1);
  });
  it("should return the default value if the value is undefined", () => {
    const result = getValueOrDefault(undefined, 2);
    expect(result).toBe(2);
  });
});
