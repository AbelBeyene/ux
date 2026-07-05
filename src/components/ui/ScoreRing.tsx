import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";

export interface ScoreRingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Score value, 0–100, mapped to ring sweep. */
  value: number;
  /** Text rendered in the center of the ring (e.g. a letter grade). */
  centerLabel?: React.ReactNode;
  /** Outer diameter in pixels. */
  diameter?: number;
  /** Ring stroke width in pixels. */
  strokeWidth?: number;
}

/** Circular progress ring with an optional center label. */
export function ScoreRing({
  value,
  centerLabel,
  diameter = 80,
  strokeWidth = 7,
  className,
  ...props
}: ScoreRingProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = diameter / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Sweep in from empty on mount; the stroke transition below animates it.
  const [sweep, setSweep] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setSweep(clamped));
    return () => cancelAnimationFrame(raf);
  }, [clamped]);
  const offset = circumference * (1 - sweep / 100);

  return (
    <div
      role="img"
      aria-label={`Score: ${clamped} out of 100`}
      className={cn("relative", className)}
      style={{ width: diameter, height: diameter }}
      {...props}
    >
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${diameter} ${diameter}`}>
        <circle
          className="text-surface-container"
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle
          className="text-secondary transition-all duration-1000 ease-out"
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {centerLabel !== undefined && (
        <div className="absolute inset-0 flex items-center justify-center font-display text-display-md text-primary">
          {centerLabel}
        </div>
      )}
    </div>
  );
}
