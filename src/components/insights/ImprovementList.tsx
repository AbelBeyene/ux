import { Card, Icon } from "../ui";
import type { Improvement } from "../../types/resume";

export interface ImprovementListProps {
  title?: string;
  items: Improvement[];
  onSelect?: (item: Improvement) => void;
  className?: string;
}

/** List of pending improvement suggestions with icon, copy and chevron. */
export function ImprovementList({ title, items, onSelect, className }: ImprovementListProps) {
  return (
    <Card className={className}>
      {title && (
        <h4 className="font-bold text-label-md text-primary uppercase mb-stack-md tracking-wider">
          {title} ({items.length})
        </h4>
      )}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect?.(item)}
              className="w-full text-left flex items-center gap-4 p-3 hover:bg-surface-container-low rounded-lg cursor-pointer transition-colors group border border-transparent hover:border-outline-variant"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon name={item.icon} size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-body-md text-text-main group-hover:text-secondary transition-colors">
                  {item.title}
                </p>
                <p className="text-body-sm text-text-muted">{item.description}</p>
              </div>
              <Icon name="chevron_right" className="text-outline" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
