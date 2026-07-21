import { describe, expect, it } from "vitest";
import { Test } from "@nestjs/testing";
import type { ExecutionContext } from "@nestjs/common";
import { AppModule } from "../app.module.js";
import { ActivityService } from "../activity/activity.service.js";
import { ApprovalsService } from "../approvals/approvals.service.js";
import { AuditService } from "../audit/audit.service.js";
import { createTestAuthContext } from "../auth/auth-context.interface.js";
import { AuthGuard, type RequestWithAuthContext } from "../auth/auth.guard.js";
import { CampaignsService } from "../campaigns/campaigns.service.js";
import { ComplianceService } from "../compliance/compliance.service.js";
import { InMemoryJobQueue } from "../jobs/in-memory-job-queue.service.js";
import { TasksService } from "../tasks/tasks.service.js";
import { WebhooksController } from "../webhooks/webhooks.controller.js";
import type { WebhookSignatureVerifier } from "../webhooks/webhook-signature.interface.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { TaskCreateRequestSchema } from "@rei-os/contracts";
import { PropertiesService } from "../properties/properties.service.js";
import { assertPermission } from "../auth/authorization.js";
import { PERMISSIONS } from "@rei-os/domain";

function executionContext(request: RequestWithAuthContext): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

function exceptionCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("getResponse" in error)) return undefined;
  const response = (error as { getResponse(): unknown }).getResponse();
  if (!response || typeof response !== "object" || !("error" in response)) return undefined;
  return (response as { error?: { code?: string } }).error?.code;
}

async function expectRejectCode(promise: Promise<unknown>, code: string): Promise<void> {
  try {
    await promise;
    throw new Error(`Expected rejection with ${code}`);
  } catch (error) {
    expect(exceptionCode(error)).toBe(code);
  }
}

