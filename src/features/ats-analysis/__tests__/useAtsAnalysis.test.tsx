import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAtsAnalysis } from "../useAtsAnalysis";
import type { AtsAnalysisResult } from "../types";

const mockResult: AtsAnalysisResult = {
  readinessScore: 84,
  readinessRating: "Excellent",
  readinessCaption: "Top 15% of parsed documents for Product Design roles.",
  keywords: [
    { keyword: "User Research", matched: true, strength: 90 },
    { keyword: "Design Systems", matched: false, note: "Recommended" },
  ],
  formattingChecks: [
    { id: "contact-info", status: "pass", title: "Contact Info", description: "Header placement is fine." },
  ],
  relevanceScores: [
    { label: "Product Design & UX", value: 92 },
    { label: "Visual Communication", value: 74 },
    { label: "Frontend Development", value: 45 },
  ],
  careerHeadline: "Path to Design Director",
  careerDescription: "You are 2.5 years away from Leadership roles.",
  careerStages: [
    { label: "Current State", title: "Senior Designer" },
    { label: "Target Role", title: "Principal Designer" },
    { label: "Long-term", title: "VP of Design" },
  ],
};

// Fresh QueryClient per test — no retries, so failures surface immediately
// instead of waiting through backoff delays.
function renderAtsAnalysis() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return renderHook(
    () => useAtsAnalysis({ resumeText: "some resume text", targetRole: "Senior Product Designer" }),
    {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
    },
  );
}

describe("useAtsAnalysis", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init: RequestInit) => {
        expect(url).toBe("/api/analyze");
        expect(init.method).toBe("POST");
        expect(JSON.parse(init.body as string)).toEqual({
          resumeText: "some resume text",
          targetRole: "Senior Product Designer",
        });
        return new Response(JSON.stringify(mockResult), { status: 200 });
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches on mount and exposes the analysis", async () => {
    const { result } = renderAtsAnalysis();
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(mockResult);
    expect(result.current.error).toBeNull();
  });

  it("surfaces a friendly message when the backend call fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ error: "boom", code: "invalid_ai_response" }), { status: 502 }),
      ),
    );

    const { result } = renderAtsAnalysis();
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toBe("The AI returned an unexpected response. Please try again.");
    expect(result.current.data).toBeNull();
  });

  it("refresh re-fetches the analysis", async () => {
    const { result } = renderAtsAnalysis();
    await waitFor(() => expect(result.current.data).toEqual(mockResult));

    const fetchSpy = vi.mocked(fetch);
    const callsBefore = fetchSpy.mock.calls.length;

    act(() => result.current.refresh());
    await waitFor(() => expect(fetchSpy.mock.calls.length).toBe(callsBefore + 1));
  });
});
