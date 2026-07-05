import { Avatar, Icon, IconButton, Menu, MenuDivider, MenuItem } from "../ui";
import { usePersistentState } from "../../lib/usePersistentState";
import type { SidebarUser } from "./Sidebar";

export interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  time: string;
}

export interface HeaderUtilitiesProps {
  user: SidebarUser & { email?: string };
  notifications?: NotificationItem[];
  /** Navigate by page id ("settings", "signin", …). */
  onNavigate?: (pageId: string) => void;
}

/** Standard top-bar utility cluster: notifications popover + profile menu. */
export function HeaderUtilities({ user, notifications = [], onNavigate }: HeaderUtilitiesProps) {
  const [dismissedIds, setDismissedIds] = usePersistentState<string[]>(
    "resumeai:dismissedNotificationIds",
    [],
  );
  const visible = notifications.filter((item) => !dismissedIds.includes(item.id));
  const dismiss = (id: string) => setDismissedIds((prev) => [...prev, id]);

  return (
    <>
      <Menu
        label="Notifications"
        widthClassName="w-80"
        trigger={
          <span className="relative flex p-1 text-text-main">
            <Icon name="notifications" />
            {visible.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-secondary rounded-full border-2 border-surface-white" />
            )}
          </span>
        }
      >
        <p className="px-4 py-2 text-label-md font-bold text-text-main uppercase">Notifications</p>
        <MenuDivider />
        {visible.length === 0 && (
          <p className="px-4 py-6 text-body-sm text-text-muted text-center">You're all caught up.</p>
        )}
        {visible.map((item) => (
          <MenuItem key={item.id} icon={item.icon} className="items-start">
            <span className="flex-1 min-w-0">
              <span className="block truncate">{item.title}</span>
              <span className="block text-label-sm text-text-muted">{item.time}</span>
            </span>
            <IconButton
              icon="close"
              label={`Dismiss: ${item.title}`}
              className="p-1 -mr-1 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                dismiss(item.id);
              }}
            />
          </MenuItem>
        ))}
      </Menu>

      <Menu
        label="Account"
        trigger={<Avatar src={user.avatarUrl} alt={user.name} size="sm" className="border-outline-variant" />}
      >
        <div className="px-4 py-3">
          <p className="font-bold text-body-sm text-text-main">{user.name}</p>
          {user.email && <p className="text-label-sm text-text-muted">{user.email}</p>}
        </div>
        <MenuDivider />
        <MenuItem icon="person" onClick={() => onNavigate?.("settings")}>
          Profile Settings
        </MenuItem>
        <MenuItem icon="description" onClick={() => onNavigate?.("resumes")}>
          My Resumes
        </MenuItem>
        <MenuItem icon="workspace_premium" onClick={() => onNavigate?.("settings")}>
          Manage Plan
        </MenuItem>
        <MenuDivider />
        <MenuItem icon="logout" destructive onClick={() => onNavigate?.("signin")}>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}
