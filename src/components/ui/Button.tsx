import { forwardRef } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "outline" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to fill the parent width. */
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-secondary text-on-secondary shadow-sm hover:bg-accent-hover focus-visible:ring-secondary/40",
  outline:
    "border-2 border-primary text-primary hover:bg-primary hover:text-white focus-visible:ring-primary/40",
  ghost:
    "text-text-muted hover:bg-surface-container-low focus-visible:ring-outline/40",
  text: "text-text-main hover:text-secondary focus-visible:ring-secondary/40",
};

// Heights follow M3 button metrics (~32/36/40px with the 12px label).
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2",
  md: "px-5 py-2.5",
  lg: "px-5 py-3",
};

/** Action button. `primary` is the filled accent CTA; `ghost` and `text` are quiet variants. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", fullWidth = false, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "rounded-lg font-bold text-label-md transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
});
