import { env } from "../config/env";
import { ApiError } from "./apiError";

export interface RequestOptions {
  /** Milliseconds before the request is aborted. Defaults to 60s (AI calls can be slow). */
  timeoutMs?: number;
  signal?: AbortSignal;
}

async function parseErrorBody(response: Response): Promise<{ message: string; code: string }> {
  try {
    const body = (await response.json()) as { error?: string; code?: string };
    return { message: body.error ?? response.statusText, code: body.code ?? "unknown_error" };
  } catch {
    return { message: response.statusText || "Request failed", code: "unknown_error" };
  }
}

/**
 * Thin, typed wrapper around fetch for calling our own `/api/*` backend.
 * Never used to call third-party providers directly — that's the backend's job,
 * so provider API keys never reach the browser.
 */
async function request<T>(path: string, init: RequestInit, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 60_000, signal } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  // Let an external signal (e.g. component unmount) abort too.
  signal?.addEventListener("abort", () => controller.abort(), { once: true });

  try {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
      signal: controller.signal,
    });

    if (!response.ok) {
      const { message, code } = await parseErrorBody(response);
      throw new ApiError(message, response.status, code);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timed out", 408, "timeout");
    }
    throw new ApiError(error instanceof Error ? error.message : "Network error", 0, "network_error");
  } finally {
    clearTimeout(timeout);
  }
}

export const apiClient = {
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }, options),
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { method: "GET" }, options),
};
