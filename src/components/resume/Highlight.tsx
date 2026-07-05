import { cn } from "../../lib/cn";

export type HighlightKind = "revision" | "strength";

export interface HighlightProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** `revision` marks AI-suggested rewrites; `strength` marks strong statements. */
  kind: HighlightKind;
  /** Tooltip explaining the annotation. */
  hint?: string;
  /** Render in the emphasized (hovered/linked) state. */
  active?: boolean;
}

const kindClasses: Record<HighlightKind, { base: string; active: string }> = {
  revision: {
    base: "bg-secondary-fixed/60 border-b-2 border-secondary cursor-pointer",
    active: "bg-secondary-fixed shadow-[0_0_15px_rgba(242,101,34,0.35)]",
  },
  strength: {
    base: "bg-primary-fixed/60 border-b-2 border-primary cursor-default",
    active: "shadow-[0_0_15px_rgba(18,46,69,0.2)]",
  },
};

/** Inline annotation span used inside resume text to flag AI feedback. */
export function Highlight({ kind, hint, active = false, className, ...props }: HighlightProps) {
  const styles = kindClasses[kind];
  return (
    <span
      title={hint}
      className={cn(
        "rounded px-0.5 transition-shadow duration-200",
        styles.base,
        active && styles.active,
        className,
      )}
      {...props}
    />
  );
}
