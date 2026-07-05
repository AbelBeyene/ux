import { cn } from "../../lib/cn";

export interface AppShellProps {
  /** Fixed sidebar element (typically <Sidebar />). */
  sidebar: React.ReactNode;
  /** Sticky header element (typically <TopBar />). */
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Page chrome: fixed sidebar + header + scrollable content area. */
export function AppShell({
  sidebar,
  header,
  children,
  className,
}: AppShellProps) {
  return (
    <>
      {sidebar}
      <main className={cn("ml-60 h-screen flex flex-col", className)}>
        {header}
        <div className="flex flex-1 overflow-hidden items-stretch min-h-0">
          {children}
        </div>
      </main>
    </>
  );
}
