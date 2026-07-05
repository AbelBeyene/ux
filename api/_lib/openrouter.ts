import { mapProviderErrorStatus, mapProviderTransportError } from "../../src/lib/aiErrorMapping";
import { serverEnv } from "./env";
import { HttpError } from "./http";

type OpenRouterMessage = { role: "system" | "user" | "assistant"; content: string };

const MAX_RETRIES = 4;
const BASE_RETRY_DELAY_MS = 2000;
const REQUEST_TIMEOUT_MS = 55_000;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterMs(header: string | null): number | null {
  if (!header) return null;
  const asSeconds = Number(header);
  if (Number.isFinite(asSeconds) && asSeconds >= 0) return asSeconds * 1000;
  const asDate = Date.parse(header);
  return Number.isNaN(asDate) ? null : Math.max(0, asDate - Date.now());
}

function extractText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : (part as { text?: string })?.text ?? ""))
      .join("");
  }
  return "";
}

function throwAsHttpError(error: unknown): never {
  const isAbort =
    error instanceof DOMException && (error.name === "AbortError" || error.name === "TimeoutError");
  const info = mapProviderTransportError(isAbort ? "timeout" : "network");
  throw new HttpError(info.httpStatus, info.message, info.code);
}

/**
 * Calls OpenRouter with automatic key rotation and retry/backoff on 429s.
 * Runs server-side only — the API key never reaches client code.
 */
export async function callOpenRouter(messages: OpenRouterMessage[], requireJson = false): Promise<string> {
  const keys = serverEnv.requireOpenRouterKeys();
  let keyIndex = 0;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const apiKey = keys[keyIndex % keys.length];

    let response: Response;
    try {
      response = await fetch(serverEnv.openRouterApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "X-Title": "ResumeAI",
        },
        body: JSON.stringify({
          model: serverEnv.openRouterModel,
          messages,
          ...(requireJson ? { response_format: { type: "json_object" } } : {}),
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      throwAsHttpError(error);
    }

    if (!response.ok) {
      if (response.status === 429 && attempt < MAX_RETRIES) {
        keyIndex += 1;
        const usingFallback = keys.length > 1 && keyIndex % keys.length !== 0;
        const backoffMs = usingFallback
          ? 500
          : (parseRetryAfterMs(response.headers.get("retry-after")) ?? BASE_RETRY_DELAY_MS * (attempt + 1));
        await wait(backoffMs);
        continue;
      }

      const errorText = await response.text().catch(() => "");
      console.error("OpenRouter API error:", response.status, errorText);
      const info = mapProviderErrorStatus(response.status);
      throw new HttpError(info.httpStatus, info.message, info.code);
    }

    const data = (await response.json()) as { choices?: { message?: { content?: unknown } }[] };
    const text = extractText(data?.choices?.[0]?.message?.content);
    if (text.trim()) return text;

    const info = mapProviderErrorStatus(502);
    throw new HttpError(info.httpStatus, info.message, "provider_bad_response");
  }

  const info = mapProviderErrorStatus(429);
  throw new HttpError(info.httpStatus, info.message, info.code);
}
