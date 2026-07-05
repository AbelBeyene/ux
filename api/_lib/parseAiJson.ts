import { tryParseJson } from "../../src/lib/jsonExtract";
import { callOpenRouter } from "./openrouter";
import { HttpError } from "./http";

const REPAIR_SYSTEM_PROMPT =
  "You repair malformed API outputs into valid JSON. Return only valid JSON with no explanation.";

/**
 * Parses a model completion as JSON, and if it's malformed, spends one extra
 * model call asking it to fix its own output before giving up. Models
 * instructed to "return only JSON" still occasionally wrap it in prose or
 * emit near-miss JSON (trailing commas, smart quotes) — this recovers most
 * of those cases instead of failing the whole request over a formatting slip.
 */
export async function parseAiJson<T>(raw: string, schemaHint: string): Promise<T> {
  const direct = tryParseJson<T>(raw);
  if (direct !== null) return direct;

  const repaired = await callOpenRouter(
    [
      { role: "system", content: REPAIR_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Convert the following content into valid JSON matching this shape:\n${schemaHint}\n\nCONTENT:\n${raw}`,
      },
    ],
    true,
  );

  const fixed = tryParseJson<T>(repaired);
  if (fixed === null) {
    throw new HttpError(502, "The AI returned an unexpected response format. Please try again.", "invalid_ai_response");
  }
  return fixed;
}
