export type MetricType = "counter" | "gauge" | "histogram";

export interface MetricDefinition {
  readonly name: string;
  readonly type: MetricType;
  readonly help: string;
  readonly labels?: readonly string[];
}

export interface MetricObservation {
  readonly name: string;
  readonly type: MetricType;
  readonly value: number;
  readonly labels: Readonly<Record<string, string>>;
}

export interface MetricsCollector {
  increment(name: string, labels?: Record<string, string>, value?: number): void;
  gauge(name: string, value: number, labels?: Record<string, string>): void;
  observe(name: string, value: number, labels?: Record<string, string>): void;
}

/** Predefined metric names for the platform. */
export const METRICS = {
  API_REQUEST_COUNT: "rei_api_requests_total",
  API_ERROR_COUNT: "rei_api_errors_total",
  API_REQUEST_DURATION: "rei_api_request_duration_ms",
  AUTH_FAILURE_COUNT: "rei_auth_failures_total",
  RATE_LIMIT_DENIAL_COUNT: "rei_rate_limit_denials_total",
  TENANT_SCOPE_DENIAL_COUNT: "rei_tenant_scope_denials_total",
  COMPLIANCE_VERDICT_COUNT: "rei_compliance_verdicts_total",
  COMPLIANCE_BLOCK_REASON_COUNT: "rei_compliance_block_reasons_total",
  WORKER_JOB_COUNT: "rei_worker_jobs_total",
  WORKER_QUEUE_DEPTH: "rei_worker_queue_depth",
  WORKER_QUEUE_AGE: "rei_worker_queue_age_seconds",
  CAMPAIGN_EVENT_COUNT: "rei_campaign_events_total",
  PROPERTY_IMPORT_COUNT: "rei_property_imports_total",
  VOICE_EVENT_COUNT: "rei_voice_events_total",
  VOICE_EVENT_DURATION: "rei_voice_event_duration_ms",
  PROVIDER_CALL_COUNT: "rei_provider_calls_total",
  PROVIDER_CALL_DURATION: "rei_provider_call_duration_ms",
  PROVIDER_COST_ESTIMATE: "rei_provider_cost_estimate_usd",
  MANUAL_FALLBACK_COUNT: "rei_manual_fallback_total",
  SEARCH_QUERY_DURATION: "rei_search_query_duration_ms",
  SEARCH_RESULT_COUNT: "rei_search_results",
  SEARCH_PROJECTION_LAG: "rei_search_projection_lag_seconds",
  AI_QUERY_COUNT: "rei_ai_requests_total",
  AI_QUERY_DURATION: "rei_ai_request_duration_ms",
  AI_CACHE_REQUEST_COUNT: "rei_ai_cache_requests_total",
  AI_CACHE_TOKEN_COUNT: "rei_ai_cache_tokens_total",
  AI_PREFIX_DRIFT_COUNT: "rei_ai_prefix_drift_total",
  AI_SANITIZER_BLOCK_COUNT: "rei_ai_sanitizer_blocks_total",
} as const;

