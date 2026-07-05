import { Card, Icon } from "../ui";
import type { TrackedLink } from "../../types/analytics";

export interface LinkPerformanceProps {
  title?: string;
  links: TrackedLink[];
  className?: string;
}

/** Compact list of tracked outbound links with click counts. */
export function LinkPerformance({
  title = "Link Performance",
  links,
  className,
}: LinkPerformanceProps) {
  return (
    <Card padding="none" className={className}>
      <h3 className="text-label-md text-primary uppercase px-5 pt-5 pb-3">
        {title}
      </h3>
      <ul className="px-2 pb-2">
        {links.map((link) => (
          <li key={link.id} className="py-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-container-low transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 text-primary flex items-center justify-center shrink-0">
                <Icon name={link.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-bold text-text-main truncate">
                  {link.name}
                </p>
                <p className="text-label-sm text-text-muted">
                  Last clicked {link.lastClicked}
                </p>
              </div>
              <span className="text-headline-md text-primary shrink-0">
                {link.clicks}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
