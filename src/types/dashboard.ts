/** Domain model for the ATS analytics dashboard. */

export interface KeywordMatch {
  keyword: string;
  /** Match strength 0–100 when present; omit for missing keywords. */
  strength?: number;
  /** Note shown on missing keywords, e.g. "Recommended". */
  note?: string;
}

export interface FormattingCheck {
  id: string;
  status: "pass" | "warning";
  title: string;
  description: string;
}

export interface RelevanceScore {
  label: string;
  /** 0–100 */
  value: number;
  /** Visual emphasis: `accent` for the top match, dimmer tones below. */
  tone: "accent" | "strong" | "faint";
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  /** Work arrangement shown next to the location. */
  workMode?: "Remote" | "Hybrid" | "On-site";
  salary?: string;
  /** Resume-to-job match, 0–100. */
  matchScore: number;
  /** Skills from the resume that this listing also asks for. */
  matchedSkills: string[];
  postedAgo: string;
  /** Job portal the listing was fetched from, e.g. "LinkedIn". */
  source: string;
  /** URL to the actual posting, when known — powers the Apply button. */
  applyLink?: string;
}

export interface CareerStage {
  /** Eyebrow label, e.g. "Current State". */
  label: string;
  title: string;
  /** Visual emphasis within the path. */
  tone: "current" | "target" | "future";
  /** Extra line under the title, e.g. "+15% Salary Potential". */
  note?: string;
}
