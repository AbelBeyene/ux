import { apiClient } from "../../services/apiClient";
import type { AtsAnalysisResult } from "./types";

export interface RequestAtsAnalysisInput {
  resumeText: string;
  /** Role the keywords and career path are scored against, e.g. "Senior Product Designer". */
  targetRole: string;
}

/** Calls our backend, which proxies the AI provider — the resume text never touches a third party directly from the browser. */
export function requestAtsAnalysis(
  input: RequestAtsAnalysisInput,
  options?: { signal?: AbortSignal },
): Promise<AtsAnalysisResult> {
  return apiClient.post<AtsAnalysisResult>("/analyze", input, { signal: options?.signal });
}
