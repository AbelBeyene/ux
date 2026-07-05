import { cn } from "../../lib/cn";

export interface DocContact {
  /** Contact fragments joined with a bullet separator. */
  items: string[];
}

export interface ResumeDocumentProps {
  /** Candidate name, rendered uppercase in the masthead. */
  name: string;
  contact: DocContact;
  /** Floating overlay, e.g. <ScorePill /> in the top-right corner. */
  overlay?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Formal ATS-style resume sheet with a centered masthead. */
export function ResumeDocument({ name, contact, overlay, children, className }: ResumeDocumentProps) {
  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-surface-white shadow-[0_4px_20px_rgba(18,46,69,0.08)] min-h-[1000px] p-10 relative flex flex-col gap-stack-lg border border-outline-variant rounded-lg h-fit",
        className,
      )}
    >
      <header className="text-center">
        <h1 className="text-headline-lg text-text-main tracking-tight uppercase">{name}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-label-sm text-text-muted mt-2">
          {contact.items.map((item, i) => (
            <span key={item} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden="true">•</span>}
              {item}
            </span>
          ))}
        </div>
      </header>
      {children}
      {overlay && <div className="absolute top-10 right-10">{overlay}</div>}
    </div>
  );
}

export interface DocSectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/** Formal resume section with an uppercase, underlined title. */
export function DocSection({ id, title, children, className }: DocSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-4", className)}>
      <h2 className="text-label-md font-bold text-text-main border-b border-outline-variant pb-1 mb-3 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export interface DocExperienceProps {
  role: string;
  company: string;
  location?: string;
  period: string;
  bullets: React.ReactNode[];
  className?: string;
}

/** Role entry in the formal resume's experience section. */
export function DocExperience({ role, company, location, period, bullets, className }: DocExperienceProps) {
  return (
    <div className={className}>
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="text-headline-md text-text-main">{role}</h3>
        <span className="text-label-sm text-text-muted italic">{period}</span>
      </div>
      <p className="text-label-md font-bold text-secondary mb-2">
        {company}
        {location && ` • ${location}`}
      </p>
      <ul className="list-disc pl-5 text-body-md text-text-main space-y-2">
        {bullets.map((bullet, i) => (
          <li key={i}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}
