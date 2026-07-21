import type { LogContext, Logger, LogLevel, StructuredLog } from "./logger.interface.js";
import { sanitizeForLogging } from "./redaction.js";

export type StructuredLogSink = (entry: StructuredLog) => void;

export interface StructuredLoggerOptions {
  readonly service: string;
  readonly environment: string;
  readonly version: string;
  readonly sink: StructuredLogSink;
  readonly now?: () => Date;
}

const EVENT_NAME = /^[a-z0-9][a-z0-9_.-]{0,127}$/u;

export class StructuredLogger implements Logger {
  private readonly now: () => Date;

  constructor(private readonly options: StructuredLoggerOptions) {
    this.now = options.now ?? (() => new Date());
    if (!options.service.trim() || !options.environment.trim() || !options.version.trim()) {
      throw new Error("Structured logger service, environment, and version are required");
    }
  }

  debug(message: string, context: LogContext): void {
    this.write("debug", message, context);
  }

  info(message: string, context: LogContext): void {
    this.write("info", message, context);
  }

  warn(message: string, context: LogContext): void {
    this.write("warn", message, context);
  }

  error(message: string, error: Error, context: LogContext): void {
    this.write("error", message, { ...context, error_name: error.name });
  }

  private write(level: LogLevel, message: string, context: LogContext): void {
    if (!context.requestId?.trim() && !context.jobId?.trim()) {
      throw new Error("Structured logs require a requestId or jobId");
    }
    if (!context.operation.trim() || !context.status.trim()) {
      throw new Error("Structured logs require operation and status");
    }
    if (
      context.durationMs !== undefined &&
      (!Number.isFinite(context.durationMs) || context.durationMs < 0)
    ) {
      throw new Error("Structured log durationMs must be a non-negative finite number");
    }

    const {
      operation,
      status,
      requestId,
      jobId,
      tenantId,
      userId,
      route,
      durationMs,
      errorCode,
      ...details
    } = context;

    let safeDetails: Record<string, unknown>;
    try {
      safeDetails = sanitizeForLogging(details);
    } catch {
      safeDetails = { redaction_status: "blocked_sensitive_payload" };
    }

    this.options.sink({
      timestamp: this.now().toISOString(),
      level,
      service: this.options.service,
      environment: this.options.environment,
      version: this.options.version,
      message: EVENT_NAME.test(message) ? message : "unsafe_log_event",
      operation,
      status,
      ...(requestId ? { request_id: requestId } : {}),
      ...(jobId ? { job_id: jobId } : {}),
      ...(tenantId ? { tenant_id: tenantId } : {}),
      ...(userId ? { user_id: userId } : {}),
      ...(route ? { route } : {}),
      ...(durationMs !== undefined ? { duration_ms: durationMs } : {}),
      ...(errorCode ? { error_code: errorCode } : {}),
      context: safeDetails,
    });
  }
}
