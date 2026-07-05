import { AppShell, HeaderUtilities, Sidebar, TopBar } from "../components/layout";
import { Button, Fab, Icon, SearchInput } from "../components/ui";
import {
  CareerPathCard,
  ChecklistCard,
  GaugeCard,
  JobMatchPanel,
  KeywordGrid,
  RelevanceCard,
} from "../components/dashboard";
import { useJobMatches } from "../hooks/useJobMatches";
import { currentUser, navItems, notifications } from "../data/resume";
import {
  careerStages,
  formattingChecks,
  keywordMatches,
  relevanceScores,
} from "../data/dashboard";

export interface DashboardPageProps {
  onNavigate?: (pageId: string) => void;
}

/** ATS analytics dashboard: readiness gauge, keyword analysis, checks, career projection. */
export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { jobs, loading, refresh } = useJobMatches();

  return (
    <AppShell
      sidebar={
        <Sidebar
          brand="ResumeAI"
          brandSubtitle="Professional Plan"
          items={navItems}
          activeItemId="dashboard"
          user={currentUser}
          cta={{ label: "Upgrade Pro" }}
          onNavigate={(item) => onNavigate?.(item.id)}
        />
      }
      header={
        <TopBar
          title="Dashboard"
          status="Analyzed 2 hours ago"
          actions={<SearchInput placeholder="Search resumes..." />}
          utilities={
            <HeaderUtilities user={currentUser} notifications={notifications} onNavigate={onNavigate} />
          }
        />
      }
    >
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-background flex flex-col">
        <div className="max-w-container-max mx-auto p-stack-lg w-full flex-1">
          {/* Page header */}
          <div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-headline-lg text-primary mb-1">ATS Compatibility Dashboard</h2>
              <p className="text-text-muted text-body-md">
                Resume:{" "}
                <span className="font-bold text-primary">Senior_Product_Designer_2024.pdf</span> •
                Analyzed 2 hours ago
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2 rounded">
                <Icon name="upload_file" size={20} />
                Upload Resume
              </Button>
              <Button className="flex items-center gap-2 rounded">
                <Icon name="refresh" size={20} />
                Re-scan
              </Button>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-12 gap-gutter">
            <GaugeCard
              className="col-span-12 lg:col-span-4"
              title="ATS Readiness"
              score={84}
              rating="Excellent"
              caption="Your resume is in the top 15% of parsed documents for Product Design roles."
            />
            <KeywordGrid className="col-span-12 lg:col-span-8" keywords={keywordMatches} />
            <ChecklistCard
              className="col-span-12 lg:col-span-5"
              title="Formatting Integrity"
              checks={formattingChecks}
            />
            <RelevanceCard
              className="col-span-12 lg:col-span-7"
              title="Industry Relevance"
              scores={relevanceScores}
            />
          </div>
        </div>

        {/* Footer band: anchored to the bottom, full-bleed with container-aligned content */}
        <footer className="mt-auto">
          <CareerPathCard
            eyebrow="AI Career Projection"
            headline="Path to Design Director"
            description="Based on your current experience progression, you are 2.5 years away from Leadership roles."
            stages={careerStages}
          />
        </footer>
      </main>

      {/* Related jobs fetched from the job portal for this resume */}
      <JobMatchPanel
        jobs={jobs}
        loading={loading}
        sourceLabel="LinkedIn & Indeed"
        onRefresh={refresh}
        onApply={() => {}}
        onSave={() => {}}
        onViewAll={() => {}}
      />

      {/* Offset left of the jobs rail (w-80) so it doesn't cover its footer */}
      <Fab icon="rocket_launch" label="Optimize Now" className="right-[22rem]" />
    </AppShell>
  );
}
