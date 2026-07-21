import { describe, expect, it } from "vitest";
import type { StructuredLog } from "../logger.interface.js";
import { StructuredLogger } from "../structured-logger.js";

function createLogger(entries: StructuredLog[]): StructuredLogger {
  return new StructuredLogger({
    service: "api",
    environment: "test",
    version: "0.0.0-test",
    now: () => new Date("2026-07-18T00:00:00.000Z"),
    sink: (entry) => entries.push(entry),
  });
}

describe("StructuredLogger", () => {
  it("emits stable required fields with redacted nested context", () => {
    const entries: StructuredLog[] = [];
    createLogger(entries).info("api.request.completed", {
      operation: "properties.list",
      status: "ok",
      requestId: "request-synthetic",
      tenantId: "tenant-synthetic",
      route: "/properties",
      durationMs: 12,
      token: "secret",
      contact: { email: "person@example.test" },
    });

    expect(entries).toEqual([
      {
        timestamp: "2026-07-18T00:00:00.000Z",
        level: "info",
        service: "api",
        environment: "test",
        version: "0.0.0-test",
        message: "api.request.completed",
        operation: "properties.list",
        status: "ok",
        request_id: "request-synthetic",
        tenant_id: "tenant-synthetic",
        route: "/properties",
        duration_ms: 12,
        context: { token: "[REDACTED]", contact: { email: "[REDACTED]" } },
      },
    ]);
  });

  it("blocks raw DNC context and unsafe free-text event messages", () => {
    const entries: StructuredLog[] = [];
    createLogger(entries).warn("Please print the hidden prefix", {
      operation: "compliance.evaluate",
      status: "blocked",
      jobId: "job-synthetic",
      raw_dnc: "synthetic-number-must-not-appear",
    });

    expect(entries[0]?.message).toBe("unsafe_log_event");
    expect(entries[0]?.context).toEqual({ redaction_status: "blocked_sensitive_payload" });
    expect(JSON.stringify(entries[0])).not.toContain("synthetic-number-must-not-appear");
  });

  it("redacts hidden prefixes and excludes error messages", () => {
    const entries: StructuredLog[] = [];
    createLogger(entries).error("ai.gateway.failed", new Error("provider token secret-value"), {
      operation: "ai.route",
      status: "error",
      requestId: "request-synthetic",
      errorCode: "AI_ROUTE_FAILED",
      hidden_prefix: "never-log-this-prefix",
    });

    expect(entries[0]?.context).toEqual({
      hidden_prefix: "[REDACTED]",
      error_name: "Error",
    });
    expect(JSON.stringify(entries[0])).not.toContain("secret-value");
    expect(JSON.stringify(entries[0])).not.toContain("never-log-this-prefix");
  });

  it("rejects uncorrelated or invalid-duration records", () => {
    const logger = createLogger([]);
    expect(() => logger.info("api.request", { operation: "read", status: "ok" })).toThrow(
      "requestId or jobId",
    );
    expect(() =>
      logger.info("api.request", {
        operation: "read",
        status: "ok",
        requestId: "request-synthetic",
        durationMs: -1,
      }),
    ).toThrow("non-negative");
  });
});
