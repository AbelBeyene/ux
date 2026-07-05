import type { ActivityEvent, CountryStat, KpiMetric, TrackedLink } from "../types/analytics";

export const resumeMeta = {
  title: "Senior_Product_Designer_2024.pdf",
  shareUrl: "https://resumeai.app/r/alex-rivera-8f2c",
};

export const kpiMetrics: KpiMetric[] = [
  { id: "views", label: "Total Views", value: 1284, icon: "visibility", trend: "+12% this week", trendDirection: "up" },
  { id: "downloads", label: "PDF Downloads", value: 342, icon: "download", trend: "+8% this week", trendDirection: "up" },
  { id: "clicks", label: "Link Clicks", value: 210, icon: "ads_click", trend: "-3% this week", trendDirection: "down" },
  { id: "visitors", label: "Unique Visitors", value: 876, icon: "group", trend: "+15% this week", trendDirection: "up" },
];

export const activityEvents: ActivityEvent[] = [
  { id: "a1", type: "download", timeAgo: "2h ago", device: "desktop", country: "Germany" },
  { id: "a2", type: "view", timeAgo: "3h ago", device: "mobile", country: "United States" },
  { id: "a3", type: "link_click", timeAgo: "5h ago", device: "desktop", country: "United States", detail: "Portfolio" },
  { id: "a4", type: "view", timeAgo: "7h ago", device: "desktop", country: "Netherlands" },
  { id: "a5", type: "view", timeAgo: "9h ago", device: "mobile", country: "United Kingdom" },
  { id: "a6", type: "download", timeAgo: "Yesterday", device: "desktop", country: "United States" },
  { id: "a7", type: "link_click", timeAgo: "Yesterday", device: "mobile", country: "Canada", detail: "LinkedIn" },
  { id: "a8", type: "view", timeAgo: "Yesterday", device: "desktop", country: "Germany" },
  { id: "a9", type: "view", timeAgo: "2d ago", device: "desktop", country: "India" },
  { id: "a10", type: "download", timeAgo: "2d ago", device: "mobile", country: "United Kingdom" },
  { id: "a11", type: "link_click", timeAgo: "3d ago", device: "desktop", country: "United States", detail: "GitHub" },
  { id: "a12", type: "view", timeAgo: "3d ago", device: "desktop", country: "France" },
];

export const trackedLinks: TrackedLink[] = [
  { id: "l1", name: "LinkedIn", icon: "work", clicks: 96, lastClicked: "Yesterday" },
  { id: "l2", name: "Portfolio", icon: "language", clicks: 74, lastClicked: "5h ago" },
  { id: "l3", name: "GitHub", icon: "code", clicks: 40, lastClicked: "3d ago" },
];

export const countryStats: CountryStat[] = [
  { country: "United States", count: 412 },
  { country: "Germany", count: 188 },
  { country: "United Kingdom", count: 141 },
  { country: "Netherlands", count: 96 },
  { country: "Canada", count: 74 },
  { country: "India", count: 52 },
];
