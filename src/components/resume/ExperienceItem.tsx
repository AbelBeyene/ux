import { cn } from "../../lib/cn";
import type { ExperienceEntry } from "../../types/resume";

export interface ExperienceItemProps {
  entry: ExperienceEntry;
  className?: string;
}

/** Single role within the Professional Experience section. */
export function ExperienceItem({ entry, className }: ExperienceItemProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-baseline">
        <h5 className="text-headline-md text-primary">{entry.role}</h5>
        <span className="text-body-sm text-text-muted">{entry.period}</span>
      </div>
      <p className="font-bold text-body-md text-secondary">{entry.company}</p>
      <ul className="list-disc ml-5 space-y-2 text-body-md">
        {entry.bullets.map((bullet, i) => (
          <li key={i}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}
