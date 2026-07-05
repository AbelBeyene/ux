import { useQuery } from "@tanstack/react-query";
import { friendlyErrorMessage } from "../../services/apiError";
import { requestAtsAnalysis } from "./api";
import type { AtsAnalysisResult } from "./types";

export interface UseAtsAnalysisInput {
  resumeText: string;
  targetRole: string;
}

export interface UseAtsAnalysis {
  /** Null until the analysis succeeds — callers fall back to static demo data. */
  data: AtsAnalysisResult | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/** Runs the composite ATS analysis (gauge, keywords, formatting, relevance, career path) on load. */
export function useAtsAnalysis({ resumeText, targetRole }: UseAtsAnalysisInput): UseAtsAnalysis {
  const result = useQuery({
    queryKey: ["ats-analysis", resumeText, targetRole] as const,
    queryFn: ({ signal }) => requestAtsAnalysis({ resumeText, targetRole }, { signal }),
  });

  return {
    data: result.data ?? null,
    loading: result.isLoading,
    error: result.isError ? friendlyErrorMessage(result.error) : null,
    refresh: () => void result.refetch(),
  };
}
