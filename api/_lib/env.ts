/**
 * Server-only environment access. This file runs exclusively inside Vercel's
 * Node runtime — nothing here is ever bundled into the client, which is what
 * makes it safe to hold real provider API keys (unlike `src/config/env.ts`,
 * which only ever sees `VITE_`-prefixed, client-safe values).
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

export const serverEnv = {
  get openRouterApiKeys(): string[] {
    return [process.env.OPENROUTER_API_KEY, process.env.OPENROUTER_API_KEY_2].filter(
      (key): key is string => Boolean(key),
    );
  },
  get openRouterApiUrl(): string {
    return process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1/chat/completions";
  },
  get openRouterModel(): string {
    return process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash";
  },
  requireOpenRouterKeys(): string[] {
    const keys = this.openRouterApiKeys;
    if (keys.length === 0) {
      throw new Error("Missing required server environment variable: OPENROUTER_API_KEY");
    }
    return keys;
  },
};

export { required };
