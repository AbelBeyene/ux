/**
 * Pulls a JSON value out of a raw LLM completion, which frequently wraps
 * the payload in markdown fences or prose. Shared by any server function
 * that parses a model response (see api/_lib/openrouter.ts).
 */
export function extractJsonCandidate(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();

  const firstObject = trimmed.indexOf("{");
  const lastObject = trimmed.lastIndexOf("}");
  if (firstObject !== -1 && lastObject > firstObject) {
    return trimmed.slice(firstObject, lastObject + 1);
  }

  const firstArray = trimmed.indexOf("[");
  const lastArray = trimmed.lastIndexOf("]");
  if (firstArray !== -1 && lastArray > firstArray) {
    return trimmed.slice(firstArray, lastArray + 1);
  }

  return null;
}

/** Best-effort JSON.parse of a raw model completion; returns null instead of throwing. */
export function tryParseJson<T>(raw: string): T | null {
  const candidate = extractJsonCandidate(raw);
  if (!candidate) return null;
  try {
    return JSON.parse(candidate) as T;
  } catch {
    return null;
  }
}
