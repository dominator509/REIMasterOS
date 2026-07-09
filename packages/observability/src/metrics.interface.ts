export type MetricType = "counter" | "gauge" | "histogram";

export interface MetricDefinition {
  readonly name: string;
  readonly type: MetricType;
  readonly help: string;
  readonly labels?: readonly string[];
}

export interface MetricsCollector {
  increment(name: string, labels?: Record<string, string>, value?: number): void;
  gauge(name: string, value: number, labels?: Record<string, string>): void;
  observe(name: string, value: number, labels?: Record<string, string>): void;
}

/** Predefined metric names for the platform. */
export const METRICS = {
  API_REQUEST_COUNT: "api_request_count",
  API_REQUEST_DURATION: "api_request_duration_ms",
  COMPLIANCE_CHECK_COUNT: "compliance_check_count",
  COMPLIANCE_BLOCKED_COUNT: "compliance_blocked_count",
  LEAD_IMPORT_COUNT: "lead_import_count",
  CAMPAIGN_SEND_COUNT: "campaign_send_count",
  AI_QUERY_COUNT: "ai_query_count",
  AI_QUERY_DURATION: "ai_query_duration_ms",
  AI_CACHE_HIT_COUNT: "ai_cache_hit_count",
  AI_CACHE_MISS_COUNT: "ai_cache_miss_count",
  PROVIDER_CALL_COUNT: "provider_call_count",
  PROVIDER_CALL_DURATION: "provider_call_duration_ms",
  DB_QUERY_DURATION: "db_query_duration_ms",
  CACHE_HIT_COUNT: "cache_hit_count",
  CACHE_MISS_COUNT: "cache_miss_count",
  STORAGE_OPERATION_COUNT: "storage_operation_count",
} as const;
