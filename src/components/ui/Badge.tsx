import { cn } from "../../lib/cn";

export type BadgeVariant = "accent" | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  accent: "bg-secondary text-on-secondary",
  neutral: "bg-surface-container-high text-text-main border border-outline-variant",
};

/** Small uppercase status label, e.g. "High Impact". */
export function Badge({ variant = "accent", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded text-label-sm uppercase font-bold",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
