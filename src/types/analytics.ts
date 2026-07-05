/** Domain model for per-resume engagement analytics. */

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  icon: string;
  /** Trend text, e.g. "+12% this week". */
  trend?: string;
  /** Direction drives the trend color. */
  trendDirection?: "up" | "down";
}

export type ActivityType = "view" | "download" | "link_click";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  /** Relative time, e.g. "2h ago". */
  timeAgo: string;
  device: "desktop" | "mobile";
  country?: string;
  /** Extra context, e.g. which link was clicked. */
  detail?: string;
}

export interface TrackedLink {
  id: string;
  name: string;
  icon: string;
  clicks: number;
  lastClicked: string;
}

export interface CountryStat {
  country: string;
  count: number;
}
