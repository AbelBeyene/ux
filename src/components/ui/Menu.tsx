import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

export interface MenuProps {
  /** Element that toggles the menu; rendered inside the trigger button. */
  trigger: React.ReactNode;
  /** Accessible label for the trigger button. */
  label: string;
  children: React.ReactNode;
  /** Horizontal alignment of the popover relative to the trigger. */
  align?: "left" | "right";
  /** Popover width utility class. */
  widthClassName?: string;
  className?: string;
}

/** Dropdown menu with outside-click and Escape dismissal. */
export function Menu({
  trigger,
  label,
  children,
  align = "right",
  widthClassName = "w-64",
  className,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="p-1 rounded-full hover:bg-surface-container-low transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline/40"
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full mt-2 bg-surface-white border border-outline-variant rounded-lg shadow-lg py-1 z-50",
            align === "right" ? "right-0" : "left-0",
            widthClassName,
          )}
          // Close after any item click so consumers don't have to
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  /** Red styling for destructive actions like sign out / delete. */
  destructive?: boolean;
}

/** Single row inside a Menu. */
export function MenuItem({ icon, destructive, className, children, ...props }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-left text-body-sm transition-colors",
        destructive
          ? "text-error hover:bg-error-container/40"
          : "text-text-main hover:bg-surface-container-low",
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={18} className={destructive ? "text-error" : "text-text-muted"} />}
      {children}
    </button>
  );
}

/** Thin divider between menu groups. */
export function MenuDivider() {
  return <div className="my-1 border-t border-outline-variant" role="separator" />;
}
