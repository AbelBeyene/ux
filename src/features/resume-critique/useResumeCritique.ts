import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { friendlyErrorMessage } from "../../services/apiError";
import { requestResumeCritique } from "./api";
import type { ResumeCritiqueResult } from "./types";

export type ResumeCritiqueStatus = "idle" | "loading" | "success" | "error";

export interface UseResumeCritique {
  status: ResumeCritiqueStatus;
  data: ResumeCritiqueResult | null;
  error: string | null;
  /** Trigger a critique run for the given resume text. */
  run: (resumeText: string) => void;
  /** Force a fresh AI call for the current resume text, bypassing the cache (e.g. a "Re-scan" action). */
  rescan: () => void;
  reset: () => void;
}

const QUERY_KEY = "resume-critique";

/**
 * Drives the resume-critique backend call through TanStack Query, keyed on
 * the submitted resume text. This gets us two things a hand-rolled fetch
 * hook has to reimplement: re-submitting the same text is served from cache
 * instead of re-billing the AI provider, and submitting new text while a
 * previous run is in flight aborts the stale request automatically (Query
 * passes an AbortSignal into the query function on key change/unmount).
 */
export function useResumeCritique(): UseResumeCritique {
  const [resumeText, setResumeText] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY, resumeText] as const,
    queryFn: ({ signal }) => requestResumeCritique({ resumeText: resumeText! }, { signal }),
    enabled: resumeText !== null,
  });

  const run = useCallback((text: string) => setResumeText(text), []);

  const { refetch } = query;
  const rescan = useCallback(() => {
    if (resumeText !== null) void refetch();
  }, [resumeText, refetch]);

  const reset = useCallback(() => {
    setResumeText(null);
    queryClient.removeQueries({ queryKey: [QUERY_KEY] });
  }, [queryClient]);

  const status: ResumeCritiqueStatus =
    resumeText === null ? "idle" : query.isError ? "error" : query.isSuccess ? "success" : "loading";

  return {
    status,
    data: query.data ?? null,
    error: query.error ? friendlyErrorMessage(query.error) : null,
    run,
    rescan,
    reset,
  };
}
