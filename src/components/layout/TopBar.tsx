import { cn } from "../../lib/cn";

export interface TopBarProps {
  title: string;
  /** Muted status text next to the title, e.g. "Last saved: 2m ago". */
  status?: string;
  /** Action buttons rendered on the right (Share/Export…). */
  actions?: React.ReactNode;
  /** Icon buttons rendered at the far right (notifications, account…). */
  utilities?: React.ReactNode;
  className?: string;
}

/** Sticky application header with a title, status text and action slots. */
export function TopBar({ title, status, actions, utilities, className }: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-surface-white border-b border-outline-variant flex justify-between items-center w-full px-gutter h-14",
        className,
      )}
    >
      <div className="flex items-center gap-stack-md">
        <h2 className="text-headline-md font-extrabold text-primary">{title}</h2>
        {status && (
          <>
            <div className="h-6 w-px bg-outline-variant" aria-hidden="true" />
            <span className="text-body-sm text-text-muted">{status}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-stack-md">
        {actions && <div className="flex items-center gap-stack-sm">{actions}</div>}
        {utilities && <div className="flex items-center gap-2">{utilities}</div>}
      </div>
    </header>
  );
}
