import type { StructuredLog } from "@rei-os/observability";
import { describe, expect, it } from "vitest";
import { createApiStructuredLogger } from "../observability/api-logger.js";

describe("API structured logger boundary", () => {
  it("fixes the service identity and sanitizes boundary metadata", () => {
    const entries: StructuredLog[] = [];
    const logger = createApiStructuredLogger({
      environment: "test",
      version: "synthetic-version",
      now: () => new Date("2026-07-18T00:00:00.000Z"),
      sink: (entry) => entries.push(entry),
    });

    logger.info("api.request.completed", {
      operation: "contacts.list",
      status: "ok",
      requestId: "request-synthetic",
      tenantId: "tenant-synthetic",
      authorization: "Bearer must-not-leak",
    });

    expect(entries[0]).toMatchObject({
      service: "api",
      environment: "test",
      operation: "contacts.list",
      request_id: "request-synthetic",
      tenant_id: "tenant-synthetic",
      context: { authorization: "[REDACTED]" },
    });
    expect(JSON.stringify(entries[0])).not.toContain("must-not-leak");
  });
});
