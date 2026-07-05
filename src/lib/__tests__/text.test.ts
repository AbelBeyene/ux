import { describe, expect, it } from "vitest";
import { truncateText } from "../text";

describe("truncateText", () => {
  it("returns the text unchanged when within budget", () => {
    expect(truncateText("hello", 10)).toBe("hello");
  });

  it("returns the text unchanged when exactly at budget", () => {
    expect(truncateText("hello", 5)).toBe("hello");
  });

  it("cuts to the budget and marks that it was truncated", () => {
    expect(truncateText("hello world", 5)).toBe("hello\n[...truncated]");
  });
});
