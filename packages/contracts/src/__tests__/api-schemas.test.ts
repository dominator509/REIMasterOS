import { describe, it, expect } from "vitest";
import { ErrorCodeSchema } from "../errors/error-codes.schema.js";
import { PropertyListQuerySchema } from "../api/property.api.schema.js";
import { LeadListQuerySchema } from "../api/lead.api.schema.js";
import { ComplianceCheckRequestSchema } from "../api/compliance.api.schema.js";
import { HealthResponseSchema } from "../api/health.api.schema.js";
import {
  ActivityEventResponseSchema,
  AiChatRequestSchema,
  ApiErrorEnvelopeSchema,
  ApiResponseEnvelopeSchema,
  ApprovalDecisionRequestSchema,
  ExportRequestSchema,
  ImportPreviewRequestSchema,
  LeadListCreateRequestSchema,
  ProviderHealthResponseSchema,
  PropertyCreateRequestSchema,
  TaskCreateRequestSchema,
} from "../api/index.js";
import { z } from "zod";

describe("ErrorCodeSchema", () => {
  it("accepts valid error codes", () => {
    expect(ErrorCodeSchema.safeParse("NOT_FOUND").success).toBe(true);
    expect(ErrorCodeSchema.safeParse("COMPLIANCE_BLOCKED").success).toBe(true);
    expect(ErrorCodeSchema.safeParse("VALIDATION_FAILED").success).toBe(true);
  });
  it("rejects invalid codes", () => {
    expect(ErrorCodeSchema.safeParse("INVALID_CODE").success).toBe(false);
  });
});

describe("standard API envelopes", () => {
  it("validates the spec success envelope", () => {
    expect(
      ApiResponseEnvelopeSchema(z.object({ id: z.string() })).safeParse({
        data: { id: "record-1" },
        meta: { requestId: "req-1", tenantId: "tenant-1" },
      }).success,
    ).toBe(true);
  });

  it("validates stable error taxonomy and structured details", () => {
    expect(
      ApiErrorEnvelopeSchema.safeParse({
        error: {
          code: "VALIDATION_FAILED",
          message: "The request is invalid.",
          details: [{ field: "name", message: "Required" }],
        },
        meta: { requestId: "req-1" },
      }).success,
    ).toBe(true);
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

describe("EP-004 workflow contracts", () => {
  it("validates lead-list, task, activity, approval, provider, AI, import, and export shapes", () => {
    expect(LeadListCreateRequestSchema.safeParse({ name: "Synthetic List" }).success).toBe(true);
    expect(TaskCreateRequestSchema.safeParse({ title: "Review synthetic lead" }).success).toBe(
      true,
    );
    expect(
      ActivityEventResponseSchema.safeParse({
        id: "00000000-0000-4000-8000-000000000001",
        tenantId: "tenant-1",
        actorId: "user-1",
        action: "task.created",
        targetType: "task",
        targetId: "00000000-0000-4000-8000-000000000002",
        metadata: {},
        timestamp: "2026-07-18T12:00:00.000Z",
      }).success,
    ).toBe(true);
    expect(
      ApprovalDecisionRequestSchema.safeParse({ decision: "approved", mfaVerified: true }).success,
    ).toBe(true);
    expect(
      ProviderHealthResponseSchema.safeParse({
        provider: "smtp",
        category: "email",
        status: "not_configured",
        fallback: "manual_export",
        checkedAt: "2026-07-18T12:00:00.000Z",
      }).success,
    ).toBe(true);
    expect(AiChatRequestSchema.safeParse({ message: "Summarize the synthetic lead" }).success).toBe(
      true,
    );
    expect(
      ImportPreviewRequestSchema.safeParse({ artifactKey: "tenant/import.csv", format: "csv" })
        .success,
    ).toBe(true);
    expect(
      ExportRequestSchema.safeParse({
        format: "csv",
        entityType: "properties",
        entityIds: ["00000000-0000-4000-8000-000000000001"],
      }).success,
    ).toBe(true);
  });

  it("rejects approval without MFA and tenant IDs supplied by clients", () => {
    expect(
      ApprovalDecisionRequestSchema.safeParse({ decision: "approved", mfaVerified: false }).success,
    ).toBe(false);
    expect(
      PropertyCreateRequestSchema.safeParse({
        tenantId: "00000000-0000-4000-8000-000000000099",
        address: { street: "123 Synthetic", city: "Austin", state: "TX", zip: "78701" },
        characteristics: { propertyType: "single_family" },
      }).success,
    ).toBe(false);
  });
});
