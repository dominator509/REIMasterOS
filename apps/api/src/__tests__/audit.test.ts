import { describe, it, expect } from "vitest";
import { AuditService } from "../audit/audit.service.js";

describe("AuditService", () => {
  it("logs and retrieves entries", () => {
    const svc = new AuditService();
    svc.log({
      timestamp: new Date().toISOString(),
      action: "test",
      actorId: "u-1",
      tenantId: "t-1",
      targetType: "property",
      targetId: "p-1",
      metadata: {},
    });
    expect(svc.getEntries("t-1")).toHaveLength(1);
  });
  it("redacts sensitive metadata", () => {
    const svc = new AuditService();
    svc.log({
      timestamp: new Date().toISOString(),
      action: "login",
      actorId: "u-1",
      tenantId: "t-1",
      targetType: "session",
      targetId: "s-1",
      metadata: { password: "secret123", email: "user@test.com" },
    });
    const entries = svc.getEntries("t-1");
    expect(entries[0]?.metadata.password).toBe("[REDACTED]");
    expect(entries[0]?.metadata.email).toBe("user@test.com");
  });
});
