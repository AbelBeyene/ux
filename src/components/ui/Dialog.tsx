import { useEffect } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "./IconButton";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Muted line under the title. */
  subtitle?: string;
  children: React.ReactNode;
  /** Action row rendered at the bottom, right-aligned. */
  footer?: React.ReactNode;
  /** Panel width utility class. */
  widthClassName?: string;
}

/** Modal dialog with overlay, Escape and outside-click dismissal. */
export function Dialog({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  widthClassName = "max-w-lg",
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-margin-mobile bg-primary/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn("w-full bg-surface-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]", widthClassName)}
      >
        <div className="flex items-start justify-between gap-4 p-6 pb-0">
          <div>
            <h2 className="text-headline-md text-primary">{title}</h2>
            {subtitle && <p className="text-body-sm text-text-muted mt-1">{subtitle}</p>}
          </div>
          <IconButton icon="close" label="Close dialog" onClick={onClose} className="-mt-1 -mr-1" />
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-outline-variant bg-surface-container-low rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
