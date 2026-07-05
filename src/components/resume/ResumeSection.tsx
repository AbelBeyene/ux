import { cn } from "../../lib/cn";

export interface ResumeSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/** Titled section of the resume (Summary, Experience, Skills…). */
export function ResumeSection({ title, children, className }: ResumeSectionProps) {
  return (
    <section className={cn("space-y-stack-md", className)}>
      <h4 className="text-label-md text-secondary uppercase tracking-widest flex items-center gap-stack-sm after:h-px after:flex-1 after:bg-paper-line">
        {title}
      </h4>
      {children}
    </section>
  );
}
