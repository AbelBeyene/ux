/**
 * Translates an AI provider's HTTP failure into what OUR backend should
 * return: a stable `code` (for logs/tests), an end-user-safe `message`, and
 * the `httpStatus` we respond with to our own client.
 *
 * Pure and provider-agnostic on purpose — it only looks at a status code, so
 * it's usable from any feature's server function and unit-testable without
 * touching the network. The one exception is 429: we pass it through as-is
 * because "come back later" is meaningful and actionable for our client;
 * everything else collapses to 502 (Bad Gateway — upstream failed), since
 * exposing e.g. "401 invalid API key" to an end user would incorrectly imply
 * it's *their* credentials at fault when it's ours to fix server-side.
 */
export interface ProviderErrorInfo {
  code: string;
  message: string;
  httpStatus: number;
}

export function mapProviderErrorStatus(providerStatus: number): ProviderErrorInfo {
  if (providerStatus === 429) {
    return {
      code: "provider_rate_limited",
      message: "The AI service is busy right now. Please try again in a moment.",
      httpStatus: 429,
    };
  }
  if (providerStatus === 401 || providerStatus === 403) {
    return {
      code: "provider_auth_error",
      message: "The AI service is temporarily unavailable. Please try again later.",
      httpStatus: 502,
    };
  }
  if (providerStatus === 400) {
    return {
      code: "provider_bad_request",
      message: "The AI service couldn't process this request. Please try again.",
      httpStatus: 502,
    };
  }
  if (providerStatus === 404) {
    return {
      code: "provider_model_unavailable",
      message: "The AI service is temporarily unavailable. Please try again later.",
      httpStatus: 502,
    };
  }
  if (providerStatus >= 500) {
    return {
      code: "provider_upstream_error",
      message: "The AI service is experiencing issues. Please try again shortly.",
      httpStatus: 502,
    };
  }
  return {
    code: "provider_error",
    message: "Something went wrong contacting the AI service. Please try again.",
    httpStatus: 502,
  };
}

/** Same idea, for a request that never got an HTTP response at all (timeout/network failure). */
export function mapProviderTransportError(kind: "timeout" | "network"): ProviderErrorInfo {
  if (kind === "timeout") {
    return {
      code: "provider_timeout",
      message: "The AI service took too long to respond. Please try again.",
      httpStatus: 504,
    };
  }
  return {
    code: "network_error",
    message: "Couldn't reach the AI service. Please check your connection and try again.",
    httpStatus: 502,
  };
}
