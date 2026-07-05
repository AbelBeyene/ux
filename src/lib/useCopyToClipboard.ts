import { useRef, useState } from "react";

/** Copies text to the clipboard and flips `copied` back off after `resetMs`. */
export function useCopyToClipboard(resetMs = 1500) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetMs);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — leave state unchanged.
    }
  };

  return { copied, copy };
}
