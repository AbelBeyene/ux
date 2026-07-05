import { cn } from "../../lib/cn";

export type ProgressTone = "primary" | "secondary";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value, 0–100. */
  value: number;
  tone?: ProgressTone;
}

const toneClasses: Record<ProgressTone, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
};

/** Thin horizontal progress track. */
export function ProgressBar({ value, tone = "primary", className, ...props }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("w-full bg-surface-container h-1.5 rounded-full overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-700 ease-out", toneClasses[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
