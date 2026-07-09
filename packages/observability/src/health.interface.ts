export type HealthStatus = "ok" | "degraded" | "error" | "not_configured";

export interface ServiceHealth {
  readonly status: HealthStatus;
  readonly latencyMs?: number;
  readonly message?: string;
}

export interface HealthReport {
  readonly status: HealthStatus;
  readonly timestamp: string;
  readonly version: string;
  readonly uptimeSeconds: number;
  readonly services: Record<string, ServiceHealth>;
}
