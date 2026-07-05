import { cn } from "../../lib/cn";
import { useCountUp } from "../../lib/useCountUp";
import { Card, Icon, ProgressBar, ScoreRing } from "../ui";
import type { ScoreMetric } from "../../types/resume";

export interface ScoreOverviewCardProps {
  label: string;
  /** 0–100 */
  score: number;
  /** Letter grade shown inside the ring, e.g. "B+". */
  grade?: string;
  metrics: ScoreMetric[];
  className?: string;
}

/**
 * Score ring and its sub-metrics in one card instead of three — the ring and
 * a metric's bar+percentage read fine at a smaller size, so stacking them as
 * separate full-padding Cards was mostly spending height on borders/padding
 * rather than information.
 */
export function ScoreOverviewCard({ label, score, grade, metrics, className }: ScoreOverviewCardProps) {
  const displayed = useCountUp(score);
  return (
    <Card className={className}>
      <div className="flex items-center gap-stack-md pb-stack-md border-b border-outline-variant">
        <ScoreRing value={score} diameter={64} strokeWidth={7} centerLabel={grade} />
        <div>
          <p className="text-label-md text-text-muted uppercase mb-1">{label}</p>
          <p className="text-display-md text-primary tabular-nums leading-none">
            {displayed}
            <span className="text-headline-md text-text-muted ml-1">/100</span>
          </p>
        </div>
      </div>

      <div className="pt-stack-md space-y-3">
        {metrics.map((metric) => {
          const good = metric.tone === "good";
          return (
            <div key={metric.label} className="flex items-center gap-3">
              <Icon
                name={good ? "check_circle" : "warning"}
                size={18}
                className={cn("shrink-0", good ? "text-primary" : "text-secondary")}
              />
              <span className="text-body-sm text-text-main w-24 shrink-0 truncate">{metric.label}</span>
              <ProgressBar value={metric.value} tone={good ? "primary" : "secondary"} className="flex-1" />
              <span
                className={cn(
                  "text-label-md font-bold tabular-nums w-10 text-right shrink-0",
                  good ? "text-primary" : "text-secondary",
                )}
              >
                {metric.value}%
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
