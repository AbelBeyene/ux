import { cn } from "../../lib/cn";
import type { ResumeProfile } from "../../types/resume";

export interface ResumePaperProps {
  profile: ResumeProfile;
  children: React.ReactNode;
  className?: string;
}

/** White "sheet of paper" container with the resume masthead. */
export function ResumePaper({ profile, children, className }: ResumePaperProps) {
  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-surface-white p-8 rounded-lg border border-outline-variant relative",
        className,
      )}
    >
      <div className="space-y-stack-lg text-text-main">
        <header className="border-b-2 border-primary pb-stack-md">
          <h3 className="text-headline-lg text-primary">{profile.name}</h3>
          <p className="text-body-md text-text-muted mt-2">
            {profile.title} • {profile.location} • {profile.email}
          </p>
        </header>
        {children}
      </div>
    </div>
  );
}
