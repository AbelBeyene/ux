import { useEffect, useRef, useState } from "react";
import {
  AppShell,
  HeaderUtilities,
  Sidebar,
  TopBar,
} from "../components/layout";
import { Button, Icon } from "../components/ui";
import {
  ExperienceItem,
  Highlight,
  ResumePaper,
  ResumeSection,
  SkillList,
} from "../components/resume";
import {
  CritiqueCard,
  ImprovementList,
  MentorQuote,
  MetricCard,
  ScoreCard,
} from "../components/insights";
import { presentCritique, scoreToGrade, toScoreMetrics, useResumeCritique } from "../features/resume-critique";
import {
  activeCritique,
  currentUser,
  improvements,
  metrics,
  navItems,
  notifications,
  profile,
  resumePlainText,
  skills,
} from "../data/resume";
import type { ExperienceEntry } from "../types/resume";

export interface ResumeCritiquePageProps {
  onNavigate?: (pageId: string) => void;
}

/** Resume Critique workspace: resume viewer on the left, AI insights on the right. */
export function ResumeCritiquePage({ onNavigate }: ResumeCritiquePageProps) {
  // Hovering an AI-suggested span in the resume highlights and scrolls to
  // the linked critique card in the insights pane.
  const [critiqueLinked, setCritiqueLinked] = useState(false);
  const critiqueRef = useRef<HTMLDivElement>(null);

  const revisionHoverProps = {
    onMouseEnter: () => {
      setCritiqueLinked(true);
      critiqueRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
    onMouseLeave: () => setCritiqueLinked(false),
  };

  const [strengthHovered, setStrengthHovered] = useState(false);

  // Runs the real AI critique against the demo resume on load. Falls back to
  // the static demo insights below if it's still loading, errors, or no
  // backend is configured — the page never looks broken either way.
  const critique = useResumeCritique();
  const { run: runCritique } = critique;
  useEffect(() => {
    runCritique(resumePlainText);
  }, [runCritique]);

  const live = critique.status === "success" && critique.data ? critique.data : null;
  const displayScore = live ? live.overallScore : 78;
  const displayGrade = live ? scoreToGrade(live.overallScore) : "B+";
  const displayMetrics = live ? toScoreMetrics(live.sections) : metrics;
  const { featured: displayFeatured, improvements: displayImprovements } = live
    ? presentCritique(live)
    : { featured: activeCritique, improvements };

  const experience: ExperienceEntry[] = [
    {
      role: "Lead UI/UX Designer",
      company: "TechScale Solutions",
      period: "2020 – Present",
      bullets: [
        <>
          Directed a team of 5 designers to overhaul the core SaaS platform,
          resulting in a{" "}
          <Highlight
            kind="strength"
            hint="Strong Impact Statement"
            active={strengthHovered}
            onMouseEnter={() => setStrengthHovered(true)}
            onMouseLeave={() => setStrengthHovered(false)}
          >
            32% increase in user retention
          </Highlight>{" "}
          over 12 months.
        </>,
        "Implemented a comprehensive design system that reduced front-end development time by 40%.",
        "Collaborated with cross-functional product teams to define roadmaps and user journeys.",
      ],
    },
    {
      role: "Product Designer",
      company: "Innovate Lab",
      period: "2017 – 2020",
      bullets: [
        "Designed end-to-end mobile experiences for Series A fintech startups.",
        <Highlight
          key="innovate-lab-bullet-2"
          kind="revision"
          hint="AI Suggestion: Quantify Achievement"
          active={critiqueLinked}
          {...revisionHoverProps}
        >
          Conducted 50+ user interviews to identify pain points in the
          onboarding flow.
        </Highlight>,
        "Produced high-fidelity prototypes and managed stakeholder presentations.",
      ],
    },
  ];

  return (
    <AppShell
      sidebar={
        <Sidebar
          brand="ResumeAI"
          brandSubtitle="Professional Plan"
          items={navItems}
          activeItemId="resumes"
          user={currentUser}
          cta={{ label: "Upgrade Pro" }}
          onNavigate={(item) => onNavigate?.(item.id)}
        />
      }
      header={
        <TopBar
          title="Resume Critique"
          status="Last saved: 2m ago"
          actions={
            <>
              <Button variant="text" size="sm">
                Share
              </Button>
              <Button
                size="md"
                className="flex items-center gap-2"
                onClick={() => onNavigate?.("build")}
              >
                Open in Builder
                <Icon name="arrow_forward" size={18} />
              </Button>
            </>
          }
          utilities={
            <HeaderUtilities
              user={currentUser}
              notifications={notifications}
              onNavigate={onNavigate}
            />
          }
        />
      }
    >
      {/* Left pane: resume viewer */}
      <section className="w-3/5 h-full min-h-0 overflow-y-auto custom-scrollbar p-stack-lg bg-surface-container-low flex justify-center scroll-smooth">
        <ResumePaper profile={profile} className="h-fit">
          <ResumeSection title="Professional Summary">
            <p className="text-body-md leading-relaxed">
              Dedicated Product Designer with over 8 years of experience
              building human-centric digital experiences.{" "}
              <Highlight
                kind="revision"
                hint="AI Suggestion: Humanize Your Summary"
                active={critiqueLinked}
                {...revisionHoverProps}
              >
                I am skilled in Figma and UX research. I have helped companies
                grow their user base by implementing data-driven designs.
              </Highlight>{" "}
              Passionate about solving complex problems through elegant,
              scalable visual systems.
            </p>
          </ResumeSection>

          <ResumeSection title="Professional Experience">
            {experience.map((entry, i) => (
              <ExperienceItem
                key={entry.company}
                entry={entry}
                className={i > 0 ? "pt-stack-md" : undefined}
              />
            ))}
          </ResumeSection>

          <ResumeSection title="Skills">
            <SkillList skills={skills} />
          </ResumeSection>
        </ResumePaper>
      </section>

      {/* Right pane: insights dashboard */}
      <section className="w-2/5 h-full min-h-0 overflow-y-auto custom-scrollbar p-stack-lg border-l border-outline-variant bg-surface-bright space-y-stack-md">
        {critique.status === "loading" && (
          <p className="flex items-center gap-2 text-label-sm text-text-muted animate-fade-rise">
            <Icon name="autorenew" size={16} className="animate-spin" />
            Reviewing your resume…
          </p>
        )}
        {critique.status === "error" && (
          <p className="text-label-sm text-text-muted animate-fade-rise">
            Live review unavailable ({critique.error}). Showing example insights.
          </p>
        )}

        <div className="animate-fade-rise">
          <ScoreCard label="Overall Resume Score" score={displayScore} grade={displayGrade} />
        </div>

        <div
          className="grid grid-cols-2 gap-stack-sm animate-fade-rise"
          style={{ animationDelay: "80ms" }}
        >
          {displayMetrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        {displayFeatured && (
          <div className="animate-fade-rise" style={{ animationDelay: "160ms" }}>
            <CritiqueCard
              ref={critiqueRef}
              critique={displayFeatured}
              highlighted={critiqueLinked}
              onDismiss={() => {}}
            />
          </div>
        )}

        <div className="animate-fade-rise" style={{ animationDelay: "240ms" }}>
          <ImprovementList title="Other Improvements" items={displayImprovements} />
        </div>

        <div className="animate-fade-rise" style={{ animationDelay: "320ms" }}>
          <MentorQuote
            quote="Your design system experience is a standout. Highlight it more prominently in the first 30 seconds of reading."
            author="AI Career Mentor"
          />
        </div>
      </section>
    </AppShell>
  );
}
