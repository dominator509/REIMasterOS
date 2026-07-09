import { describe, it, expect } from "vitest";
import { ErrorCodeSchema } from "../errors/error-codes.schema.js";
import { PropertyListQuerySchema } from "../api/property.api.schema.js";
import { LeadListQuerySchema } from "../api/lead.api.schema.js";
import { ComplianceCheckRequestSchema } from "../api/compliance.api.schema.js";
import { HealthResponseSchema } from "../api/health.api.schema.js";

describe("ErrorCodeSchema", () => {
  it("accepts valid error codes", () => {
    expect(ErrorCodeSchema.safeParse("NOT_FOUND").success).toBe(true);
    expect(ErrorCodeSchema.safeParse("COMPLIANCE_BLOCKED").success).toBe(true);
  });
  it("rejects invalid codes", () => {
    expect(ErrorCodeSchema.safeParse("INVALID_CODE").success).toBe(false);
  });
});

describe("PropertyListQuerySchema", () => {
  it("accepts default pagination", () => {
    const result = PropertyListQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("LeadListQuerySchema", () => {
  it("accepts status filter", () => {
    const result = LeadListQuerySchema.safeParse({ status: "new" });
    expect(result.success).toBe(true);
  });
});

describe("ComplianceCheckRequestSchema", () => {
  it("validates required fields", () => {
    const result = ComplianceCheckRequestSchema.safeParse({
      channel: "email",
      contactId: "00000000-0000-0000-0000-000000000001",
    });
    expect(result.success).toBe(true);
  });
});

describe("HealthResponseSchema", () => {
  it("validates health response shape", () => {
    const result = HealthResponseSchema.safeParse({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "0.0.0",
      services: {
        database: "connected",
        redis: "not_configured",
        search: "not_configured",
        storage: "not_configured",
      },
    });
    expect(result.success).toBe(true);
  });
});
