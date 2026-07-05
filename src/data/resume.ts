import type { Critique, Improvement, ResumeProfile, ScoreMetric } from "../types/resume";
import type { NotificationItem, SidebarNavItem, SidebarUser } from "../components/layout";

export const navItems: SidebarNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "resumes", label: "My Resumes", icon: "description" },
  { id: "build", label: "Build", icon: "edit_document" },
  { id: "history", label: "Analytics", icon: "monitoring" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export const currentUser: SidebarUser & { email: string } = {
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  role: "User profile",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDSjKAfM-whdMdrGUIbz9oKRn_dy0cHDNQUAwvOtLS_3O-ZOv9yphQ5p9mZnPtCHnWgKOqOmHcnghjH8e1neZ9QwHLqrhEQZI-IljLszyOBe59_4ndVXMPPBi3oZ8RlVYGaTos_gJCrOeeyuBhTijn36SQ7e1DCb9fQWC_FFlwuvA0kAXBIeSzp626seXubO_CqWe7c3RoMUGPuJGKMkKr5FtKVZo796Dx9S0uDkYYqNnlgGzUG95QxBoGeJ3Pg9psDW52QVeATbQ",
};

export const notifications: NotificationItem[] = [
  { id: "n1", icon: "insights", title: "Your ATS score improved to 84", time: "2h ago" },
  { id: "n2", icon: "work", title: "3 new jobs match your resume", time: "5h ago" },
  { id: "n3", icon: "auto_fix_high", title: "New AI suggestions are ready", time: "1d ago" },
];

export const profile: ResumeProfile = {
  name: "Alexander Rivera",
  title: "Senior Product Designer",
  location: "San Francisco, CA",
  email: "alex.rivera@example.com",
};

export const skills = [
  "Figma",
  "React",
  "Design Systems",
  "User Research",
  "Visual Design",
  "Prototyping",
];

/**
 * Plain-text rendering of the demo resume shown on the Critique and Build
 * pages — sent as-is to the AI critique backend. Kept as a separate export
 * (rather than extracted from the JSX) so the pretty on-page markup and the
 * text actually submitted to the model can't silently drift apart.
 */
export const resumePlainText = `${profile.name}
${profile.title} — ${profile.location} — ${profile.email}

PROFESSIONAL SUMMARY
Dedicated Product Designer with over 8 years of experience building human-centric digital experiences. I am skilled in Figma and UX research. I have helped companies grow their user base by implementing data-driven designs. Passionate about solving complex problems through elegant, scalable visual systems.

PROFESSIONAL EXPERIENCE
Lead UI/UX Designer — TechScale Solutions (2020 – Present)
- Directed a team of 5 designers to overhaul the core SaaS platform, resulting in a 32% increase in user retention over 12 months.
- Implemented a comprehensive design system that reduced front-end development time by 40%.
- Collaborated with cross-functional product teams to define roadmaps and user journeys.

Product Designer — Innovate Lab (2017 – 2020)
- Designed end-to-end mobile experiences for Series A fintech startups.
- Conducted 50+ user interviews to identify pain points in the onboarding flow.
- Produced high-fidelity prototypes and managed stakeholder presentations.

SKILLS
${skills.join(", ")}`;

export const metrics: ScoreMetric[] = [
  { label: "Clarity", value: 85, tone: "good" },
  { label: "Engagement", value: 62, tone: "warning" },
];

export const activeCritique: Critique = {
  id: "humanize-summary",
  title: "Humanize Your Summary",
  impact: "High Impact",
  description:
    "Your current summary feels a bit transactional. Let's make it reflect your mentorship style and product philosophy.",
  suggestion:
    "I bridge the gap between user empathy and business goals through high-fidelity craft. As a design lead, I'm committed to scaling teams and product ecosystems that don't just work, but delight.",
};

export const improvements: Improvement[] = [
  {
    id: "quantify-impact",
    icon: "equalizer",
    title: "Quantify Impact in Experience",
    description: "Add metrics to your Innovate Lab role.",
  },
  {
    id: "skill-keywords",
    icon: "psychology",
    title: "Refine Skill Keywords",
    description: "Update tools to reflect 2024 trends.",
  },
  {
    id: "action-verbs",
    icon: "history_edu",
    title: "Action Verbs Audit",
    description: 'Replace "Collaborated" with more active terms.',
  },
];
