import { Card, Icon } from "../ui";
import type { ActivityEvent, ActivityType } from "../../types/analytics";

export interface ActivityFeedProps {
  title?: string;
  events: ActivityEvent[];
  /** Max feed height before it scrolls. */
  maxHeightClassName?: string;
  className?: string;
}

const typeStyles: Record<
  ActivityType,
  { icon: string; label: string; tint: string }
> = {
  view: {
    icon: "visibility",
    label: "View",
    tint: "bg-primary/10 text-primary",
  },
  download: {
    icon: "download",
    label: "Download",
    tint: "bg-secondary/10 text-secondary",
  },
  link_click: {
    icon: "ads_click",
    label: "Link Click",
    tint: "bg-green-100 text-green-700",
  },
};

/** Scrollable feed of recent resume interactions. */
export function ActivityFeed({
  title = "Activity Timeline",
  events,
  maxHeightClassName = "max-h-[26rem]",
  className,
}: ActivityFeedProps) {
  return (
    <Card padding="none" className={className}>
      <h3 className="text-label-md text-primary uppercase px-5 pt-5 pb-3">
        {title}
      </h3>
      <ul
        className={`overflow-y-auto custom-scrollbar px-2 pb-2 ${maxHeightClassName}`}
      >
        {events.map((event) => {
          const style = typeStyles[event.type];
          return (
            <li key={event.id} className="py-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-container-low transition-colors">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${style.tint} bg-gradient-to-br from-white/40`}
                >
                  <Icon name={style.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-bold text-text-main truncate">
                    {style.label}
                    {event.detail && (
                      <span className="font-normal text-text-muted">
                        {" "}
                        — {event.detail}
                      </span>
                    )}
                  </p>
                  <p className="text-label-sm text-text-muted">
                    {event.timeAgo}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-text-muted shrink-0">
                  <span className="flex items-center gap-1 text-label-sm">
                    <Icon
                      name={
                        event.device === "mobile" ? "smartphone" : "computer"
                      }
                      size={16}
                    />
                    <span className="hidden sm:inline capitalize">
                      {event.device}
                    </span>
                  </span>
                  {event.country && (
                    <span className="hidden md:flex items-center gap-1 text-label-sm">
                      <Icon name="public" size={16} />
                      {event.country}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
