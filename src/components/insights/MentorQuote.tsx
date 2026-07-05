import { cn } from "../../lib/cn";

export interface MentorQuoteProps {
  quote: string;
  author: string;
  className?: string;
}

/** Dark guidance footer with an italic quote and attribution. */
export function MentorQuote({ quote, author, className }: MentorQuoteProps) {
  return (
    <div className={cn("bg-primary-container p-6 rounded-lg text-center shadow-inner", className)}>
      <p className="text-body-sm text-on-primary-container italic">“{quote}”</p>
      <p className="font-bold text-label-md text-white mt-3">— {author}</p>
    </div>
  );
}
