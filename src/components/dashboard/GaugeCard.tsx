import { Card, Icon, ScoreRing } from "../ui";

export interface GaugeCardProps {
  title: string;
  /** 0–100 */
  score: number;
  /** Qualitative rating under the number, e.g. "Excellent". */
  rating?: string;
  /** Supporting sentence under the gauge. */
  caption?: string;
  className?: string;
}

/** Large circular-gauge score card (ATS readiness). */
export function GaugeCard({ title, score, rating, caption, className }: GaugeCardProps) {
  return (
    <Card interactive padding="lg" className={className}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center justify-between w-full mb-6">
          <h3 className="text-label-md text-primary uppercase">{title}</h3>
          <Icon name="info" className="text-secondary" size={20} />
        </div>
        <ScoreRing
          value={score}
          diameter={176}
          strokeWidth={14}
          className="mb-6"
          centerLabel={
            <div className="text-center">
              <span className="text-headline-lg text-primary block">{score}</span>
              {rating && (
                <span className="text-label-sm text-text-muted uppercase">{rating}</span>
              )}
            </div>
          }
        />
        {caption && (
          <p className="text-center text-body-sm text-text-muted px-4">{caption}</p>
        )}
      </div>
    </Card>
  );
}
