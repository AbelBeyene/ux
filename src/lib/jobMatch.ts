/**
 * Generic keyword-overlap scorer for ranking job listings against a resume's
 * own skill list. Deliberately takes `skills` as a parameter rather than a
 * hardcoded keyword list (a reference implementation of this hardcoded a
 * dozen software-engineering terms like "react"/"aws"/"sql" — useless for a
 * designer or PM resume). This makes it generic across any profession, and
 * pure/testable without touching the network.
 */
export interface JobMatchResult {
  /** 0–100 */
  score: number;
  /** Skills that appear in both the resume and the job's title/description. */
  matchedSkills: string[];
}

const BASE_SCORE = 60;
const POINTS_PER_MATCH = 8;
const MAX_SCORE = 98;

export function scoreJobMatch(jobText: string, skills: string[]): JobMatchResult {
  const haystack = jobText.toLowerCase();
  const matchedSkills = skills.filter((skill) => haystack.includes(skill.toLowerCase()));

  if (skills.length === 0 || matchedSkills.length === 0) {
    return { score: BASE_SCORE, matchedSkills: [] };
  }

  const score = Math.min(MAX_SCORE, BASE_SCORE + matchedSkills.length * POINTS_PER_MATCH);
  return { score, matchedSkills };
}
