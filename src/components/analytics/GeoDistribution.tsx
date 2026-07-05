import { Card, ProgressBar } from "../ui";
import type { CountryStat } from "../../types/analytics";

export interface GeoDistributionProps {
  title?: string;
  stats: CountryStat[];
  className?: string;
}

/** Country breakdown with proportional bars. Renders nothing when empty. */
export function GeoDistribution({ title = "Geographic Distribution", stats, className }: GeoDistributionProps) {
  if (stats.length === 0) return null;
  const max = Math.max(...stats.map((s) => s.count));

  return (
    <Card padding="lg" className={className}>
      <h3 className="text-label-md text-primary uppercase mb-5">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
        {stats.map((stat) => (
          <div key={stat.country}>
            <div className="flex justify-between mb-1.5">
              <span className="text-body-sm text-text-main">{stat.country}</span>
              <span className="text-body-sm font-bold text-primary">{stat.count}</span>
            </div>
            <ProgressBar value={(stat.count / max) * 100} tone="primary" />
          </div>
        ))}
      </div>
    </Card>
  );
}
