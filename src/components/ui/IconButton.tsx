import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Material Symbols icon name. */
  icon: string;
  /** Accessible label — required, since the button has no visible text. */
  label: string;
  filled?: boolean;
}

/** Circular icon-only button used in toolbars and headers. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, filled, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        "p-2 text-text-main hover:bg-surface-container-low rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline/40",
        className,
      )}
      {...props}
    >
      <Icon name={icon} filled={filled} />
    </button>
  );
});
