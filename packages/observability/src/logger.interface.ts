export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext extends Record<string, unknown> {
  readonly operation: string;
  readonly status: string;
  readonly requestId?: string;
  readonly jobId?: string;
  readonly tenantId?: string;
  readonly userId?: string;
  readonly route?: string;
  readonly durationMs?: number;
  readonly errorCode?: string;
}

export interface StructuredLog {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly service: string;
  readonly environment: string;
  readonly version: string;
  readonly message: string;
  readonly operation: string;
  readonly status: string;
  readonly request_id?: string;
  readonly job_id?: string;
  readonly tenant_id?: string;
  readonly user_id?: string;
  readonly route?: string;
  readonly duration_ms?: number;
  readonly error_code?: string;
  readonly context: Record<string, unknown>;
}

export interface Logger {
  debug(message: string, context: LogContext): void;
  info(message: string, context: LogContext): void;
  warn(message: string, context: LogContext): void;
  error(message: string, error: Error, context: LogContext): void;
}