describe("EP-004 service boundaries", () => {
  it("compiles the full Nest module graph", async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    await module.close();
  });

  it("fails closed when auth context is absent and accepts an existing context", () => {
    const guard = new AuthGuard();
    expect(() => guard.canActivate(executionContext({}))).toThrow();
    expect(guard.canActivate(executionContext({ authContext: createTestAuthContext() }))).toBe(
      true,
    );
  });

  it("fails closed for missing tenant context and delegated permission restrictions", () => {
    const guard = new AuthGuard();
    const missingTenant = createTestAuthContext({ tenantId: "" as never });
    expect(() => guard.canActivate(executionContext({ authContext: missingTenant }))).toThrow();

    const delegated = createTestAuthContext({ delegatedPermissions: [] });
    expect(() => assertPermission(delegated, PERMISSIONS.PROPERTY_READ)).toThrow();
    expect(() =>
      assertPermission(
        createTestAuthContext({ delegatedPermissions: [PERMISSIONS.PROPERTY_READ] }),
        PERMISSIONS.PROPERTY_READ,
      ),
    ).not.toThrow();
  });

  it("returns the stable validation error envelope", () => {
    const pipe = new ZodValidationPipe(TaskCreateRequestSchema);
    try {
      pipe.transform({ title: "" });
      throw new Error("validation should have failed");
    } catch (error) {
      expect(exceptionCode(error)).toBe("VALIDATION_FAILED");
    }
  });

  it("creates tenant-scoped tasks and writes redacted activity", () => {
    const audit = new AuditService();
    const activities = new ActivityService(audit);
    const tasks = new TasksService(activities);
    const context = createTestAuthContext();
    const created = tasks.create(context, {
      title: "Synthetic task",
      description: "",
      priority: "medium",
    });

    expect(created.data.tenantId).toBe(context.tenantId);
    activities.record(context, {
      action: "test.redaction",
      targetType: "task",
      targetId: created.data.id,
      metadata: { hidden_prefix: "must-not-leak", safe: "visible" },
    });
    const events = activities.list(context, { page: 1, limit: 20 });
    expect(events.data.items).toHaveLength(2);
    expect(events.data.items[1]?.metadata.hidden_prefix).toBe("[REDACTED]");
    expect(audit.getEntries(context.tenantId)).toHaveLength(2);
  });

  it("does not return a record through another tenant context", async () => {
    const activities = new ActivityService(new AuditService());
    const properties = new PropertiesService(activities);
    const owner = createTestAuthContext();
    const other = createTestAuthContext({
      tenantId: "00000000-0000-4000-8000-000000000099" as typeof owner.tenantId,
    });
    const created = await properties.create(owner, {
      address: { street: "123 Synthetic", city: "Austin", state: "TX", zip: "78701" },
      characteristics: { propertyType: "single_family" },
    });
    await expect(properties.getById(other, created.data.id)).rejects.toThrow();
  });

  it("blocks a suppressed campaign and requires approval for an incomplete one", async () => {
    const activities = new ActivityService(new AuditService());
    const approvals = new ApprovalsService(activities);
    const jobs = new InMemoryJobQueue();
    const campaigns = new CampaignsService(new ComplianceService(), approvals, jobs, activities);
    const context = createTestAuthContext({ isMfaVerified: true });
    const campaignId = "00000000-0000-4000-8000-000000000010";
    const contactId = "00000000-0000-4000-8000-000000000011";

    await expectRejectCode(
      campaigns.launch(context, campaignId, {
        compliance: {
          channel: "email",
          contactId,
          facts: {
            canEmail: true,
            canCall: false,
            canText: false,
            canDirectMail: false,
            callRecordingConsent: false,
            internalDnc: true,
            nationalDnc: false,
            optedOut: false,
            unsubscribed: false,
            isQuietHours: false,
            hasCallRecordingSetup: false,
            hasSmsSetup: false,
            isAiVoiceEnabled: false,
          },
        },
      }),
      "COMPLIANCE_BLOCKED",
    );

    await expectRejectCode(
      campaigns.launch(context, campaignId, {
        compliance: { channel: "email", contactId },
      }),
      "APPROVAL_REQUIRED",
    );
    expect(jobs.listForTenant(context.tenantId)).toHaveLength(0);
  });

  it("queues an allowed campaign only after MFA and deduplicates the async job", async () => {
    const activities = new ActivityService(new AuditService());
    const jobs = new InMemoryJobQueue();
    const approvals = new ApprovalsService(activities);
    const campaigns = new CampaignsService(new ComplianceService(), approvals, jobs, activities);
    const noMfa = createTestAuthContext({ isMfaVerified: false });
    const withMfa = createTestAuthContext({ isMfaVerified: true });
    const campaignId = "00000000-0000-4000-8000-000000000020";
    const approval = approvals.create(withMfa, {
      action: "campaign.launch",
      evidenceRefs: ["synthetic:test-approval"],
    });
    approvals.decide(withMfa, approval.data.id, {
      decision: "approved",
      mfaVerified: true,
    });
    const request = {
      approvalId: approval.data.id,
      compliance: {
        channel: "email" as const,
        contactId: "00000000-0000-4000-8000-000000000021",
        facts: {
          canEmail: true,
          canCall: false,
          canText: false,
          canDirectMail: false,
          callRecordingConsent: false,
          internalDnc: false,
          nationalDnc: false,
          optedOut: false,
          unsubscribed: false,
          isQuietHours: false,
          hasCallRecordingSetup: false,
          hasSmsSetup: false,
          isAiVoiceEnabled: false,
        },
      },
    };

    await expectRejectCode(campaigns.launch(noMfa, campaignId, request), "APPROVAL_REQUIRED");
    const first = await campaigns.launch(withMfa, campaignId, request);
    const second = await campaigns.launch(withMfa, campaignId, request);
    expect(first.data.jobId).toBe(second.data.jobId);
    expect(jobs.listForTenant(withMfa.tenantId)).toHaveLength(1);
  });

  it("rejects unsigned webhooks and queues only verified payload hashes", async () => {
    const jobs = new InMemoryJobQueue();
    const rejectVerifier: WebhookSignatureVerifier = { verify: async () => false };
    const acceptVerifier: WebhookSignatureVerifier = { verify: async () => true };
    const rejected = new WebhooksController(rejectVerifier, jobs);
    await expectRejectCode(
      rejected.receive("INVALID PROVIDER", "signature", "tenant-1", { event: "delivered" }),
      "VALIDATION_FAILED",
    );
    await expectRejectCode(
      rejected.receive("smtp", undefined, "tenant-1", { event: "delivered" }),
      "FORBIDDEN",
    );

    const accepted = new WebhooksController(acceptVerifier, jobs);
    const response = await accepted.receive("smtp", "valid", "tenant-1", {
      event: "delivered",
    });
    expect(response.data.accepted).toBe(true);
    expect(jobs.listForTenant("tenant-1")[0]?.payload).toHaveProperty("payloadHash");
    expect(jobs.listForTenant("tenant-1")[0]?.payload).not.toHaveProperty("event");
  });
});
