import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Material Symbols icon name. */
  icon: string;
  /** Tooltip label revealed on hover; also the accessible name. */
  label: string;
}

/** Floating action button fixed to the bottom-right corner. */
export function Fab({ icon, label, className, ...props }: FabProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "fixed bottom-8 right-8 w-14 h-14 bg-secondary-container text-white rounded-full shadow-2xl",
        "flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      <Icon name={icon} size={26} />
      <span className="absolute right-[4.5rem] bg-primary text-white px-4 py-2 rounded text-body-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </button>
  );
}
