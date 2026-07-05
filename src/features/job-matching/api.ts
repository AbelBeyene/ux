import { apiClient } from "../../services/apiClient";
import type { JobSearchQuery, RawJobListing } from "./types";

function toQueryString(query: JobSearchQuery): string {
  const params = new URLSearchParams({
    role: query.role,
    location: query.location,
    country: query.country,
    datePosted: query.datePosted,
    employmentType: query.employmentType,
    remoteOnly: String(query.remoteOnly),
  });
  if (query.keyword) params.set("keyword", query.keyword);
  return params.toString();
}

export function requestMatchingJobs(
  query: JobSearchQuery,
  options?: { signal?: AbortSignal },
): Promise<RawJobListing[]> {
  return apiClient
    .get<{ jobs: RawJobListing[] }>(`/jobs?${toQueryString(query)}`, options)
    .then((res) => res.jobs);
}
