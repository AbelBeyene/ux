import { cn } from "../../lib/cn";

export interface OutlineItem {
  id: string;
  label: string;
}

export interface OutlinePanelProps {
  title?: string;
  items: OutlineItem[];
  activeItemId?: string;
  onSelect?: (item: OutlineItem) => void;
  className?: string;
}

/** Document outline column: jump links to sections of the edited resume. */
export function OutlinePanel({
  title = "Outline",
  items,
  activeItemId,
  onSelect,
  className,
}: OutlinePanelProps) {
  return (
    <nav className={cn("py-stack-md px-2", className)} aria-label={title}>
      <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest px-4 mb-2">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect?.(item)}
              className={cn(
                "w-full text-left px-4 py-2 text-label-sm transition-colors rounded-lg",
                item.id === activeItemId
                  ? "text-secondary font-bold"
                  : "text-text-main hover:text-secondary",
              )}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
