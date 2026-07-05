import { describe, expect, it } from "vitest";
import { presentCritique, scoreToGrade, toScoreMetrics, toSuggestionGroups } from "../present";
import type { ResumeCritiqueResult } from "../types";

const sampleCritique: ResumeCritiqueResult = {
  overallScore: 78,
  resumeMarkdown: "# Alex Rivera",
  sections: [
    {
      key: "summary",
      title: "Professional Summary",
      text: "...",
      score: 5,
      status: "warn",
      findings: [{ quote: "hard-working", issue: "Generic buzzword", suggestion: "Use a specific achievement instead." }],
    },
    {
      key: "skills",
      title: "Skills",
      text: "",
      score: 0,
      status: "fail",
      findings: [{ quote: "", issue: "Section is missing", suggestion: "Add a skills section." }],
    },
    {
      key: "education",
      title: "Education",
      text: "BA Design",
      score: 9,
      status: "pass",
      findings: [],
    },
  ],
  topRedFlags: ["Missing skills section"],
  quickWins: ["Add a skills section"],
};

describe("scoreToGrade", () => {
  it.each([
    [98, "A+"],
    [90, "A-"],
    [87, "B+"],
    [78, "C+"],
    [65, "D"],
    [40, "F"],
  ])("maps %d to %s", (score, grade) => {
    expect(scoreToGrade(score)).toBe(grade);
  });
});

describe("toScoreMetrics", () => {
  it("maps each section 1:1, scaling score to 0-100 and status to a two-tone color", () => {
    expect(toScoreMetrics(sampleCritique.sections)).toEqual([
      { label: "Professional Summary", value: 50, tone: "warning" },
      { label: "Skills", value: 0, tone: "warning" },
      { label: "Education", value: 90, tone: "good" },
    ]);
  });
});

describe("presentCritique", () => {
  it("features the most severe finding first (fail before warn before pass)", () => {
    const { featured } = presentCritique(sampleCritique);
    expect(featured?.title).toBe("Section is missing");
    expect(featured?.impact).toBe("High Impact");
    expect(featured?.suggestion).toBe("Add a skills section.");
  });

  it("puts every remaining finding into the improvement list", () => {
    const { improvements } = presentCritique(sampleCritique);
    expect(improvements).toHaveLength(1);
    expect(improvements[0].title).toBe("Generic buzzword");
  });

  it("returns a null featured critique when there are no findings at all", () => {
    const clean: ResumeCritiqueResult = { ...sampleCritique, sections: [] };
    expect(presentCritique(clean).featured).toBeNull();
    expect(presentCritique(clean).improvements).toEqual([]);
  });
});

describe("toSuggestionGroups", () => {
  it("skips sections with no findings and groups the rest by section", () => {
    const groups = toSuggestionGroups(sampleCritique);
    expect(groups.map((g) => g.label)).toEqual(["Professional Summary", "Skills"]);
    expect(groups[0].suggestions).toEqual([
      { id: "summary-suggestion-0", icon: "short_text", title: "Generic buzzword", description: "Use a specific achievement instead." },
    ]);
  });
});
