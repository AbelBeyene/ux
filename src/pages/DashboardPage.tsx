import { useMemo, useRef, useState } from "react";
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
import { useJobMatches } from "../features/job-matching";
import {
  toCareerStages,
  toFormattingChecks,
  toKeywordMatches,
  toRelevanceScores,
  useAtsAnalysis,
} from "../features/ats-analysis";
import { extractTextFromFile } from "../features/resume-upload/extractText";
import { usePersistentState } from "../lib/usePersistentState";
import {
  currentUser,
  navItems,
  notifications,
  profile,
  resumePlainText,
  skills,
} from "../data/resume";
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
  const [resumeText, setResumeText] = useState(resumePlainText);
  const [fileName, setFileName] = useState("Senior_Product_Designer_2024.pdf");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      setFileName(file.name);
      setUploadError(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Couldn't read that file.");
    }
  };

  // Runs the real AI analysis against the current resume text on load, and
  // again automatically whenever a new file is uploaded (it's part of the
  // query key below). Falls back to the static demo data while loading or
  // on error — the page never looks broken either way.
  const analysis = useAtsAnalysis({ resumeText, targetRole: profile.title });
  const live = analysis.data;

  const displayScore = live ? live.readinessScore : 84;
  const displayRating = live ? live.readinessRating : "Excellent";
  const displayCaption = live
    ? live.readinessCaption
    : "Your resume is in the top 15% of parsed documents for Product Design roles.";
  const displayKeywords = live ? toKeywordMatches(live.keywords) : keywordMatches;
  const displayChecks = live ? toFormattingChecks(live.formattingChecks) : formattingChecks;
  const displayRelevance = live ? toRelevanceScores(live.relevanceScores) : relevanceScores;
  const displayStages = live ? toCareerStages(live.careerStages) : careerStages;
  const displayCareerHeadline = live ? live.careerHeadline : "Path to Design Director";
  const displayCareerDescription = live
    ? live.careerDescription
    : "Based on your current experience progression, you are 2.5 years away from Leadership roles.";

  const [savedJobIdList, setSavedJobIdList] = usePersistentState<string[]>("resumeai:savedJobIds", []);
  const savedJobIds = useMemo(() => new Set(savedJobIdList), [savedJobIdList]);

  const { jobs, loading, error, refresh } = useJobMatches({
    query: {
      role: profile.title,
      location: profile.location,
      country: "us",
      datePosted: "week",
      employmentType: "all",
      remoteOnly: false,
    },
    skills,
  });

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
                Resume: <span className="font-bold text-primary">{fileName}</span> • Analyzed 2
                hours ago
              </p>
              {analysis.loading && (
                <p className="mt-1 flex items-center gap-2 text-label-sm text-text-muted">
                  <Icon name="autorenew" size={16} className="animate-spin" />
                  Analyzing with AI…
                </p>
              )}
              {analysis.error && (
                <p className="mt-1 text-label-sm text-text-muted">
                  Live AI analysis unavailable ({analysis.error}) — showing example data.
                </p>
              )}
              {uploadError && (
                <p className="mt-1 text-label-sm text-error">{uploadError}</p>
              )}
            </div>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="upload_file" size={20} />
                Upload Resume
              </Button>
              <Button
                className="flex items-center gap-2 rounded"
                disabled={analysis.loading}
                onClick={() => {
                  analysis.refresh();
                  refresh();
                }}
              >
                <Icon name="refresh" size={20} className={analysis.loading ? "animate-spin" : undefined} />
                Re-scan
              </Button>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-12 gap-gutter">
            <GaugeCard
              className="col-span-12 lg:col-span-4"
              title="ATS Readiness"
              score={displayScore}
              rating={displayRating}
              caption={displayCaption}
            />
            <KeywordGrid className="col-span-12 lg:col-span-8" keywords={displayKeywords} />
            <ChecklistCard
              className="col-span-12 lg:col-span-5"
              title="Formatting Integrity"
              checks={displayChecks}
            />
            <RelevanceCard
              className="col-span-12 lg:col-span-7"
              title="Industry Relevance"
              scores={displayRelevance}
            />
          </div>
        </div>

        {/* Footer band: anchored to the bottom, full-bleed with container-aligned content */}
        <footer className="mt-auto">
          <CareerPathCard
            eyebrow="AI Career Projection"
            headline={displayCareerHeadline}
            description={displayCareerDescription}
            stages={displayStages}
          />
        </footer>
      </main>

      {/* Related jobs fetched live from the job portal, scored against this resume's skills */}
      <JobMatchPanel
        jobs={jobs}
        loading={loading}
        error={error}
        savedJobIds={savedJobIds}
        onRefresh={refresh}
        onApply={(job) => {
          if (job.applyLink) window.open(job.applyLink, "_blank", "noopener,noreferrer");
        }}
        onSave={(job) =>
          setSavedJobIdList((prev) =>
            prev.includes(job.id) ? prev.filter((id) => id !== job.id) : [...prev, job.id],
          )
        }
        onViewAll={() => onNavigate?.("history")}
      />

      {/* Offset left of the jobs rail (w-80) so it doesn't cover its footer */}
      <Fab
        icon="rocket_launch"
        label="Optimize Now"
        className="right-[22rem]"
        onClick={() => onNavigate?.("build")}
      />
    </AppShell>
  );
}
