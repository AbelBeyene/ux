import { cn } from "../../lib/cn";
import { Button, Icon, IconButton } from "../ui";
import { JobCard, JobCardSkeleton } from "./JobCard";
import type { JobListing } from "../../types/dashboard";

export interface JobMatchPanelProps {
  jobs: JobListing[];
  /** True while listings are being fetched; renders skeleton cards. */
  loading?: boolean;
  /** Portal the listings come from, shown in the header subtitle. */
  sourceLabel?: string;
  onRefresh?: () => void;
  onApply?: (job: JobListing) => void;
  onSave?: (job: JobListing) => void;
  /** "View all" action at the bottom of the panel. */
  onViewAll?: () => void;
  className?: string;
}

/** Right-rail panel of job listings matched to the uploaded resume. */
export function JobMatchPanel({
  jobs,
  loading = false,
  sourceLabel,
  onRefresh,
  onApply,
  onSave,
  onViewAll,
  className,
}: JobMatchPanelProps) {
  return (
    <aside
      className={cn(
        "w-80 bg-surface-white border-l border-outline-variant flex flex-col h-full shrink-0",
        className,
      )}
      aria-label="Matched jobs"
    >
      <div className="p-stack-md border-b border-outline-variant">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <Icon name="work" size={20} className="text-secondary" />
            <h2 className="text-headline-md text-text-main">Matched Jobs</h2>
          </div>
          {onRefresh && (
            <IconButton icon="refresh" label="Refresh job matches" onClick={onRefresh} disabled={loading} className={cn(loading && "animate-spin")} />
          )}
        </div>
        <p className="text-body-sm text-text-muted">
          {loading
            ? "Fetching listings for your resume…"
            : `${jobs.length} roles matched to your resume${sourceLabel ? ` from ${sourceLabel}` : ""}.`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-stack-md space-y-stack-sm" aria-busy={loading}>
        {loading
          ? Array.from({ length: 4 }, (_, i) => <JobCardSkeleton key={i} />)
          : jobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={onApply} onSave={onSave} />
            ))}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-10 px-4">
            <Icon name="work_off" size={32} className="text-outline mb-2" />
            <p className="text-body-sm text-text-muted">
              No matching jobs right now. Re-scan your resume or broaden your target role.
            </p>
          </div>
        )}
      </div>

      {onViewAll && (
        <div className="p-stack-md border-t border-outline-variant bg-surface-container-low">
          <Button variant="outline" fullWidth className="rounded flex items-center justify-center gap-2" onClick={onViewAll}>
            View All on Job Portal
            <Icon name="arrow_forward" size={18} />
          </Button>
        </div>
      )}
    </aside>
  );
}
