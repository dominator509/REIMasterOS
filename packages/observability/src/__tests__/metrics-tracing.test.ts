import { describe, expect, it } from "vitest";
import { InMemoryMetricsCollector } from "../metrics/in-memory-metrics.js";
import { METRICS } from "../metrics.interface.js";
import { InMemoryTracer, NoopTracer } from "../tracing/tracer.js";

describe("metrics and tracing contracts", () => {
  it("records defined low-cardinality metrics and rejects unsafe labels", () => {
    const metrics = new InMemoryMetricsCollector();
    metrics.increment(METRICS.COMPLIANCE_VERDICT_COUNT, {
      verdict: "blocked",
      channel: "voice",
    });
    metrics.observe(METRICS.PROVIDER_CALL_DURATION, 12, {
      provider: "smtp",
      channel: "email",
      status: "manual_required",
    });
    expect(metrics.snapshot()).toHaveLength(2);
    expect(() =>
      metrics.increment(METRICS.API_REQUEST_COUNT, {
        route: "/contacts?email=person@example.test",
        method: "GET",
        status: "200",
      }),
    ).toThrow("Unsafe metric label");
    expect(() => metrics.increment("invented_metric", {})).toThrow("Unknown or mismatched");
  });

  it("redacts trace attributes and falls back to no-op when exporting is disabled", () => {
    let now = 10;
    const tracer = new InMemoryTracer(() => now);
    const span = tracer.startSpan("provider.call", {
      requestId: "request-synthetic",
      attributes: { provider: "smtp", authorization: "must-not-leak" },
    });
    now = 18;
    span.end("ok", { status: "manual_required" });
    expect(tracer.snapshot()[0]).toMatchObject({
      duration_ms: 8,
      attributes: { provider: "smtp", authorization: "[REDACTED]" },
    });
    expect(JSON.stringify(tracer.snapshot())).not.toContain("must-not-leak");
    expect(() => span.end("ok")).toThrow("already ended");
    expect(() => new NoopTracer().startSpan("ignored", {}).end("ok")).not.toThrow();
  });
});
