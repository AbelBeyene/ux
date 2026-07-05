import { describe, expect, it } from "vitest";
import { extractJsonCandidate, tryParseJson } from "../jsonExtract";

describe("extractJsonCandidate", () => {
  it("returns null for empty input", () => {
    expect(extractJsonCandidate("")).toBeNull();
    expect(extractJsonCandidate("   ")).toBeNull();
  });

  it("extracts JSON from a markdown code fence", () => {
    const raw = 'Here you go:\n```json\n{"a":1}\n```\nThanks';
    expect(extractJsonCandidate(raw)).toBe('{"a":1}');
  });

  it("extracts a JSON fence without the json language tag", () => {
    const raw = '```\n{"a":1}\n```';
    expect(extractJsonCandidate(raw)).toBe('{"a":1}');
  });

  it("extracts a bare object surrounded by prose", () => {
    const raw = 'Sure, here is the result: {"matchScore": 82} — hope that helps!';
    expect(extractJsonCandidate(raw)).toBe('{"matchScore": 82}');
  });

  it("extracts a bare array surrounded by prose", () => {
    const raw = 'Recommendations: ["Add metrics", "Use action verbs"] done.';
    expect(extractJsonCandidate(raw)).toBe('["Add metrics", "Use action verbs"]');
  });

  it("returns null when no JSON-like structure is present", () => {
    expect(extractJsonCandidate("just plain text, no braces here")).toBeNull();
  });
});

describe("tryParseJson", () => {
  it("parses valid JSON wrapped in prose", () => {
    const raw = 'Result: {"overallScore": 78, "tags": ["a", "b"]}';
    expect(tryParseJson<{ overallScore: number; tags: string[] }>(raw)).toEqual({
      overallScore: 78,
      tags: ["a", "b"],
    });
  });

  it("returns null for malformed JSON", () => {
    expect(tryParseJson("{overallScore: 78,}")).toBeNull();
  });

  it("returns null when there is nothing to parse", () => {
    expect(tryParseJson("no json here")).toBeNull();
  });
});
