import { cn } from "../../lib/cn";
import { Icon, Toggle } from "../ui";
import type { Suggestion } from "../../types/resume";

export interface SuggestionCardProps {
  suggestion: Suggestion;
  onAccept?: (suggestion: Suggestion) => void;
  onDecline?: (suggestion: Suggestion) => void;
  /** When set, renders the "Preview change" toggle row. */
  preview?: { checked: boolean; onChange: (checked: boolean) => void };
  /** `plain` drops the border for a quiet tinted surface (use inside groups/lists). */
  variant?: "outlined" | "plain";
  className?: string;
}

/** AI refinement suggestion with accept/decline actions and optional preview toggle. */
export function SuggestionCard({
  suggestion,
  onAccept,
  onDecline,
  preview,
  variant = "outlined",
  className,
}: SuggestionCardProps) {
  return (
    <div
      className={cn(
        "p-stack-md rounded-lg transition-colors",
        variant === "outlined" &&
          "bg-surface-container-lowest border border-outline-variant hover:border-secondary",
        variant === "plain" && "bg-surface-container-low",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 bg-secondary/10 p-2 rounded-lg text-secondary shrink-0">
          <Icon name={suggestion.icon} size={20} />
        </div>
        <div>
          <h3 className="text-label-md font-bold text-text-main">{suggestion.title}</h3>
          <p className="text-body-sm text-text-muted mt-1">{suggestion.description}</p>
        </div>
      </div>
      {/* Single footer row: preview utility left, quiet decline + compact accept right */}
      <div className="flex items-center justify-between gap-2 mt-3">
        {preview ? (
          <label className="flex items-center gap-2 text-label-sm text-text-muted cursor-pointer">
            <Toggle
              checked={preview.checked}
              onChange={preview.onChange}
              label={`Preview change: ${suggestion.title}`}
            />
            Preview
          </label>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1">
          {onDecline && (
            <button
              type="button"
              onClick={() => onDecline(suggestion)}
              className="px-2.5 py-1.5 text-label-md font-bold text-text-muted hover:text-text-main rounded-lg hover:bg-surface-container transition-colors"
            >
              Decline
            </button>
          )}
          {onAccept && (
            <button
              type="button"
              onClick={() => onAccept(suggestion)}
              className="px-3 py-1.5 text-label-md font-bold text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
            >
              {suggestion.acceptLabel ?? "Accept"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
