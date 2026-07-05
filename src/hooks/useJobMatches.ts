import { useCallback, useEffect, useRef, useState } from "react";
import type { JobListing } from "../types/dashboard";
import { jobListings } from "../data/jobs";

/**
 * Fetches job listings matched to the current resume.
 * Currently simulates the portal API with a short delay; swap the body of
 * `fetchJobs` for a real API call without touching consumers.
 */
export function useJobMatches() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchJobs = useCallback(() => {
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setJobs(jobListings);
      setLoading(false);
    }, 900);
  }, []);

  useEffect(() => {
    fetchJobs();
    return () => clearTimeout(timer.current);
  }, [fetchJobs]);

  return { jobs, loading, refresh: fetchJobs };
}
