import { cn } from "../../lib/cn";
import { Avatar, Button, Icon } from "../ui";

export interface SidebarNavItem {
  /** Stable identifier, also used to mark the active item. */
  id: string;
  label: string;
  /** Material Symbols icon name. */
  icon: string;
  href?: string;
}

export interface SidebarUser {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface SidebarProps {
  /** Product name shown in the header. */
  brand: string;
  /** Secondary line under the brand, e.g. the plan name. */
  brandSubtitle?: string;
  items: SidebarNavItem[];
  activeItemId?: string;
  user?: SidebarUser;
  /** Optional CTA rendered above the user block. */
  cta?: { label: string; onClick?: () => void };
  onNavigate?: (item: SidebarNavItem) => void;
  className?: string;
}

/** Fixed left navigation rail with brand, nav items, CTA and user profile. */
export function Sidebar({
  brand,
  brandSubtitle,
  items,
  activeItemId,
  user,
  cta,
  onNavigate,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "h-full w-60 fixed left-0 top-0 flex flex-col py-stack-md px-stack-md bg-primary-container text-white z-50",
        className,
      )}
    >
      <div className="mb-stack-lg px-2">
        <h1 className="text-headline-md font-bold text-white">{brand}</h1>
        {brandSubtitle && <p className="text-body-sm text-on-primary-container">{brandSubtitle}</p>}
      </div>

      <nav className="flex-1 space-y-2" aria-label="Main navigation">
        {items.map((item) => {
          const active = item.id === activeItemId;
          return (
            <a
              key={item.id}
              href={item.href ?? "#"}
              aria-current={active ? "page" : undefined}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(item);
                }
              }}
              className={cn(
                "flex items-center gap-stack-sm px-3 py-2.5 rounded-lg text-body-md",
                active
                  ? "text-white font-bold bg-white/15"
                  : "text-on-primary-container hover:bg-white/10 hover:text-white transition-colors duration-200 ease-in-out",
              )}
            >
              <Icon name={item.icon} filled={active} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="mt-auto p-2">
        {cta && (
          <Button fullWidth size="lg" className="shadow-lg" onClick={cta.onClick}>
            {cta.label}
          </Button>
        )}
        {user && (
          <div className="mt-stack-md flex items-center gap-stack-sm pt-stack-md border-t border-white/10">
            <Avatar src={user.avatarUrl} alt={user.name} />
            <div>
              <p className="font-bold text-body-sm text-white">{user.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-on-primary-container">
                {user.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
