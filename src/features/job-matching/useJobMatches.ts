import { useQuery } from "@tanstack/react-query";
import { friendlyErrorMessage } from "../../services/apiError";
import { requestMatchingJobs } from "./api";
import { presentJobs } from "./present";
import type { JobSearchQuery } from "./types";
import type { JobListing } from "../../types/dashboard";

export interface UseJobMatchesInput {
  query: JobSearchQuery;
  /** Resume skills to score listings against — see src/lib/jobMatch.ts. */
  skills: string[];
}

export interface UseJobMatches {
  jobs: JobListing[];
  loading: boolean;
  /** Set when matching isn't configured or the search failed — panel can still render an empty state. */
  error: string | null;
  refresh: () => void;
}

/** Fetches job listings matched to a resume's skills, scored and sorted client-side (see src/features/job-matching/present.ts). */
export function useJobMatches({ query, skills }: UseJobMatchesInput): UseJobMatches {
  const result = useQuery({
    queryKey: ["job-matches", query] as const,
    queryFn: ({ signal }) => requestMatchingJobs(query, { signal }),
  });

  return {
    jobs: result.data ? presentJobs(result.data, skills) : [],
    loading: result.isLoading,
    error: result.isError ? friendlyErrorMessage(result.error) : null,
    refresh: () => void result.refetch(),
  };
}
