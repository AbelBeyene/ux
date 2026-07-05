import { callOpenRouter, extractJsonCandidate, truncateResumeText } from "./openrouter";
import { HttpError } from "./http";
import type { ResumeCritiqueResult } from "../../src/features/resume-critique/types";

const SCHEMA_HINT = `{
  "overallScore": 0,
  "resumeMarkdown": "# Name\\n## Section\\ncontent",
  "sections": [{"key":"contact","title":"","text":"","score":0,"status":"pass","findings":[{"quote":"","issue":"","suggestion":""}]}],
  "topRedFlags": [],
  "quickWins": []
}`;

function buildPrompt(resumeText: string): string {
  return `You are a senior recruiter performing a rigorous resume critique. Be direct and quote actual text.

RESUME:
${resumeText}

Return ONLY valid JSON with two things: (1) a Markdown rendering of the resume for display, and (2) a section-by-section critique with verbatim quotes.

${SCHEMA_HINT}

Rules:
- resumeMarkdown must use ## headings whose text matches the section "title" fields exactly
- Cover: contact, summary (or flag missing), work experience, education, skills. Add others if present.
- Missing sections: status="fail", score=0, text="", findings=[{quote:"",issue:"Section is missing",suggestion:"..."}]
- "quote" must be verbatim from the resume — never paraphrase
- Max 3 findings per section
- Scoring: 7-10=pass, 4-6=warn, 0-3=fail`;
}

function isValidCritique(value: unknown): value is ResumeCritiqueResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.overallScore === "number" &&
    typeof v.resumeMarkdown === "string" &&
    Array.isArray(v.sections) &&
    Array.isArray(v.topRedFlags) &&
    Array.isArray(v.quickWins)
  );
}

/** Runs the AI resume critique and returns a validated, clamped result. */
export async function analyzeResumeCritique(resumeText: string): Promise<ResumeCritiqueResult> {
  const resume = truncateResumeText(resumeText);
  const response = await callOpenRouter([{ role: "user", content: buildPrompt(resume) }], true);

  const candidate = extractJsonCandidate(response);
  const parsed = candidate ? safeJsonParse(candidate) : null;

  if (!isValidCritique(parsed)) {
    throw new HttpError(502, "The AI returned an unexpected response format. Please try again.", "invalid_ai_response");
  }

  return {
    ...parsed,
    overallScore: Math.min(100, Math.max(0, Math.round(parsed.overallScore))),
  };
}

function safeJsonParse(candidate: string): unknown {
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}
