export interface RawJobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  applyLink: string;
  postedAgo: string;
  isRemote: boolean;
  employmentType: string;
  description: string;
}

export type DatePosted = "all" | "today" | "3days" | "week" | "month";
export type EmploymentType = "all" | "FULLTIME" | "PARTTIME" | "CONTRACTOR" | "INTERN";

export interface JobSearchQuery {
  role: string;
  location: string;
  keyword?: string;
  country: string;
  datePosted: DatePosted;
  employmentType: EmploymentType;
  remoteOnly: boolean;
}
