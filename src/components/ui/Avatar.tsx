import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt: string;
  /** Diameter preset. */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
} as const;

/** Circular user avatar with an icon fallback when no image is provided. */
export function Avatar({ src, alt, size = "md", className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20 shrink-0",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <img className="w-full h-full object-cover" src={src} alt={alt} />
      ) : (
        <Icon name="person" aria-label={alt} />
      )}
    </div>
  );
}
