/**
 * Typed, validated access to client-safe environment variables.
 *
 * Only `VITE_`-prefixed vars belong here — Vite inlines them into the
 * client bundle at build time, so nothing secret (AI provider keys, etc.)
 * may ever be read through this module. Server-only secrets live in
 * `api/_lib/env.ts` instead, read via `process.env` inside serverless
 * functions, which never ship to the browser.
 */

interface ClientEnv {
  /** Base URL for our own backend API. Same-origin by default in production. */
  apiBaseUrl: string;
}

function readClientEnv(): ClientEnv {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "/api";
  return { apiBaseUrl };
}

export const env: ClientEnv = readClientEnv();
