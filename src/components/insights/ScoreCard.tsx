import { Card, ScoreRing } from "../ui";

export interface ScoreCardProps {
  label: string;
  /** 0–100 */
  score: number;
  /** Letter grade shown inside the ring, e.g. "B+". */
  grade?: string;
  className?: string;
}

/** Headline score card with a numeric score and progress ring. */
export function ScoreCard({ label, score, grade, className }: ScoreCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label-md text-text-muted uppercase mb-1">{label}</p>
          <h3 className="text-headline-lg text-primary">
            {score}
            <span className="text-headline-md font-bold text-text-muted">/100</span>
          </h3>
        </div>
        <ScoreRing value={score} centerLabel={grade} />
      </div>
    </Card>
  );
}
