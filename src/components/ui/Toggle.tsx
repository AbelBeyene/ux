import { cn } from "../../lib/cn";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible label — required, since the switch has no visible text. */
  label: string;
  disabled?: boolean;
  className?: string;
}

/** Small on/off switch (M3-style), e.g. for previewing a suggested change. */
export function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  return (
    <label className={cn("relative inline-flex items-center cursor-pointer", disabled && "opacity-50 pointer-events-none", className)}>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
      />
      <div
        className={cn(
          "w-9 h-5 bg-surface-container-highest rounded-full transition-colors peer-checked:bg-secondary",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-secondary/40 peer-focus-visible:ring-offset-2",
          "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-outline-variant",
          "after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white",
        )}
      />
    </label>
  );
}
