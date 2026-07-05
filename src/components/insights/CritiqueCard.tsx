import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { Badge, Button, Card } from "../ui";
import type { Critique } from "../../types/resume";

export interface CritiqueCardProps {
  critique: Critique;
  /** Emphasized state, e.g. when the linked resume span is hovered. */
  highlighted?: boolean;
  onApply?: (critique: Critique) => void;
  onDismiss?: (critique: Critique) => void;
  className?: string;
}

/** Active AI critique with a suggested rewrite and apply/dismiss actions. */
export const CritiqueCard = forwardRef<HTMLDivElement, CritiqueCardProps>(function CritiqueCard(
  { critique, highlighted = false, onApply, onDismiss, className },
  ref,
) {
  return (
    <div ref={ref}>
      <Card
        accent
        padding="none"
        className={cn(
          "overflow-hidden transition-shadow duration-200",
          highlighted && "ring-4 ring-secondary/20 shadow-xl",
          className,
        )}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-headline-md text-primary">{critique.title}</h4>
            <Badge>{critique.impact}</Badge>
          </div>
          <p className="text-body-md text-text-main mb-6">{critique.description}</p>
          {critique.suggestion && (
            <div className="bg-paper p-4 rounded-lg border border-paper-line mb-6">
              <p className="text-label-md text-text-muted uppercase mb-2">Suggested rewrite</p>
              <p className="font-display text-body-lg italic text-text-main leading-relaxed">
                “{critique.suggestion}”
              </p>
            </div>
          )}
          <div className="flex gap-4">
            {onApply && (
              <Button size="lg" onClick={() => onApply(critique)}>
                Apply Suggestion
              </Button>
            )}
            {onDismiss && (
              <Button variant="ghost" size="lg" onClick={() => onDismiss(critique)}>
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
});
