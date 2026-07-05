import { cn } from "../../lib/cn";
import { Card } from "../ui";
import type { RelevanceScore } from "../../types/dashboard";

export interface RelevanceCardProps {
  title: string;
  scores: RelevanceScore[];
  className?: string;
}

const toneStyles = {
  accent: { bar: "bg-secondary-container", value: "text-secondary" },
  strong: { bar: "bg-primary opacity-60", value: "text-primary" },
  faint: { bar: "bg-primary opacity-30", value: "text-primary" },
} as const;

/** Labeled percentage bars ranking category fit (industry relevance). */
export function RelevanceCard({ title, scores, className }: RelevanceCardProps) {
  return (
    <Card interactive padding="lg" className={className}>
      <h3 className="text-label-md text-primary uppercase mb-6">{title}</h3>
      <div className="space-y-5">
        {scores.map((score) => {
          const style = toneStyles[score.tone];
          return (
            <div key={score.label}>
              <div className="flex justify-between mb-2">
                <span className="text-body-md text-primary">{score.label}</span>
                <span className={cn("font-bold", style.value)}>{score.value}%</span>
              </div>
              <div
                className="w-full bg-surface-container h-2.5 rounded-full"
                role="progressbar"
                aria-valuenow={score.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={score.label}
              >
                <div
                  className={cn("h-full rounded-full", style.bar)}
                  style={{ width: `${score.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