export const METRIC_DEFINITIONS: readonly MetricDefinition[] = [
  {
    name: METRICS.API_REQUEST_COUNT,
    type: "counter",
    help: "API requests",
    labels: ["route", "method", "status"],
  },
  {
    name: METRICS.API_ERROR_COUNT,
    type: "counter",
    help: "API errors",
    labels: ["route", "error_code"],
  },
  {
    name: METRICS.API_REQUEST_DURATION,
    type: "histogram",
    help: "API request latency",
    labels: ["route", "status"],
  },
  {
    name: METRICS.AUTH_FAILURE_COUNT,
    type: "counter",
    help: "Authentication failures",
    labels: ["reason"],
  },
  {
    name: METRICS.RATE_LIMIT_DENIAL_COUNT,
    type: "counter",
    help: "Rate limit denials",
    labels: ["route"],
  },
  {
    name: METRICS.TENANT_SCOPE_DENIAL_COUNT,
    type: "counter",
    help: "Tenant scope denials",
    labels: ["operation"],
  },
  {
    name: METRICS.COMPLIANCE_VERDICT_COUNT,
    type: "counter",
    help: "Compliance verdicts",
    labels: ["verdict", "channel"],
  },
  {
    name: METRICS.COMPLIANCE_BLOCK_REASON_COUNT,
    type: "counter",
    help: "Compliance block reasons",
    labels: ["reason_code", "channel"],
  },
  {
    name: METRICS.WORKER_JOB_COUNT,
    type: "counter",
    help: "Worker job outcomes",
    labels: ["queue", "job_type", "status"],
  },
  {
    name: METRICS.WORKER_QUEUE_DEPTH,
    type: "gauge",
    help: "Worker queue depth",
    labels: ["queue"],
  },
  {
    name: METRICS.WORKER_QUEUE_AGE,
    type: "gauge",
    help: "Oldest worker job age",
    labels: ["queue"],
  },
  {
    name: METRICS.CAMPAIGN_EVENT_COUNT,
    type: "counter",
    help: "Campaign channel events",
    labels: ["channel", "status"],
  },
  {
    name: METRICS.PROPERTY_IMPORT_COUNT,
    type: "counter",
    help: "Property import outcomes",
    labels: ["status"],
  },
  {
    name: METRICS.VOICE_EVENT_COUNT,
    type: "counter",
    help: "Voice event outcomes",
    labels: ["event", "status"],
  },
  {
    name: METRICS.VOICE_EVENT_DURATION,
    type: "histogram",
    help: "Voice event latency",
    labels: ["event", "status"],
  },
  {
    name: METRICS.PROVIDER_CALL_COUNT,
    type: "counter",
    help: "Provider call outcomes",
    labels: ["provider", "channel", "status"],
  },
  {
    name: METRICS.PROVIDER_CALL_DURATION,
    type: "histogram",
    help: "Provider call latency",
    labels: ["provider", "channel", "status"],
  },
  {
    name: METRICS.PROVIDER_COST_ESTIMATE,
    type: "gauge",
    help: "Provider cost estimate",
    labels: ["provider", "channel"],
  },
  {
    name: METRICS.MANUAL_FALLBACK_COUNT,
    type: "counter",
    help: "Manual fallback use",
    labels: ["channel"],
  },
  {
    name: METRICS.SEARCH_QUERY_DURATION,
    type: "histogram",
    help: "Search query latency",
    labels: ["status"],
  },
  {
    name: METRICS.SEARCH_RESULT_COUNT,
    type: "histogram",
    help: "Search result count",
    labels: ["status"],
  },
  {
    name: METRICS.SEARCH_PROJECTION_LAG,
    type: "gauge",
    help: "Search projection lag",
    labels: ["projection"],
  },
  {
    name: METRICS.AI_QUERY_COUNT,
    type: "counter",
    help: "AI route outcomes",
    labels: ["provider", "model", "status"],
  },
  {
    name: METRICS.AI_QUERY_DURATION,
    type: "histogram",
    help: "AI route latency",
    labels: ["provider", "model", "status"],
  },
  {
    name: METRICS.AI_CACHE_REQUEST_COUNT,
    type: "counter",
    help: "AI request cache outcomes",
    labels: ["provider", "cache_hit"],
  },
  {
    name: METRICS.AI_CACHE_TOKEN_COUNT,
    type: "counter",
    help: "AI prompt-cache tokens",
    labels: ["provider", "result"],
  },
  {
    name: METRICS.AI_PREFIX_DRIFT_COUNT,
    type: "counter",
    help: "AI stable-prefix drift",
    labels: ["provider"],
  },
  {
    name: METRICS.AI_SANITIZER_BLOCK_COUNT,
    type: "counter",
    help: "AI sanitizer blocks",
    labels: ["provider"],
  },
] as const;
