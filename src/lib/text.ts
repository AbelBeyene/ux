/** Truncates text to a character budget, marking that it was cut so callers (and prompts) can tell. */
export function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n[...truncated]`;
}
