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

/**
 * Plain-text rendering of the Build page's own demo resume (a different
 * persona from the Critique page's) — sent to the AI critique backend as-is.
 */
export const buildResumePlainText = `Alexander Rivera
New York, NY — arivera.pro@email.com — 555-0123 — linkedin.com/in/arivera

PROFESSIONAL SUMMARY
Visionary Senior Project Manager with 10+ years of experience leading cross-functional teams in high-growth tech environments. Proven track record of delivering complex software products under budget. Passionate about optimizing workflows and driving operational excellence through data-driven strategies.

CORE COMPETENCIES
${competencies.join(", ")}

PROFESSIONAL EXPERIENCE
Senior Project Manager — Google, Mountain View, CA (2019 – Present)
- Managed a $15M product portfolio focusing on cloud infrastructure scaling.
- Led a global team of 45 engineers to reduce latency by 24% across core services.
- Implemented new SCRUM frameworks that increased velocity by 30% within 6 months.

Technical Project Manager — Meta, Menlo Park, CA (2015 – 2019)
- Orchestrated the launch of 3 major feature updates for the Instagram ads platform.
- Worked with stakeholders to define requirements and project scope.
- Reduced operational overhead by 12% through automation of reporting tools.

EDUCATION
M.S. in Management Science, Stanford University, 2015`;

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
