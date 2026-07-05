import { Card, Icon } from "../ui";
import type { KeywordMatch } from "../../types/dashboard";

export interface KeywordGridProps {
  title?: string;
  keywords: KeywordMatch[];
  className?: string;
}

function KeywordTile({ keyword, strength, note }: KeywordMatch) {
  const present = strength !== undefined;
  if (!present) {
    return (
      <div className="p-4 bg-surface-white rounded-lg border-2 border-dashed border-outline-variant">
        <Icon name="add_circle" className="text-outline mb-2 block" size={20} />
        <p className="text-label-md text-text-muted mb-1">{keyword}</p>
        {note && <p className="text-label-sm text-secondary italic">{note}</p>}
      </div>
    );
  }
  return (
    <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
      <Icon name="check_circle" className="text-green-600 mb-2 block" size={20} />
      <p className="text-label-md text-primary mb-1">{keyword}</p>
      <div className="w-full bg-outline-variant h-1 rounded-full overflow-hidden">
        <div className="bg-secondary-container h-full" style={{ width: `${strength}%` }} />
      </div>
    </div>
  );
}

/** Keyword match analysis: present keywords with strength bars, missing ones as dashed tiles. */
export function KeywordGrid({ title = "Keyword Match Analysis", keywords, className }: KeywordGridProps) {
  return (
    <Card interactive padding="lg" className={className}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h3 className="text-label-md text-primary uppercase">{title}</h3>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-label-sm text-secondary-container">
            <span className="w-2 h-2 rounded-full bg-secondary-container" aria-hidden="true" /> Present
          </span>
          <span className="flex items-center gap-1.5 text-label-sm text-outline">
            <span className="w-2 h-2 rounded-full bg-outline" aria-hidden="true" /> Missing
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {keywords.map((kw) => (
          <KeywordTile key={kw.keyword} {...kw} />
        ))}
      </div>
    </Card>
  );
}
