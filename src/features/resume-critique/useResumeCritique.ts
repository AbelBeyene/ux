import { useCallback, useRef, useState } from "react";
import { friendlyErrorMessage } from "../../services/apiError";
import { requestResumeCritique } from "./api";
import type { ResumeCritiqueResult } from "./types";

export type ResumeCritiqueStatus = "idle" | "loading" | "success" | "error";

export interface UseResumeCritique {
  status: ResumeCritiqueStatus;
  data: ResumeCritiqueResult | null;
  error: string | null;
  /** Trigger a critique run for the given resume text. Cancels any run already in flight. */
  run: (resumeText: string) => Promise<void>;
  reset: () => void;
}

/** Drives the resume-critique backend call: manual trigger, in-flight cancellation, typed status. */
export function useResumeCritique(): UseResumeCritique {
  const [status, setStatus] = useState<ResumeCritiqueStatus>("idle");
  const [data, setData] = useState<ResumeCritiqueResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const run = useCallback(async (resumeText: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus("loading");
    setError(null);

    try {
      const result = await requestResumeCritique({ resumeText }, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setData(result);
      setStatus("success");
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(friendlyErrorMessage(err));
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, run, reset };
}
