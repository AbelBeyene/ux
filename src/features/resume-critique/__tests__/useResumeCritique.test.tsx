import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useResumeCritique } from "../useResumeCritique";
import type { ResumeCritiqueResult } from "../types";

const mockResult: ResumeCritiqueResult = {
  overallScore: 78,
  resumeMarkdown: "# Alex Rivera\n## Professional Summary\nSenior Product Designer.",
  sections: [
    {
      key: "summary",
      title: "Professional Summary",
      text: "Senior Product Designer.",
      score: 8,
      status: "pass",
      findings: [],
    },
  ],
  topRedFlags: [],
  quickWins: ["Quantify the Meta role's impact with a metric."],
};

describe("useResumeCritique", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init: RequestInit) => {
        expect(url).toBe("/api/critique");
        expect(init.method).toBe("POST");
        expect(JSON.parse(init.body as string)).toEqual({ resumeText: "some resume text" });
        return new Response(JSON.stringify(mockResult), { status: 200 });
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("goes idle -> loading -> success and exposes the parsed critique", async () => {
    const { result } = renderHook(() => useResumeCritique());
    expect(result.current.status).toBe("idle");

    act(() => {
      void result.current.run("some resume text");
    });
    expect(result.current.status).toBe("loading");

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.data).toEqual(mockResult);
    expect(result.current.error).toBeNull();
  });

  it("surfaces a friendly message when the backend call fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ error: "boom", code: "provider_error" }), { status: 502 })),
    );

    const { result } = renderHook(() => useResumeCritique());
    act(() => {
      void result.current.run("some resume text");
    });

    await waitFor(() => expect(result.current.status).toBe("error"));
    // 5xx responses map to a generic, user-safe message rather than leaking backend text.
    expect(result.current.error).toBe("The service is temporarily unavailable. Please try again shortly.");
    expect(result.current.data).toBeNull();
  });

  it("reset returns the hook to idle with no data", async () => {
    const { result } = renderHook(() => useResumeCritique());
    act(() => {
      void result.current.run("some resume text");
    });
    await waitFor(() => expect(result.current.status).toBe("success"));

    act(() => result.current.reset());
    expect(result.current.status).toBe("idle");
    expect(result.current.data).toBeNull();
  });
});
