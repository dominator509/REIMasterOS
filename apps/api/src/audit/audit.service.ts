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

const SENSITIVE_KEYS = ["password", "secret", "token", "ssn", "credit_card", "dni", "passport"];

function redactSensitive(metadata: Record<string, unknown>): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      redacted[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      redacted[key] = redactSensitive(value as Record<string, unknown>);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}
