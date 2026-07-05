/** Domain model shared by the resume viewer and the insights panel. */

export interface ResumeProfile {
  name: string;
  title: string;
  location: string;
  email: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  /** Bullet points; ReactNode so entries can embed <Highlight> spans. */
  bullets: React.ReactNode[];
}

export interface ScoreMetric {
  label: string;
  /** 0–100 */
  value: number;
  /** Visual treatment: `good` renders in primary, `warning` in accent. */
  tone: "good" | "warning";
}

export interface Critique {
  id: string;
  title: string;
  impact: string;
  description: string;
  suggestion?: string;
}

export interface Suggestion {
  id: string;
  icon: string;
  title: string;
  description: string;
  /** Label for the primary action; defaults to "Accept". */
  acceptLabel?: string;
  /** Whether the card offers a decline action. */
  declinable?: boolean;
  /** Whether the card offers a "Preview change" toggle. */
  previewable?: boolean;
}

export interface SuggestionGroup {
  id: string;
  /** Category label, e.g. "Professional Summary". */
  label: string;
  /** Outline/document section this group refines; used to auto-expand it. */
  sectionId?: string;
  suggestions: Suggestion[];
}

export interface Improvement {
  id: string;
  icon: string;
  title: string;
  description: string;
}
