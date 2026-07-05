import { cn } from "../../lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left accent border, used to flag the active/highlighted card. */
  accent?: boolean;
  /** Inner padding preset. `none` lets the consumer manage padding. */
  padding?: "none" | "sm" | "md" | "lg";
  /** Lift the card on hover (bento-grid tiles). */
  interactive?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-stack-md",
  lg: "p-6",
} as const;

/** Surface container card. The base building block for dashboard panels. */
export function Card({
  accent = false,
  padding = "md",
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest rounded-lg border border-outline-variant",
        accent && "border-l-8 border-l-secondary shadow-md",
        !accent && "shadow-sm",
        interactive &&
          "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(18,46,69,0.08)]",
        paddingClasses[padding],
        className,
      )}
      {...props}
    />
  );
}
