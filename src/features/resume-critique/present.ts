import type { Critique, Improvement, ScoreMetric, SuggestionGroup } from "../../types/resume";
import type { ResumeCritiqueResult, ResumeDocSection } from "./types";

/** Maps a 0–100 score to a familiar letter grade, for display next to the number. */
export function scoreToGrade(score: number): string {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 60) return "D";
  return "F";
}

const SECTION_ICONS: Record<string, string> = {
  contact: "contact_page",
  summary: "short_text",
  experience: "work",
  education: "school",
  skills: "psychology",
};

function iconForSection(section: ResumeDocSection): string {
  return SECTION_ICONS[section.key] ?? "auto_fix_high";
}

/** One `ScoreMetric` per critique section — genuinely isomorphic (title/score/status map directly), no forced fit. */
export function toScoreMetrics(sections: ResumeDocSection[]): ScoreMetric[] {
  return sections.map((section) => ({
    label: section.title,
    value: Math.round(section.score * 10),
    tone: section.status === "pass" ? "good" : "warning",
  }));
}

export interface PresentedCritique {
  /** The single most impactful finding, for the large featured card. Null if the critique found nothing to flag. */
  featured: Critique | null;
  /** Every other finding, flattened for the improvement list. */
  improvements: Improvement[];
}

const SEVERITY_RANK: Record<ResumeDocSection["status"], number> = { fail: 0, warn: 1, pass: 2 };

/** Picks the single most severe finding to feature, and turns the rest into a flat improvement list. */
export function presentCritique(critique: ResumeCritiqueResult): PresentedCritique {
  const bySeverity = [...critique.sections].sort(
    (a, b) => SEVERITY_RANK[a.status] - SEVERITY_RANK[b.status],
  );
  const flatFindings = bySeverity.flatMap((section) =>
    section.findings.map((finding) => ({ section, finding })),
  );

  const [first, ...rest] = flatFindings;

  const featured: Critique | null = first
    ? {
        id: `${first.section.key}-featured`,
        title: first.finding.issue,
        impact: first.section.status === "fail" ? "High Impact" : "Suggested",
        description: `In your ${first.section.title} section:`,
        suggestion: first.finding.suggestion,
      }
    : null;

  const improvements: Improvement[] = rest.slice(0, 6).map(({ section, finding }, i) => ({
    id: `${section.key}-${i + 1}`,
    icon: iconForSection(section),
    title: finding.issue,
    description: finding.suggestion,
  }));

  return { featured, improvements };
}

/**
 * One `SuggestionGroup` per critique section with findings. Deliberately has
 * no `sectionId` — the Build page's outline describes document structure
 * (e.g. two separate "Experience: Google"/"Experience: Meta" entries) at a
 * finer grain than the critique's sections (one combined "experience"), so a
 * true id mapping doesn't exist. The existing outline<->panel sync already
 * no-ops gracefully when a group has no matching section id.
 */
export function toSuggestionGroups(critique: ResumeCritiqueResult): SuggestionGroup[] {
  return critique.sections
    .filter((section) => section.findings.length > 0)
    .map((section) => ({
      id: `group-${section.key}`,
      label: section.title,
      suggestions: section.findings.map((finding, i) => ({
        id: `${section.key}-suggestion-${i}`,
        icon: iconForSection(section),
        title: finding.issue,
        description: finding.suggestion,
      })),
    }));
}
