import { describe, expect, it } from "vitest";
import { mapProviderErrorStatus, mapProviderTransportError } from "../aiErrorMapping";

describe("mapProviderErrorStatus", () => {
  it("passes 429 through as retryable/actionable", () => {
    const info = mapProviderErrorStatus(429);
    expect(info).toEqual({
      code: "provider_rate_limited",
      message: "The AI service is busy right now. Please try again in a moment.",
      httpStatus: 429,
    });
  });

  it.each([401, 403])("maps auth failures (%d) to a generic 502, not exposing credential detail", (status) => {
    const info = mapProviderErrorStatus(status);
    expect(info.code).toBe("provider_auth_error");
    expect(info.httpStatus).toBe(502);
    expect(info.message).not.toMatch(/key|credential/i);
  });

  it("maps 400 to a bad-request code", () => {
    expect(mapProviderErrorStatus(400).code).toBe("provider_bad_request");
  });

  it("maps 404 to a model-unavailable code", () => {
    expect(mapProviderErrorStatus(404).code).toBe("provider_model_unavailable");
  });

  it.each([500, 502, 503])("maps 5xx (%d) to an upstream-error code", (status) => {
    expect(mapProviderErrorStatus(status).code).toBe("provider_upstream_error");
  });

  it("falls back to a generic code for anything unrecognized", () => {
    expect(mapProviderErrorStatus(418).code).toBe("provider_error");
  });

  it("never leaks the raw provider status as our own httpStatus, except 429", () => {
    for (const status of [400, 401, 403, 404, 500]) {
      expect(mapProviderErrorStatus(status).httpStatus).toBe(502);
    }
  });
});

describe("mapProviderTransportError", () => {
  it("maps timeouts distinctly from network errors", () => {
    expect(mapProviderTransportError("timeout")).toEqual({
      code: "provider_timeout",
      message: "The AI service took too long to respond. Please try again.",
      httpStatus: 504,
    });
    expect(mapProviderTransportError("network").code).toBe("network_error");
  });
});
