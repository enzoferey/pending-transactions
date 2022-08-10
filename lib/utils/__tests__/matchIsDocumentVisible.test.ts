import { describe, expect, it } from "vitest";

import { matchIsDocumentVisible } from "../matchIsDocumentVisible";

describe("matchIsDocumentVisible", () => {
  it("should return true if the document is undefined", () => {
    const result = matchIsDocumentVisible(undefined);
    expect(result).toBe(true);
  });
  it("should return true if the document does not support visibilityState", () => {
    const result = matchIsDocumentVisible({} as Document);
    expect(result).toBe(true);
  });
  it("should return true if the document is visible", () => {
    const result = matchIsDocumentVisible({
      visibilityState: "visible",
    } as unknown as Document);
    expect(result).toBe(true);
  });
  it("should return false if the document is not visible", () => {
    const result = matchIsDocumentVisible({
      visibilityState: "hidden",
    } as unknown as Document);
    expect(result).toBe(false);
  });
});
