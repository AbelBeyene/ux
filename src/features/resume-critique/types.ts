export interface CritiqueFinding {
  /** Verbatim phrase from the resume; empty string if the section is missing entirely. */
  quote: string;
  issue: string;
  suggestion: string;
}

export type SectionStatus = "pass" | "warn" | "fail";

export interface ResumeDocSection {
  key: string;
  title: string;
  text: string;
  /** 0–10 */
  score: number;
  status: SectionStatus;
  findings: CritiqueFinding[];
}

export interface ResumeCritiqueResult {
  /** 0–100 */
  overallScore: number;
  /** Full resume rendered as Markdown, for display. */
  resumeMarkdown: string;
  sections: ResumeDocSection[];
  topRedFlags: string[];
  quickWins: string[];
}
