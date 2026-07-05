import { cn } from "../../lib/cn";
import { Card, Icon } from "../ui";
import type { FormattingCheck } from "../../types/dashboard";

export interface ChecklistCardProps {
  title: string;
  checks: FormattingCheck[];
  className?: string;
}

const statusStyles = {
  pass: { icon: "task_alt", box: "bg-green-100", color: "text-green-700" },
  warning: { icon: "warning", box: "bg-orange-100", color: "text-secondary" },
} as const;

/** Pass/warning checklist (formatting integrity). */
export function ChecklistCard({ title, checks, className }: ChecklistCardProps) {
  return (
    <Card interactive padding="lg" className={className}>
      <h3 className="text-label-md text-primary uppercase mb-6">{title}</h3>
      <ul className="space-y-5">
        {checks.map((check) => {
          const style = statusStyles[check.status];
          return (
            <li key={check.id} className="flex items-start gap-4">
              <div className={cn("p-2 rounded-lg shrink-0", style.box)}>
                <Icon name={style.icon} className={style.color} size={20} />
              </div>
              <div>
                <p className="text-label-md text-primary">{check.title}</p>
                <p className="text-body-sm text-text-muted">{check.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
