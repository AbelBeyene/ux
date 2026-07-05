import { useRef, useState } from "react";
import { AppShell, HeaderUtilities, Sidebar, TopBar } from "../components/layout";
import { Button, Icon } from "../components/ui";
import { ActivityFeed, GeoDistribution, KpiCard, LinkPerformance } from "../components/analytics";
import { currentUser, navItems, notifications } from "../data/resume";
import {
  activityEvents,
  countryStats,
  kpiMetrics,
  resumeMeta,
  trackedLinks,
} from "../data/analytics";

export interface HistoryPageProps {
  onNavigate?: (pageId: string) => void;
}

/** Resume analytics: how a shared resume performs after being viewed or downloaded. */
export function HistoryPage({ onNavigate }: HistoryPageProps) {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(resumeMeta.shareUrl);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — leave the label unchanged.
    }
  };

  return (
    <AppShell
      sidebar={
        <Sidebar
          brand="ResumeAI"
          brandSubtitle="Professional Plan"
          items={navItems}
          activeItemId="history"
          user={currentUser}
          cta={{ label: "Upgrade Pro" }}
          onNavigate={(item) => onNavigate?.(item.id)}
        />
      }
      header={
        <TopBar
          title="Analytics"
          status="Updated just now"
          utilities={
            <HeaderUtilities user={currentUser} notifications={notifications} onNavigate={onNavigate} />
          }
        />
      }
    >
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-background">
        <div className="max-w-container-max mx-auto p-stack-lg">
          {/* Page header: resume title + share actions */}
          <div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-headline-lg text-primary mb-1 truncate">{resumeMeta.title}</h2>
              <p className="text-text-muted text-body-md">Analytics Overview</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded"
                onClick={copyShareLink}
              >
                <Icon name={copied ? "check" : "link"} size={20} />
                {copied ? "Copied!" : "Copy Share Link"}
              </Button>
              <Button className="flex items-center gap-2 rounded">
                <Icon name="download" size={20} />
                Download Resume
              </Button>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter mb-gutter">
            {kpiMetrics.map((metric) => (
              <KpiCard key={metric.id} metric={metric} />
            ))}
          </div>

          {/* Activity timeline + link performance */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-gutter mb-gutter">
            <ActivityFeed className="lg:col-span-7" events={activityEvents} />
            <LinkPerformance className="lg:col-span-3 h-fit" links={trackedLinks} />
          </div>

          {/* Geographic distribution (hidden when no data) */}
          <GeoDistribution stats={countryStats} />
        </div>
      </main>
    </AppShell>
  );
}
