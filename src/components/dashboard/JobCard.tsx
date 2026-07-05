import { cn } from "../../lib/cn";
import { Icon } from "../ui";
import type { JobListing } from "../../types/dashboard";

export interface JobCardProps {
  job: JobListing;
  /** Whether the listing is in the user's saved set; fills the bookmark icon. */
  saved?: boolean;
  onApply?: (job: JobListing) => void;
  onSave?: (job: JobListing) => void;
  className?: string;
}

/** Match tint follows score: strong matches get the accent treatment. */
function matchStyles(score: number) {
  if (score >= 85) return "bg-secondary/10 text-secondary";
  if (score >= 70) return "bg-primary/10 text-primary";
  return "bg-surface-container-high text-text-muted";
}

/** Job listing fetched from a portal, scored against the uploaded resume. */
export function JobCard({ job, saved = false, onApply, onSave, className }: JobCardProps) {
  return (
    <article
      className={cn(
        "bg-surface-container-lowest border border-outline-variant rounded-lg p-4 hover:border-secondary transition-colors",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {/* Company monogram */}
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-body-sm shrink-0">
          {job.company.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-label-md font-bold text-text-main leading-snug">{job.title}</h4>
          <p className="text-body-sm text-text-muted truncate">
            {job.company} • {job.location}
            {job.workMode && ` (${job.workMode})`}
          </p>
        </div>
        <span
          className={cn(
            "px-2 py-1 rounded-full text-label-sm font-bold shrink-0",
            matchStyles(job.matchScore),
          )}
        >
          {job.matchScore}%
        </span>
      </div>

      {job.salary && (
        <p className="mt-3 text-body-sm font-bold text-text-main flex items-center gap-1">
          <Icon name="payments" size={16} className="text-text-muted" />
          {job.salary}
        </p>
      )}

      {job.matchedSkills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {job.matchedSkills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-surface-container-low border border-outline-variant rounded-full text-label-sm text-text-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-outline-variant flex items-center justify-between">
        <span className="text-label-sm text-text-muted">
          {job.postedAgo} • via <span className="font-bold">{job.source}</span>
        </span>
        <div className="flex items-center gap-1">
          {onSave && (
            <button
              type="button"
              aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
              aria-pressed={saved}
              onClick={() => onSave(job)}
              className={cn(
                "p-1.5 hover:bg-surface-container-low rounded-full transition-colors",
                saved ? "text-secondary" : "text-text-muted hover:text-secondary",
              )}
            >
              <Icon name="bookmark" filled={saved} size={18} />
            </button>
          )}
          {onApply && (
            <button
              type="button"
              onClick={() => onApply(job)}
              className="px-3 py-1.5 bg-secondary text-on-secondary rounded-lg text-label-sm font-bold hover:bg-accent-hover transition-colors flex items-center gap-1"
            >
              Apply
              <Icon name="open_in_new" size={14} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/** Placeholder shown while listings are being fetched from the portal. */
export function JobCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-surface-container shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-surface-container rounded w-3/4" />
          <div className="h-3 bg-surface-container rounded w-1/2" />
        </div>
        <div className="w-10 h-6 bg-surface-container rounded-full" />
      </div>
      <div className="mt-4 flex gap-1.5">
        <div className="h-5 w-16 bg-surface-container rounded-full" />
        <div className="h-5 w-20 bg-surface-container rounded-full" />
      </div>
      <div className="mt-3 pt-3 border-t border-outline-variant flex justify-between">
        <div className="h-3 w-24 bg-surface-container rounded" />
        <div className="h-7 w-16 bg-surface-container rounded-lg" />
      </div>
    </div>
  );
}
