import { METRICS, type MetricsCollector, type Span, type Tracer } from "@rei-os/observability";
import type { ComplianceVerdict } from "@rei-os/domain";

export class ApiRuntimeTelemetry {
  constructor(
    private readonly metrics: MetricsCollector,
    private readonly tracer: Tracer,
  ) {}

  recordRequest(input: {
    readonly route: string;
    readonly method: string;
    readonly status: string;
    readonly durationMs: number;
    readonly errorCode?: string;
  }): void {
    this.metrics.increment(METRICS.API_REQUEST_COUNT, {
      route: input.route,
      method: input.method,
      status: input.status,
    });
    this.metrics.observe(METRICS.API_REQUEST_DURATION, input.durationMs, {
      route: input.route,
      status: input.status,
    });
    if (input.errorCode) {
      this.metrics.increment(METRICS.API_ERROR_COUNT, {
        route: input.route,
        error_code: input.errorCode,
      });
    }
  }

  recordCompliance(
    verdict: ComplianceVerdict,
    channel: string,
    reasonCodes: readonly string[],
  ): void {
    this.metrics.increment(METRICS.COMPLIANCE_VERDICT_COUNT, { verdict, channel });
    if (verdict !== "allowed") {
      for (const reasonCode of reasonCodes) {
        this.metrics.increment(METRICS.COMPLIANCE_BLOCK_REASON_COUNT, {
          reason_code: reasonCode,
          channel,
        });
      }
    }
  }

  recordProvider(input: {
    readonly provider: string;
    readonly channel: string;
    readonly status: string;
    readonly durationMs: number;
    readonly estimatedCostUsd?: number;
    readonly manualFallback?: boolean;
  }): void {
    const labels = {
      provider: input.provider,
      channel: input.channel,
      status: input.status,
    };
    this.metrics.increment(METRICS.PROVIDER_CALL_COUNT, labels);
    this.metrics.observe(METRICS.PROVIDER_CALL_DURATION, input.durationMs, labels);
    if (input.estimatedCostUsd !== undefined) {
      this.metrics.gauge(METRICS.PROVIDER_COST_ESTIMATE, input.estimatedCostUsd, {
        provider: input.provider,
        channel: input.channel,
      });
    }
    if (input.manualFallback) {
      this.metrics.increment(METRICS.MANUAL_FALLBACK_COUNT, { channel: input.channel });
    }
  }

  recordSearch(status: string, durationMs: number, resultCount: number): void {
    this.metrics.observe(METRICS.SEARCH_QUERY_DURATION, durationMs, { status });
    this.metrics.observe(METRICS.SEARCH_RESULT_COUNT, resultCount, { status });
  }

  recordAiCache(input: {
    readonly provider: "hermes" | "deepseek";
    readonly model: string;
    readonly status: string;
    readonly durationMs: number;
    readonly requestCacheHit: boolean;
    readonly hitTokens: number;
    readonly missTokens: number;
  }): void {
    const routeLabels = { provider: input.provider, model: input.model, status: input.status };
    this.metrics.increment(METRICS.AI_QUERY_COUNT, routeLabels);
    this.metrics.observe(METRICS.AI_QUERY_DURATION, input.durationMs, routeLabels);
    this.metrics.increment(METRICS.AI_CACHE_REQUEST_COUNT, {
      provider: input.provider,
      cache_hit: String(input.requestCacheHit),
    });
    this.metrics.increment(
      METRICS.AI_CACHE_TOKEN_COUNT,
      {
        provider: input.provider,
        result: "hit",
      },
      input.hitTokens,
    );
    this.metrics.increment(
      METRICS.AI_CACHE_TOKEN_COUNT,
      {
        provider: input.provider,
        result: "miss",
      },
      input.missTokens,
    );
  }

  startSpan(
    name: string,
    correlation: { readonly requestId?: string; readonly jobId?: string },
  ): Span {
    return this.tracer.startSpan(name, correlation);
  }
}
