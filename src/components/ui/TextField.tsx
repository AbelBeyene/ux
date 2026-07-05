import { forwardRef, useId } from "react";
import { cn } from "../../lib/cn";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Helper text under the field; replaced by `error` when set. */
  helper?: string;
  error?: string;
}

/** Labeled text input with helper/error text. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, helper, error, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="block text-label-md font-bold text-text-main mb-1.5">
        {label}
      </label>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={cn(
          "w-full bg-surface-white border rounded-lg px-3 py-2 text-body-md text-text-main placeholder:text-text-muted",
          "focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-shadow",
          error ? "border-error focus:border-error" : "border-outline-variant focus:border-primary",
        )}
        {...props}
      />
      {(error || helper) && (
        <p className={cn("mt-1.5 text-label-sm", error ? "text-error" : "text-text-muted")}>
          {error ?? helper}
        </p>
      )}
    </div>
  );
});
