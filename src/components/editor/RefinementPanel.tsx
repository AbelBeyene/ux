import { cn } from "../../lib/cn";
import { Button, Icon, ProgressBar } from "../ui";

export interface RefinementPanelProps {
  title?: string;
  subtitle?: string;
  /** Count shown in the pill badge next to the title. */
  suggestionCount: number;
  /** Optimization progress, 0–100, shown in the footer. */
  progress: number;
  onRescan?: () => void;
  /** Suggestion cards (or any content) for the scrollable body. */
  children: React.ReactNode;
  className?: string;
}

/** Right-hand AI refinement panel: header, scrollable suggestions, progress footer. */
export function RefinementPanel({
  title = "Refinement Panel",
  subtitle,
  suggestionCount,
  progress,
  onRescan,
  children,
  className,
}: RefinementPanelProps) {
  return (
    <aside
      className={cn(
        "w-96 bg-surface-white border-l border-outline-variant flex flex-col h-full",
        className,
      )}
    >
      <div className="p-stack-md border-b border-outline-variant">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-headline-md text-text-main">{title}</h2>
          <span className="bg-secondary text-on-secondary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
            {suggestionCount} Suggestions
          </span>
        </div>
        {subtitle && <p className="text-body-sm text-text-muted">{subtitle}</p>}
      </div>

      <div className="flex-1 overflow-y-auto px-stack-md py-stack-sm custom-scrollbar">
        {children}
      </div>

      <div className="p-stack-md bg-surface-container-low border-t border-outline-variant">
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-label-sm text-text-main font-bold">Optimization Progress</span>
            <span className="text-label-sm text-secondary font-bold">{progress}%</span>
          </div>
          <ProgressBar value={progress} tone="secondary" className="h-2" />
        </div>
        {onRescan && (
          <Button variant="outline" fullWidth size="lg" className="rounded flex items-center justify-center gap-2" onClick={onRescan}>
            <Icon name="refresh" size={20} />
            Re-scan Resume
          </Button>
        )}
      </div>
    </aside>
  );
}
