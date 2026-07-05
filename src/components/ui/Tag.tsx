import { cn } from "../../lib/cn";

export type TagProps = React.HTMLAttributes<HTMLSpanElement>;

/** Pill-shaped chip used for skills and keywords. */
export function Tag({ className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "px-4 py-1.5 bg-surface-container-high rounded-full text-body-sm text-text-main border border-outline-variant",
        className,
      )}
      {...props}
    />
  );
}
