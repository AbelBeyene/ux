import { apiClient } from "../../services/apiClient";
import type { ResumeCritiqueResult } from "./types";

export interface RequestCritiqueInput {
  resumeText: string;
}

/** Calls our backend, which proxies the AI provider — the resume text never touches a third party directly from the browser. */
export function requestResumeCritique(
  input: RequestCritiqueInput,
  options?: { signal?: AbortSignal },
): Promise<ResumeCritiqueResult> {
  return apiClient.post<ResumeCritiqueResult>("/critique", input, { signal: options?.signal });
}
