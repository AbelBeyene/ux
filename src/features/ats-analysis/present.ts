import type {
  CareerStage,
  FormattingCheck,
  KeywordMatch,
  RelevanceScore,
} from "../../types/dashboard";
import type {
  AtsCareerStage,
  AtsFormattingCheck,
  AtsKeyword,
  AtsRelevanceScore,
} from "./types";

/** Matched keywords keep their strength; missing ones keep only the note. */
export function toKeywordMatches(keywords: AtsKeyword[]): KeywordMatch[] {
  return keywords.map((k) => ({
    keyword: k.keyword,
    strength: k.matched ? k.strength : undefined,
    note: k.matched ? undefined : k.note,
  }));
}

export function toFormattingChecks(checks: AtsFormattingCheck[]): FormattingCheck[] {
  return checks.map(({ id, status, title, description }) => ({ id, status, title, description }));
}

// Tones are positional emphasis, not AI output: strongest score gets the
// accent treatment, dimmer tones below.
const RELEVANCE_TONES: RelevanceScore["tone"][] = ["accent", "strong", "faint"];

export function toRelevanceScores(scores: AtsRelevanceScore[]): RelevanceScore[] {
  return [...scores]
    .sort((a, b) => b.value - a.value)
    .map((score, i) => ({
      label: score.label,
      value: score.value,
      tone: RELEVANCE_TONES[Math.min(i, RELEVANCE_TONES.length - 1)],
    }));
}

const STAGE_TONES: CareerStage["tone"][] = ["current", "target", "future"];

export function toCareerStages(stages: AtsCareerStage[]): CareerStage[] {
  return stages.map((stage, i) => ({
    label: stage.label,
    title: stage.title,
    note: stage.note,
    tone: STAGE_TONES[Math.min(i, STAGE_TONES.length - 1)],
  }));
}
