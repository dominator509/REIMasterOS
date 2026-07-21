import { StructuredLogger, type StructuredLogSink } from "@rei-os/observability";

export interface ApiLoggerOptions {
  readonly environment: string;
  readonly version: string;
  readonly sink: StructuredLogSink;
  readonly now?: () => Date;
}

export function createApiStructuredLogger(options: ApiLoggerOptions): StructuredLogger {
  return new StructuredLogger({
    service: "api",
    environment: options.environment,
    version: options.version,
    sink: options.sink,
    ...(options.now ? { now: options.now } : {}),
  });
}
