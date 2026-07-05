import { serverEnv } from "./env";
import { HttpError } from "./http";

const JSEARCH_HOST = "jsearch.p.rapidapi.com";
const JSEARCH_URL = "https://jsearch.p.rapidapi.com/search";
const REQUEST_TIMEOUT_MS = 20_000;

export interface JobSearchParams {
  /** Free-text query, e.g. "senior product designer jobs in San Francisco". Callers build this — no guessing here. */
  query: string;
  country: string;
  datePosted: "all" | "today" | "3days" | "week" | "month";
  remoteOnly: boolean;
  employmentType: "all" | "FULLTIME" | "PARTTIME" | "CONTRACTOR" | "INTERN";
}

export interface RawJobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  applyLink: string;
  postedAgo: string;
  isRemote: boolean;
  employmentType: string;
  /** Raw description text, used client-side for keyword-overlap scoring — not by this transport layer. */
  description: string;
}

interface JSearchApiJob {
  job_id?: string;
  job_title?: string;
  employer_name?: string;
  job_location?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_apply_link?: string;
  job_google_link?: string;
  job_posted_human_readable?: string;
  job_is_remote?: boolean;
  job_employment_type_text?: string;
  job_description?: string;
}

interface JSearchApiResponse {
  status: string;
  data?: JSearchApiJob[];
}

function normalize(job: JSearchApiJob, index: number): RawJobListing {
  return {
    id: job.job_id || `job-${index}`,
    title: job.job_title || "Untitled role",
    company: job.employer_name || "Unknown company",
    location:
      job.job_location ||
      [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ") ||
      "Location not specified",
    applyLink: job.job_apply_link || job.job_google_link || "",
    postedAgo: job.job_posted_human_readable || "Recently",
    isRemote: Boolean(job.job_is_remote),
    employmentType: job.job_employment_type_text || "N/A",
    description: job.job_description || "",
  };
}

/** Calls the JSearch job-listings API server-side — the RapidAPI key never reaches the browser. */
export async function searchJobs(params: JobSearchParams): Promise<RawJobListing[]> {
  const apiKey = serverEnv.rapidApiKey;
  if (!apiKey) {
    throw new HttpError(501, "Job matching isn't configured for this deployment.", "jobs_not_configured");
  }

  const query = new URLSearchParams({
    query: params.query,
    page: "1",
    num_pages: "1",
    country: params.country,
    date_posted: params.datePosted,
  });
  if (params.remoteOnly) query.append("work_from_home", "true");
  if (params.employmentType !== "all") query.append("employment_types", params.employmentType);

  let response: Response;
  try {
    response = await fetch(`${JSEARCH_URL}?${query.toString()}`, {
      method: "GET",
      headers: { "x-rapidapi-host": JSEARCH_HOST, "x-rapidapi-key": apiKey },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new HttpError(502, "Couldn't reach the job search service. Please try again.", "network_error");
  }

  if (!response.ok) {
    console.error("JSearch API error:", response.status, await response.text().catch(() => ""));
    throw new HttpError(502, "The job search service is temporarily unavailable. Please try again.", "jobs_provider_error");
  }

  const payload = (await response.json()) as JSearchApiResponse;
  return (payload.data ?? []).slice(0, 10).map(normalize);
}
