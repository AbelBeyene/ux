import { useEffect, useState } from "react";
import { Card, ScoreRing } from "../ui";

export interface ScoreCardProps {
  label: string;
  /** 0–100 */
  score: number;
  /** Letter grade shown inside the ring, e.g. "B+". */
  grade?: string;
  className?: string;
}

/** Counts from 0 to `target` with an ease-out curve; skips straight to the
 * end for users who prefer reduced motion. */
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/** Headline score card: the AI's verdict, set like a grader's mark. */
export function ScoreCard({ label, score, grade, className }: ScoreCardProps) {
  const displayed = useCountUp(score);
  return (
    <Card className={className}>
      <div className="flex items-center justify-between gap-stack-md">
        <div>
          <p className="text-label-md text-text-muted uppercase mb-2">{label}</p>
          <h3 className="text-display-md text-primary tabular-nums">
            {displayed}
            <span className="text-headline-md text-text-muted ml-1">
              /100
            </span>
          </h3>
        </div>
        <ScoreRing value={score} centerLabel={grade} />
      </div>
    </Card>
  );
}
