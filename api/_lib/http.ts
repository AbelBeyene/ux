import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Thrown by handlers to short-circuit with a specific HTTP status + client-safe message. */
export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, message: string, code = "bad_request") {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
  }
}

/** Wraps a Vercel function body with method restriction, consistent JSON error responses, and logging. */
export function withHandler(
  method: "GET" | "POST",
  fn: (req: VercelRequest, res: VercelResponse) => Promise<void>,
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    if (req.method !== method) {
      res.setHeader("Allow", method);
      res.status(405).json({ error: `Method not allowed`, code: "method_not_allowed" });
      return;
    }

    try {
      await fn(req, res);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message, code: error.code });
        return;
      }
      console.error("Unhandled API error:", error);
      res.status(500).json({ error: "Internal server error", code: "internal_error" });
    }
  };
}

export function requireStringField(body: unknown, field: string, maxLength: number): string {
  const value = (body as Record<string, unknown> | null)?.[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, `"${field}" is required`, "invalid_body");
  }
  return value.slice(0, maxLength);
}

/** Reads a single-value query-string param (Vercel gives `string | string[] | undefined`). */
export function queryParam(query: VercelRequest["query"], name: string): string | undefined {
  const value = query[name];
  return Array.isArray(value) ? value[0] : value;
}
