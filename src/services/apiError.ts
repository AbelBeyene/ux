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

/** User-facing copy for common failure classes — mirrors the friendly-error mapping pattern used server-side. */
export function friendlyErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
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
