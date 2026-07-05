import { describe, expect, it } from "vitest";
import {
  toCareerStages,
  toFormattingChecks,
  toKeywordMatches,
  toRelevanceScores,
} from "../present";

describe("toKeywordMatches", () => {
  it("keeps strength for matched keywords and note for missing ones", () => {
    expect(
      toKeywordMatches([
        { keyword: "User Research", matched: true, strength: 90 },
        { keyword: "Design Systems", matched: false, note: "Recommended" },
      ]),
    ).toEqual([
      { keyword: "User Research", strength: 90, note: undefined },
      { keyword: "Design Systems", strength: undefined, note: "Recommended" },
    ]);
  });

  it("drops a stray strength on missing keywords and a stray note on matched ones", () => {
    expect(
      toKeywordMatches([
        { keyword: "Figma", matched: true, strength: 80, note: "should vanish" },
        { keyword: "Agile", matched: false, strength: 50, note: "Recommended" },
      ]),
    ).toEqual([
      { keyword: "Figma", strength: 80, note: undefined },
      { keyword: "Agile", strength: undefined, note: "Recommended" },
    ]);
  });
});

describe("toFormattingChecks", () => {
  it("passes checks through unchanged", () => {
    const checks = [
      { id: "contact-info", status: "pass" as const, title: "Contact Info", description: "In the header." },
      { id: "tables", status: "warning" as const, title: "Tables", description: "May fail older ATS." },
    ];
    expect(toFormattingChecks(checks)).toEqual(checks);
  });
});

describe("toRelevanceScores", () => {
  it("sorts descending and assigns tones positionally", () => {
    expect(
      toRelevanceScores([
        { label: "Frontend Development", value: 45 },
        { label: "Product Design & UX", value: 92 },
        { label: "Visual Communication", value: 74 },
      ]),
    ).toEqual([
      { label: "Product Design & UX", value: 92, tone: "accent" },
      { label: "Visual Communication", value: 74, tone: "strong" },
      { label: "Frontend Development", value: 45, tone: "faint" },
    ]);
  });

  it("reuses the dimmest tone for any extra entries", () => {
    const scores = toRelevanceScores([
      { label: "A", value: 90 },
      { label: "B", value: 80 },
      { label: "C", value: 70 },
      { label: "D", value: 60 },
    ]);
    expect(scores.map((s) => s.tone)).toEqual(["accent", "strong", "faint", "faint"]);
  });
});

describe("toCareerStages", () => {
  it("assigns current/target/future tones in order", () => {
    expect(
      toCareerStages([
        { label: "Current State", title: "Senior Designer" },
        { label: "Target Role", title: "Principal Designer", note: "+15% Salary Potential" },
        { label: "Long-term", title: "VP of Design" },
      ]),
    ).toEqual([
      { label: "Current State", title: "Senior Designer", note: undefined, tone: "current" },
      { label: "Target Role", title: "Principal Designer", note: "+15% Salary Potential", tone: "target" },
      { label: "Long-term", title: "VP of Design", note: undefined, tone: "future" },
    ]);
  });
});
