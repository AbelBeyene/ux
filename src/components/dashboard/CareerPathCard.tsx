import { Fragment } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../ui";
import type { CareerStage } from "../../types/dashboard";

export interface CareerPathCardProps {
  /** Eyebrow label, e.g. "AI Career Projection". */
  eyebrow: string;
  headline: string;
  description: string;
  stages: CareerStage[];
  className?: string;
}

const stageTitleStyles = {
  current: "text-white",
  target: "text-secondary-fixed",
  future: "text-white/50",
} as const;

/** Dark projection band showing a career progression path (designed as a page footer). */
export function CareerPathCard({ eyebrow, headline, description, stages, className }: CareerPathCardProps) {
  return (
    <div className={cn("bg-primary text-white p-8 relative overflow-hidden", className)}>
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div>
          <h3 className="text-label-md text-secondary-fixed uppercase mb-3">{eyebrow}</h3>
          <p className="text-headline-lg mb-3">{headline}</p>
          <p className="text-body-md text-on-primary-container">{description}</p>
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between items-center bg-white/5 p-6 rounded-lg backdrop-blur-sm border border-white/10">
            {stages.map((stage, i) => (
              <Fragment key={stage.label}>
                {i > 0 && (
                  <div className="px-2">
                    <Icon
                      name="trending_flat"
                      size={36}
                      className={i === 1 ? "text-secondary-fixed animate-pulse" : "text-white/30"}
                    />
                  </div>
                )}
                <div className="flex-1 text-center">
                  <p className="text-label-sm text-on-primary-container uppercase mb-2">
                    {stage.label}
                  </p>
                  <p className={cn("text-headline-md", stageTitleStyles[stage.tone])}>
                    {stage.title}
                  </p>
                  {stage.note && (
                    <p className="text-body-sm text-secondary-fixed-dim mt-1">{stage.note}</p>
                  )}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
