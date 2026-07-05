import { cn } from "../../lib/cn";

export interface AiMarkerProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/** Marks resume content the AI has a suggestion for: pulsing underline, hover tint. */
export function AiMarker({ className, ...props }: AiMarkerProps) {
  return (
    <span
      className={cn("ai-marker inline hover:bg-secondary/5 transition-colors rounded-sm", className)}
      {...props}
    />
  );
}
