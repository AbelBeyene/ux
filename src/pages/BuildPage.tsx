import { useEffect, useState } from "react";
import { AppShell, HeaderUtilities, Sidebar, TopBar } from "../components/layout";
import { Button, Icon, Tag } from "../components/ui";
import { cn } from "../lib/cn";
import {
  AiMarker,
  DocExperience,
  DocSection,
  EditorToolbar,
  ExportDialog,
  OutlinePanel,
  RefinementPanel,
  ResumeDocument,
  SuggestionCard,
  SuggestionGroupSection,
  type OutlineItem,
} from "../components/editor";
import { toSuggestionGroups, useResumeCritique } from "../features/resume-critique";
import { currentUser, navItems, notifications } from "../data/resume";
import { buildResumePlainText, competencies, outlineItems, suggestionGroups as demoSuggestionGroups } from "../data/build";
import { resumeMeta } from "../data/analytics";
import type { SuggestionGroup } from "../types/resume";

export interface BuildPageProps {
  onNavigate?: (pageId: string) => void;
}

/** Build workspace: outline, interactive resume preview, AI refinement panel. */
export function BuildPage({ onNavigate }: BuildPageProps) {
  const [previews, setPreviews] = useState<Record<string, boolean>>({
    "keyword-stakeholder": true,
  });
  const [activeSection, setActiveSection] = useState<string>();
  const [exportOpen, setExportOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const resolveSuggestion = (id: string) => setResolvedIds((prev) => new Set(prev).add(id));

  // Runs the real AI critique against this page's own demo resume. Falls
  // back to the static demo suggestion groups while loading, on error, or
  // when no backend is configured.
  const critique = useResumeCritique();
  const { run: runCritique } = critique;
  useEffect(() => {
    runCritique(buildResumePlainText);
  }, [runCritique]);

  const baseSuggestionGroups: SuggestionGroup[] =
    critique.status === "success" && critique.data ? toSuggestionGroups(critique.data) : demoSuggestionGroups;

  // Accepted/declined suggestions both leave the pending list — there's no
  // document text they can be spliced into automatically, so "resolving"
  // them is the real, honest effect of either action.
  const suggestionGroups: SuggestionGroup[] = baseSuggestionGroups
    .map((group) => ({
      ...group,
      suggestions: group.suggestions.filter((s) => !resolvedIds.has(s.id)),
    }))
    .filter((group) => group.suggestions.length > 0);

  const totalSuggestions = baseSuggestionGroups.reduce((n, g) => n + g.suggestions.length, 0);
  const progress =
    totalSuggestions > 0 ? Math.round((resolvedIds.size / totalSuggestions) * 100) : 0;

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    [demoSuggestionGroups[0].id]: true,
  });

  // Re-expand the first group whenever the underlying group set changes
  // (demo -> live swap on success, or a fresh critique run).
  useEffect(() => {
    const groups =
      critique.status === "success" && critique.data ? toSuggestionGroups(critique.data) : demoSuggestionGroups;
    if (groups[0]) setExpandedGroups({ [groups[0].id]: true });
  }, [critique.status, critique.data]);

  /** Panel → document: expanding a group scrolls to its section and marks it in the outline. */
  const toggleGroup = (group: SuggestionGroup) => {
    const opening = !expandedGroups[group.id];
    setExpandedGroups((prev) => ({ ...prev, [group.id]: opening }));
    if (opening && group.sectionId) {
      setActiveSection(group.sectionId);
      document
        .getElementById(group.sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /** Document → panel: navigating to a section expands its group (and collapses the rest). */
  const focusSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const group = suggestionGroups.find((g) => g.sectionId === sectionId);
    if (group) setExpandedGroups({ [group.id]: true });
  };

  const scrollToSection = (item: OutlineItem) => {
    focusSection(item.id);
    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AppShell
      sidebar={
        <Sidebar
          brand="ResumeAI"
          brandSubtitle="Professional Plan"
          items={navItems}
          activeItemId="build"
          user={currentUser}
          cta={{ label: "Upgrade Pro" }}
          onNavigate={(item) => onNavigate?.(item.id)}
        />
      }
      header={
        <TopBar
          title="Build"
          status="Editor: Senior Project Manager Resume"
          actions={
            <Button size="md" onClick={() => setExportOpen(true)}>
              Finalize & Export
            </Button>
          }
          utilities={
            <HeaderUtilities user={currentUser} notifications={notifications} onNavigate={onNavigate} />
          }
        />
      }
    >
      {/* Document outline */}
      <aside className="w-56 bg-surface-white border-r border-outline-variant overflow-y-auto custom-scrollbar shrink-0">
        <OutlinePanel items={outlineItems} activeItemId={activeSection} onSelect={scrollToSection} />
      </aside>

      {/* Interactive resume preview */}
      <main className="flex-1 bg-surface-container-low overflow-y-auto custom-scrollbar scroll-smooth">
        <div className="flex flex-col items-center p-stack-lg pt-stack-md">
          <div className="sticky top-stack-md z-10 mb-stack-md">
            <EditorToolbar editing={editing} onToggleEditing={setEditing} />
          </div>
          <div
            contentEditable={editing}
            suppressContentEditableWarning
            spellCheck={editing}
            className={cn(
              "w-full flex justify-center focus:outline-none",
              editing && "[&>div]:ring-2 [&>div]:ring-secondary/40 cursor-text",
            )}
          >
            <ResumeDocument
          className="print-resume-target"
          name="Alexander Rivera"
          contact={{
            items: ["New York, NY", "arivera.pro@email.com", "555-0123", "linkedin.com/in/arivera"],
          }}
        >
          <DocSection id="professional-summary" title="Professional Summary">
            <p className="text-body-md text-text-main leading-relaxed">
              <AiMarker onClick={() => focusSection("professional-summary")}>
                Visionary Senior Project Manager with 10+ years of experience leading
                cross-functional teams in high-growth tech environments. Proven track record of
                delivering complex software products under budget. Passionate about{" "}
                <span className="bg-secondary-container/10 px-1 rounded">optimizing workflows</span>{" "}
                and driving operational excellence through data-driven strategies.
              </AiMarker>
            </p>
          </DocSection>

          <DocSection id="core-competencies" title="Core Competencies">
            <div className="flex flex-wrap gap-2">
              {competencies.map((skill) => (
                <Tag key={skill} className="rounded px-3 py-1 text-label-sm bg-surface-container-high">
                  {skill}
                </Tag>
              ))}
            </div>
          </DocSection>

          <DocSection id="experience-google" title="Professional Experience">
            <DocExperience
              role="Senior Project Manager"
              company="Google"
              location="Mountain View, CA"
              period="2019 – Present"
              className="mb-6"
              bullets={[
                <AiMarker key="google-bullet-1" onClick={() => focusSection("experience-google")}>
                  Managed a $15M product portfolio focusing on cloud infrastructure scaling.
                </AiMarker>,
                "Led a global team of 45 engineers to reduce latency by 24% across core services.",
                "Implemented new SCRUM frameworks that increased velocity by 30% within 6 months.",
              ]}
            />
            <div id="experience-meta">
              <DocExperience
                role="Technical Project Manager"
                company="Meta"
                location="Menlo Park, CA"
                period="2015 – 2019"
                bullets={[
                  "Orchestrated the launch of 3 major feature updates for the Instagram ads platform.",
                  <AiMarker key="meta-bullet-2" onClick={() => focusSection("experience-meta")}>
                    Worked with stakeholders to define requirements and project scope.
                  </AiMarker>,
                  "Reduced operational overhead by 12% through automation of reporting tools.",
                ]}
              />
            </div>
          </DocSection>

          <DocSection id="education" title="Education">
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="text-headline-md text-text-main">M.S. in Management Science</h3>
                <p className="text-label-md font-bold text-secondary">Stanford University</p>
              </div>
              <span className="text-label-sm text-text-muted italic">2015</span>
            </div>
          </DocSection>
            </ResumeDocument>
          </div>
        </div>
      </main>

      {/* AI refinement panel */}
      <RefinementPanel
        subtitle="Personalized improvements based on Senior PM benchmarks."
        suggestionCount={suggestionGroups.reduce((n, g) => n + g.suggestions.length, 0)}
        progress={progress}
        onRescan={critique.rescan}
      >
        {critique.status === "loading" && (
          <p className="flex items-center gap-2 text-label-sm text-text-muted pb-2">
            <Icon name="autorenew" size={16} className="animate-spin" />
            Analyzing with AI…
          </p>
        )}
        {critique.status === "error" && (
          <p className="text-label-sm text-text-muted pb-2">
            Live AI analysis unavailable ({critique.error}) — showing example suggestions.
          </p>
        )}
        {suggestionGroups.map((group) => (
          <SuggestionGroupSection
            key={group.id}
            title={group.label}
            count={group.suggestions.length}
            expanded={expandedGroups[group.id] ?? false}
            onToggle={() => toggleGroup(group)}
          >
            {group.suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                variant="plain"
                onAccept={() => resolveSuggestion(suggestion.id)}
                onDecline={suggestion.declinable ? () => resolveSuggestion(suggestion.id) : undefined}
                preview={
                  suggestion.previewable
                    ? {
                        checked: previews[suggestion.id] ?? false,
                        onChange: (checked) =>
                          setPreviews((prev) => ({ ...prev, [suggestion.id]: checked })),
                      }
                    : undefined
                }
              />
            ))}
          </SuggestionGroupSection>
        ))}
      </RefinementPanel>

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        shareUrl={resumeMeta.shareUrl}
        onDownloadPdf={() => window.print()}
      />
    </AppShell>
  );
}
