import { cn } from "../../lib/cn";
import type { ResumeProfile } from "../../types/resume";

export interface ResumePaperProps {
  profile: ResumeProfile;
  children: React.ReactNode;
  className?: string;
}

/**
 * The resume as a typeset sheet: warm paper stock, serif document type and a
 * contact shadow, deliberately distinct from the cool app chrome around it.
 */
export function ResumePaper({ profile, children, className }: ResumePaperProps) {
  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-paper p-10 rounded border border-paper-line shadow-paper relative",
        className,
      )}
    >
      <div className="space-y-stack-lg text-text-main">
        <header className="border-b border-primary pb-stack-md">
          <h3 className="font-display text-display-md text-primary">{profile.name}</h3>
          <p className="text-body-md text-text-muted mt-2">
            {profile.title} • {profile.location} • {profile.email}
          </p>
        </header>
        {children}
      </div>
    </div>
  );
}
