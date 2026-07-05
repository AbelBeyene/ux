import { describe, expect, it } from "vitest";
import { scoreJobMatch } from "../jobMatch";

describe("scoreJobMatch", () => {
  it("returns the base score with no matched skills when there's no overlap", () => {
    const result = scoreJobMatch("Backend Engineer at Acme", ["Figma", "User Research"]);
    expect(result).toEqual({ score: 60, matchedSkills: [] });
  });

  it("returns the base score when the resume has no skills to compare", () => {
    expect(scoreJobMatch("Senior Product Designer", [])).toEqual({ score: 60, matchedSkills: [] });
  });

  it("is case-insensitive and lists which skills matched", () => {
    const result = scoreJobMatch("Senior PRODUCT DESIGNER — figma and prototyping required", [
      "Figma",
      "Prototyping",
      "SQL",
    ]);
    expect(result.matchedSkills).toEqual(["Figma", "Prototyping"]);
    expect(result.score).toBe(76);
  });

  it("caps the score instead of scaling unboundedly with many matches", () => {
    const skills = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const result = scoreJobMatch("a b c d e f g h", skills);
    expect(result.score).toBe(98);
  });
});
