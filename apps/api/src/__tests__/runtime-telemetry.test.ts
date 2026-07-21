import { InMemoryMetricsCollector, InMemoryTracer, METRICS } from "@rei-os/observability";
import { describe, expect, it } from "vitest";
import { ApiRuntimeTelemetry } from "../observability/runtime-telemetry.js";

describe("API runtime telemetry", () => {
  it("emits API, compliance, provider, search, and trace signals", () => {
    const metrics = new InMemoryMetricsCollector();
    const tracer = new InMemoryTracer(() => 10);
    const telemetry = new ApiRuntimeTelemetry(metrics, tracer);

    telemetry.recordRequest({
      route: "properties.list",
      method: "GET",
      status: "200",
      durationMs: 8,
    });
    telemetry.recordCompliance("blocked", "voice", ["CONTACT_OPTED_OUT"]);
    telemetry.recordProvider({
      provider: "smtp",
      channel: "email",
      status: "manual_required",
      durationMs: 2,
      estimatedCostUsd: 0,
      manualFallback: true,
    });
    telemetry.recordSearch("disabled", 0, 0);
    telemetry.startSpan("api.request", { requestId: "request-synthetic" }).end("ok");

    const names = metrics.snapshot().map((observation) => observation.name);
    expect(names).toEqual(
      expect.arrayContaining([
        METRICS.API_REQUEST_COUNT,
        METRICS.COMPLIANCE_VERDICT_COUNT,
        METRICS.COMPLIANCE_BLOCK_REASON_COUNT,
        METRICS.PROVIDER_CALL_COUNT,
        METRICS.PROVIDER_COST_ESTIMATE,
        METRICS.MANUAL_FALLBACK_COUNT,
        METRICS.SEARCH_QUERY_DURATION,
      ]),
    );
    expect(tracer.snapshot()).toHaveLength(1);
  });

  it("keeps Hermes and DeepSeek cache metrics separated", () => {
    const metrics = new InMemoryMetricsCollector();
    const telemetry = new ApiRuntimeTelemetry(metrics, new InMemoryTracer());
    telemetry.recordAiCache({
      provider: "hermes",
      model: "local-hermes",
      status: "ok",
      durationMs: 10,
      requestCacheHit: true,
      hitTokens: 70,
      missTokens: 0,
    });
    telemetry.recordAiCache({
      provider: "deepseek",
      model: "deepseek-chat",
      status: "ok",
      durationMs: 12,
      requestCacheHit: false,
      hitTokens: 0,
      missTokens: 70,
    });

    const cacheRequests = metrics
      .snapshot()
      .filter((observation) => observation.name === METRICS.AI_CACHE_REQUEST_COUNT);
    expect(cacheRequests.map((observation) => observation.labels)).toEqual([
      { provider: "hermes", cache_hit: "true" },
      { provider: "deepseek", cache_hit: "false" },
    ]);
  });
});
