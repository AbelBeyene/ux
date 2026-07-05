import { cn } from "../../lib/cn";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols icon name, e.g. "dashboard". */
  name: string;
  /** Render the filled variant of the symbol. */
  filled?: boolean;
  /** Icon size in pixels. Defaults to the font's natural 24px. */
  size?: number;
}

/** Wrapper around Material Symbols Outlined with fill and size control. */
export function Icon({ name, filled = false, size, className, style, ...props }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined", filled && "icon-filled", className)}
      style={size ? { fontSize: size, ...style } : style}
      {...props}
    >
      {name}
    </span>
  );
}
