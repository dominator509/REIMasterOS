export type LogLevel = "debug" | "info" | "warn" | "error";

export interface StructuredLog {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly message: string;
  readonly context: Record<string, unknown>;
  readonly traceId?: string;
  readonly spanId?: string;
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
}
