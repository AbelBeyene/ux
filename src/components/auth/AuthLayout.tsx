import { Icon } from "../ui";

export interface AuthLayoutProps {
  /** Form card heading. */
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Row under the card, e.g. "Don't have an account? Sign up". */
  footer?: React.ReactNode;
}

/** Split auth screen: dark brand panel on the left, centered form card on the right. */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Brand panel */}
      <aside className="hidden lg:flex w-[42%] shrink-0 h-full overflow-y-auto custom-scrollbar bg-primary-container text-white flex-col justify-between p-margin-desktop">
        <div>
          <h1 className="text-headline-md font-bold">ResumeAI</h1>
          <p className="text-label-sm text-on-primary-container uppercase tracking-wider">
            AI Career Platform
          </p>
        </div>
        <div>
          <Icon name="format_quote" size={36} className="text-secondary mb-3" />
          <p className="text-headline-md leading-relaxed mb-4">
            My resume went from ignored to a 94% match on the roles I actually
            wanted. The AI critique felt like a mentor, not a spell-checker.
          </p>
          <p className="font-bold text-body-sm">Maya Chen</p>
          <p className="text-body-sm text-on-primary-container">
            Design Lead, hired via ResumeAI
          </p>
        </div>
        <p className="text-label-sm text-on-primary-container">
          © 2026 ResumeAI • Trusted by 120k+ professionals
        </p>
      </aside>

      {/* Form area */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar flex flex-col items-center justify-center p-margin-mobile">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-stack-lg text-center">
            <h1 className="text-headline-md font-bold text-primary">
              ResumeAI
            </h1>
          </div>
          <div className="bg-surface-white border border-outline-variant rounded-xl shadow-sm p-8">
            <h2 className="text-headline-lg text-primary mb-1">{title}</h2>
            {subtitle && (
              <p className="text-body-sm text-text-muted mb-6">{subtitle}</p>
            )}
            {children}
          </div>
          {footer && (
            <div className="mt-stack-md text-center text-body-sm text-text-muted">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/** "or" separator between primary and social auth actions. */
export function AuthDivider({
  label = "or continue with",
}: {
  label?: string;
}) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 border-t border-outline-variant" />
      <span className="text-label-sm text-text-muted">{label}</span>
      <div className="flex-1 border-t border-outline-variant" />
    </div>
  );
}
