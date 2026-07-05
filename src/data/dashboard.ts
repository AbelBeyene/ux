import type {
  CareerStage,
  FormattingCheck,
  KeywordMatch,
  RelevanceScore,
} from "../types/dashboard";

export const keywordMatches: KeywordMatch[] = [
  { keyword: "User Research", strength: 100 },
  { keyword: "Figma/Prototyping", strength: 90 },
  { keyword: "Agile Methodology", strength: 75 },
  { keyword: "Design Systems", note: "Recommended" },
  { keyword: "Stakeholder Mgmt", note: "Required for Sr." },
  { keyword: "UI Interaction", strength: 40 },
];

export const formattingChecks: FormattingCheck[] = [
  {
    id: "font-parsing",
    status: "pass",
    title: "Standard Font Parsing",
    description: "Hanken Grotesk is 100% OCR compatible.",
  },
  {
    id: "contact-info",
    status: "pass",
    title: "Contact Info Location",
    description: "Header placement is optimized for Greenhouse/Workday.",
  },
  {
    id: "grid-table",
    status: "warning",
    title: "Complex Grid/Table Detected",
    description:
      "Skills section uses a 2-column layout which might fail in older ATS. Consider a comma-separated list.",
  },
];

export const relevanceScores: RelevanceScore[] = [
  { label: "Product Design & UX", value: 92, tone: "accent" },
  { label: "Visual Communication", value: 74, tone: "strong" },
  { label: "Frontend Development", value: 45, tone: "faint" },
];

export const careerStages: CareerStage[] = [
  { label: "Current State", title: "Senior Designer", tone: "current" },
  { label: "Target Role", title: "Principal Designer", tone: "target", note: "+15% Salary Potential" },
  { label: "Long-term", title: "VP of Design", tone: "future" },
];
