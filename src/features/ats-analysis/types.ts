/**
 * Raw response contract for the ATS dashboard analysis endpoint.
 * Imported by both the client feature and the serverless function
 * (api/_lib/atsAnalysis.ts) so the shape has a single source of truth.
 */

export interface AtsKeyword {
  keyword: string;
  /** True when the resume contains the keyword; pairs with `strength`. */
  matched: boolean;
  /** Match strength 0–100, present when matched. */
  strength?: number;
  /** Short note for missing keywords, e.g. "Recommended". */
  note?: string;
}

export interface AtsFormattingCheck {
  id: string;
  status: "pass" | "warning";
  title: string;
  description: string;
}

export interface AtsRelevanceScore {
  label: string;
  /** 0–100 */
  value: number;
}

export interface AtsCareerStage {
  /** Eyebrow label, e.g. "Current State". */
  label: string;
  title: string;
  /** Extra line under the title, e.g. "+15% Salary Potential". */
  note?: string;
}

/**
 * One composite AI pass over the resume: gauge, keywords, formatting,
 * relevance, and career projection all come from the same reasoning so
 * the dashboard cards never contradict each other.
 *
 * UI-only concerns (RelevanceScore/CareerStage `tone`) are deliberately
 * absent — they are positional emphasis assigned in present.ts.
 */
export interface AtsAnalysisResult {
  /** 0–100 */
  readinessScore: number;
  /** e.g. "Excellent" | "Strong" | "Fair" | "Needs Work" */
  readinessRating: string;
  readinessCaption: string;
  /** Exactly 6 — the KeywordGrid renders a 2x3 grid. */
  keywords: AtsKeyword[];
  formattingChecks: AtsFormattingCheck[];
  /** Exactly 3, strongest first. */
  relevanceScores: AtsRelevanceScore[];
  careerHeadline: string;
  careerDescription: string;
  /** Exactly 3: current, target, long-term. */
  careerStages: AtsCareerStage[];
}
