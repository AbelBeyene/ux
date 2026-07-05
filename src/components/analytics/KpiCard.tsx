import { cn } from "../../lib/cn";
import { Card, Icon } from "../ui";
import type { KpiMetric } from "../../types/analytics";

export interface KpiCardProps {
  metric: KpiMetric;
  className?: string;
}

/** Compact KPI stat card: label, large value, icon and trend text. */
export function KpiCard({ metric, className }: KpiCardProps) {
  const down = metric.trendDirection === "down";
  return (
    <Card padding="md" interactive className={className}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label-md text-text-muted uppercase truncate">
            {metric.label}
          </p>
          <p className="text-headline-lg text-primary mt-1">
            {metric.value.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 text-primary flex items-center justify-center shrink-0">
            <Icon name={metric.icon} size={18} />
          </div>
          {metric.trend && (
            <span
              className={cn(
                "text-label-sm font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
                down ? "bg-error/10 text-error" : "bg-green-50 text-green-700",
              )}
            >
              <Icon name={down ? "trending_down" : "trending_up"} size={14} />
              {metric.trend}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
