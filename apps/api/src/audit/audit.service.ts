import { Injectable } from "@nestjs/common";

export interface AuditEntry {
  readonly timestamp: string;
  readonly action: string;
  readonly actorId: string;
  readonly tenantId: string;
  readonly targetType: string;
  readonly targetId: string;
  readonly metadata: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly entries: AuditEntry[] = [];

  log(entry: AuditEntry): void {
    // Redact sensitive fields before logging
    const safe = { ...entry, metadata: redactSensitive(entry.metadata) };
    this.entries.push(safe);
  }

  getEntries(tenantId: string, limit: number = 100): AuditEntry[] {
    return this.entries.filter((e) => e.tenantId === tenantId).slice(-limit);
  }
}

const SENSITIVE_KEYS = [
  "password",
  "secret",
  "token",
  "ssn",
  "credit_card",
  "dnc",
  "passport",
  "hidden_prefix",
  "compiled_prompt",
  "provider_payload",
  "authorization",
  "cookie",
  "api_key",
  "mfa_code",
  "email",
  "phone",
  "address",
];

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => redactValue(item));
  if (typeof value === "object" && value !== null) {
    return redactSensitive(value as Record<string, unknown>);
  }
  return value;
}

export function redactSensitive(metadata: Record<string, unknown>): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      redacted[key] = "[REDACTED]";
    } else {
      redacted[key] = redactValue(value);
    }
  }
  return redacted;
}
