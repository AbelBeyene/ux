import { QueryClient } from "@tanstack/react-query";

/**
 * Our own `/api/*` backend already retries transient failures (429/5xx) with
 * backoff server-side (see api/_lib/openrouter.ts), so the client defaults to
 * no additional retries — stacking both would multiply latency on failures.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});
