import type { SuggestionGroup } from "../types/resume";
import type { OutlineItem } from "../components/editor";

export const outlineItems: OutlineItem[] = [
  { id: "header-information", label: "Header Information" },
  { id: "professional-summary", label: "Professional Summary" },
  { id: "core-competencies", label: "Core Competencies" },
  { id: "experience-google", label: "Experience: Google" },
  { id: "experience-meta", label: "Experience: Meta" },
  { id: "education", label: "Education" },
];

export const competencies = [
  "Agile Methodology",
  "Budget Management",
  "SaaS Delivery",
  "Risk Mitigation",
  "Team Leadership",
];

export const suggestionGroups: SuggestionGroup[] = [
  {
    id: "group-summary",
    label: "Professional Summary",
    sectionId: "professional-summary",
    suggestions: [
      {
        id: "tone-adjustment",
        icon: "auto_fix_high",
        title: "Tone Adjustment",
        description: 'Make summary more authoritative. Currently: "Passionate about..."',
        acceptLabel: "Accept All",
      },
    ],
  },
  {
    id: "group-competencies",
    label: "Core Competencies",
    sectionId: "core-competencies",
    suggestions: [
      {
        id: "keyword-stakeholder",
        icon: "key",
        title: "Add Keyword: Stakeholder Mgmt",
        description: "Found in 90% of Senior PM roles at top-tier tech companies.",
        declinable: true,
        previewable: true,
      },
    ],
  },
  {
    id: "group-google",
    label: "Experience: Google",
    sectionId: "experience-google",
    suggestions: [
      {
        id: "impact-verbs",
        icon: "bolt",
        title: "Refine Impact Verbs",
        description: 'Change "Managed" to "Spearheaded" for a stronger leadership tone.',
        declinable: true,
        previewable: true,
      },
    ],
  },
  {
    id: "group-meta",
    label: "Experience: Meta",
    sectionId: "experience-meta",
    suggestions: [
      {
        id: "quantify-impact",
        icon: "trending_up",
        title: "Quantify Impact",
        description: "Add specific ROI or user growth numbers to your Meta tenure.",
        acceptLabel: "Improve Now",
      },
      {
        id: "scope-detail",
        icon: "zoom_in",
        title: "Clarify Project Scope",
        description: '"Worked with stakeholders" is vague — name the teams and outcomes.',
        declinable: true,
        previewable: true,
      },
    ],
  },
];
