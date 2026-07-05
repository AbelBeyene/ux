import { truncateText } from "../../src/lib/text";
import { callOpenRouter } from "./openrouter";
import { parseAiJson } from "./parseAiJson";
import { HttpError } from "./http";
import type {
  AtsAnalysisResult,
  AtsCareerStage,
  AtsFormattingCheck,
  AtsKeyword,
  AtsRelevanceScore,
} from "../../src/features/ats-analysis/types";

// Keeps a single request comfortably within typical AI-provider TPM limits.
const MAX_RESUME_PROMPT_CHARS = 6000;

const KEYWORD_COUNT = 6;
const RELEVANCE_COUNT = 3;
const STAGE_COUNT = 3;
const MAX_FORMATTING_CHECKS = 4;

const SCHEMA_HINT = `{
  "readinessScore": 0,
  "readinessRating": "Excellent",
  "readinessCaption": "",
  "keywords": [{"keyword":"","matched":true,"strength":0,"note":""}],
  "formattingChecks": [{"id":"kebab-case-id","status":"pass","title":"","description":""}],
  "relevanceScores": [{"label":"","value":0}],
  "careerHeadline": "Path to ...",
  "careerDescription": "",
  "careerStages": [{"label":"Current State","title":"","note":""}]
}`;

function buildPrompt(resumeText: string, targetRole: string): string {
  return `You are an ATS (applicant tracking system) analyst evaluating how well a resume will parse and rank for a target role. Base every judgment on the actual resume text.

TARGET ROLE: ${targetRole}

RESUME:
${resumeText}

Return ONLY valid JSON matching:

${SCHEMA_HINT}

Rules:
- keywords: exactly ${KEYWORD_COUNT} keywords ATS scanners expect for the target role. For each present in the resume set matched=true and strength 0-100; for each missing set matched=false and a short note like "Recommended" or "Required for Sr.". Include at least one missing keyword if any expected ones are absent.
- formattingChecks: 3-${MAX_FORMATTING_CHECKS} checks on structure inferable from plain text (section headings, contact info placement, bullet consistency, date formats). Use kebab-case ids and status "pass" or "warning".
- relevanceScores: exactly ${RELEVANCE_COUNT} industry/discipline domains with value 0-100, strongest first.
- careerStages: exactly ${STAGE_COUNT} with labels exactly "Current State", "Target Role", "Long-term"; titles inferred from the experience trajectory; optional note on the target stage (e.g. salary potential). careerHeadline like "Path to {next role}".
- readinessScore 0-100 must be consistent with the keyword and formatting results. readinessRating one of: Excellent, Strong, Fair, Needs Work. readinessCaption is one sentence of context for the score.`;
}

function isValidAtsAnalysis(value: unknown): value is AtsAnalysisResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.readinessScore === "number" &&
    typeof v.readinessRating === "string" &&
    typeof v.readinessCaption === "string" &&
    Array.isArray(v.keywords) &&
    Array.isArray(v.formattingChecks) &&
    Array.isArray(v.relevanceScores) &&
    typeof v.careerHeadline === "string" &&
    typeof v.careerDescription === "string" &&
    Array.isArray(v.careerStages)
  );
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeKeyword(keyword: AtsKeyword): AtsKeyword {
  return {
    keyword: keyword.keyword,
    matched: keyword.matched === true,
    strength: typeof keyword.strength === "number" ? clampScore(keyword.strength) : undefined,
    note: keyword.note || undefined,
  };
}

/** Runs the composite ATS dashboard analysis and returns a validated, clamped result. */
export async function analyzeAts(resumeText: string, targetRole: string): Promise<AtsAnalysisResult> {
  const resume = truncateText(resumeText, MAX_RESUME_PROMPT_CHARS);
  const response = await callOpenRouter([{ role: "user", content: buildPrompt(resume, targetRole) }], true);

  const parsed = await parseAiJson<unknown>(response, SCHEMA_HINT);

  if (!isValidAtsAnalysis(parsed)) {
    throw new HttpError(502, "The AI returned an unexpected response format. Please try again.", "invalid_ai_response");
  }

  return {
    readinessScore: clampScore(parsed.readinessScore),
    readinessRating: parsed.readinessRating,
    readinessCaption: parsed.readinessCaption,
    keywords: (parsed.keywords as AtsKeyword[]).slice(0, KEYWORD_COUNT).map(normalizeKeyword),
    formattingChecks: (parsed.formattingChecks as AtsFormattingCheck[]).slice(0, MAX_FORMATTING_CHECKS),
    relevanceScores: (parsed.relevanceScores as AtsRelevanceScore[])
      .slice(0, RELEVANCE_COUNT)
      .map((score) => ({ label: score.label, value: clampScore(score.value) })),
    careerHeadline: parsed.careerHeadline,
    careerDescription: parsed.careerDescription,
    careerStages: (parsed.careerStages as AtsCareerStage[]).slice(0, STAGE_COUNT),
  };
}
