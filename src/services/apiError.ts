/** Normalized error shape for any failed call through `apiClient`. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code = "unknown_error") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  /** True for errors worth retrying (timeouts, 429s, 5xx). */
  get retryable(): boolean {
    return this.status === 408 || this.status === 429 || this.status >= 500;
  }
}

/**
 * Messages for specific backend codes (see api/_lib/aiErrorMapping.ts) — these
 * carry more information than the HTTP status alone (e.g. "the AI is rate
 * limited" vs "the AI returned garbage" are both a 5xx/502, but mean
 * different things to a user deciding whether to retry).
 */
const CODE_MESSAGES: Record<string, string> = {
  provider_rate_limited: "The AI service is busy right now. Please try again in a moment.",
  provider_timeout: "The AI service took too long to respond. Please try again.",
  invalid_ai_response: "The AI returned an unexpected response. Please try again.",
  network_error: "Couldn't reach the server. Please check your connection and try again.",
  jobs_not_configured: "Job matching isn't set up for this deployment yet.",
  jobs_provider_error: "The job search service is temporarily unavailable. Please try again.",
};

/** User-facing copy for a failed API call — specific by error code, falling back to a status-based bucket. */
export function friendlyErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (CODE_MESSAGES[error.code]) return CODE_MESSAGES[error.code];
    if (error.status === 429) return "We're getting rate-limited right now. Please wait a moment and try again.";
    if (error.status === 408) return "The request timed out. Please check your connection and try again.";
    if (error.status >= 500) return "The service is temporarily unavailable. Please try again shortly.";
    return error.message;
  }
  if (error instanceof Error && error.name === "AbortError") {
    return "The request timed out. Please check your connection and try again.";
  }
  return "Something went wrong. Please try again.";
}
