import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

/** Rounded search field with a leading search icon. */
export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Icon
        name="search"
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
      />
      <input
        type="search"
        className="bg-surface-container-low border border-outline-variant rounded-full py-1.5 pl-10 pr-4 text-body-sm w-64 focus:border-primary focus:outline-none focus:ring-2 focus:ring-secondary-container/20 transition-all placeholder:text-text-muted"
        {...props}
      />
    </div>
  );
}
