import { useId } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../ui";

export interface SuggestionGroupSectionProps {
  /** Category label, e.g. "Professional Summary". */
  title: string;
  /** Number of suggestions inside, shown next to the title. */
  count: number;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

/** Collapsible category of refinement suggestions, rendered as a flat divider-separated row. */
export function SuggestionGroupSection({
  title,
  count,
  expanded,
  onToggle,
  children,
  className,
}: SuggestionGroupSectionProps) {
  const bodyId = useId();
  return (
    <section className={cn("border-b border-outline-variant last:border-b-0", className)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={bodyId}
        className="w-full flex items-center justify-between gap-2 py-3 text-left group"
      >
        <span className="flex items-baseline gap-2 min-w-0">
          <span
            className={cn(
              "text-label-md font-bold uppercase truncate transition-colors",
              expanded ? "text-primary" : "text-text-muted group-hover:text-text-main",
            )}
          >
            {title}
          </span>
          <span className="text-label-sm text-text-muted shrink-0">{count}</span>
        </span>
        <Icon
          name="expand_more"
          size={20}
          className={cn("text-text-muted transition-transform duration-200", expanded && "rotate-180")}
        />
      </button>
      {/* grid-rows trick animates open/close without measuring content height */}
      <div
        id={bodyId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-stack-md space-y-stack-sm">{children}</div>
        </div>
      </div>
    </section>
  );
}
