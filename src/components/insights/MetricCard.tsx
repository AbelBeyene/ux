import { cn } from "../../lib/cn";
import { Card, Icon, ProgressBar } from "../ui";
import type { ScoreMetric } from "../../types/resume";

export interface MetricCardProps {
  metric: ScoreMetric;
  className?: string;
}

/** Compact metric card: label, percentage, status icon and progress bar. */
export function MetricCard({ metric, className }: MetricCardProps) {
  const good = metric.tone === "good";
  return (
    <Card padding="sm" className={cn("shadow-none", className)}>
      <p className="text-label-md text-text-muted uppercase mb-2">{metric.label}</p>
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            "text-headline-md tabular-nums",
            good ? "text-primary" : "text-secondary",
          )}
        >
          {metric.value}%
        </span>
        <Icon
          name={good ? "check_circle" : "warning"}
          className={good ? "text-primary" : "text-secondary"}
        />
      </div>
      <ProgressBar value={metric.value} tone={good ? "primary" : "secondary"} />
    </Card>
  );
}
