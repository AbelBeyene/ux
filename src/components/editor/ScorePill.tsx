import { cn } from "../../lib/cn";

export interface ScorePillProps {
  label: string;
  className?: string;
}

/** Floating live-score indicator with a pulsing status dot. */
export function ScorePill({ label, className }: ScorePillProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-secondary/5 border border-secondary/20 px-3 py-1 rounded-full",
        className,
      )}
    >
      <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" aria-hidden="true" />
      <span className="text-label-sm text-secondary font-bold">{label}</span>
    </div>
  );
}
