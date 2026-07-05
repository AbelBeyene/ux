import { forwardRef, useId } from "react";
import { cn } from "../../lib/cn";

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  helper?: string;
}

/** Labeled native select styled to match TextField. */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, options, helper, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="block text-label-md font-bold text-text-main mb-1.5">
        {label}
      </label>
      <select
        ref={ref}
        id={fieldId}
        className={cn(
          "w-full bg-surface-white border border-outline-variant rounded-lg px-3 py-2 text-body-md text-text-main",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-secondary/30 transition-shadow",
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helper && <p className="mt-1.5 text-label-sm text-text-muted">{helper}</p>}
    </div>
  );
});
