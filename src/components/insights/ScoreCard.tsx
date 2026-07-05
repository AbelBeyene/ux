import { Card, ScoreRing } from "../ui";
import { useCountUp } from "../../lib/useCountUp";

export interface ScoreCardProps {
  label: string;
  /** 0–100 */
  score: number;
  /** Letter grade shown inside the ring, e.g. "B+". */
  grade?: string;
  className?: string;
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
