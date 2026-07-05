import { cn } from "../../lib/cn";

export interface MentorQuoteProps {
  quote: string;
  author: string;
  className?: string;
}

/** Dark guidance footer with an italic quote and attribution. */
export function MentorQuote({ quote, author, className }: MentorQuoteProps) {
  return (
    <div className={cn("bg-primary-container p-6 rounded-xl", className)}>
      <p className="font-display text-body-lg italic leading-relaxed text-inverse-on-surface">
        “{quote}”
      </p>
      <p className="font-bold text-label-md uppercase text-on-primary-container mt-3">
        — {author}
      </p>
    </div>
  );
}
