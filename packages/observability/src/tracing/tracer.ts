import { sanitizeForLogging } from "../redaction.js";

export type TraceStatus = "ok" | "error";
export type TraceAttribute = string | number | boolean;

export interface TraceContext {
  readonly requestId?: string;
  readonly jobId?: string;
  readonly attributes?: Readonly<Record<string, TraceAttribute>>;
}

export interface CompletedSpan {
  readonly name: string;
  readonly correlation_id: string;
  readonly status: TraceStatus;
  readonly duration_ms: number;
  readonly attributes: Readonly<Record<string, TraceAttribute | string>>;
}

export interface Span {
  end(status: TraceStatus, attributes?: Readonly<Record<string, TraceAttribute>>): void;
}

export interface Tracer {
  startSpan(name: string, context: TraceContext): Span;
}

export class NoopTracer implements Tracer {
  startSpan(_name: string, _context: TraceContext): Span {
    return { end: () => undefined };
  }
}

export class InMemoryTracer implements Tracer {
  private readonly spans: CompletedSpan[] = [];

  constructor(private readonly nowMs: () => number = () => Date.now()) {}

  startSpan(name: string, context: TraceContext): Span {
    if (!/^[a-z0-9][a-z0-9_.-]{0,127}$/u.test(name)) throw new Error("Unsafe trace span name");
    const correlationId = context.requestId?.trim() || context.jobId?.trim();
    if (!correlationId) throw new Error("Trace spans require requestId or jobId");
    const startedAt = this.nowMs();
    const initial = sanitizeAttributes(context.attributes ?? {});
    let ended = false;

    return {
      end: (status, attributes = {}) => {
        if (ended) throw new Error("Trace span already ended");
        ended = true;
        this.spans.push({
          name,
          correlation_id: correlationId,
          status,
          duration_ms: Math.max(0, this.nowMs() - startedAt),
          attributes: { ...initial, ...sanitizeAttributes(attributes) },
        });
      },
    };
  }

  snapshot(): readonly CompletedSpan[] {
    return this.spans.map((span) => ({ ...span, attributes: { ...span.attributes } }));
  }
}

function sanitizeAttributes(
  attributes: Readonly<Record<string, TraceAttribute>>,
): Readonly<Record<string, TraceAttribute | string>> {
  try {
    return sanitizeForLogging(attributes) as Readonly<Record<string, TraceAttribute | string>>;
  } catch {
    return { redaction_status: "blocked_sensitive_payload" };
  }
}
