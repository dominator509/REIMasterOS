import { describe, expect, it } from "vitest";
import type { ApprovalResponse } from "@rei-os/contracts";
import { ActivityService } from "../activity/activity.service.js";
import { ApprovalsService } from "../approvals/approvals.service.js";
import { AuditService } from "../audit/audit.service.js";
import { createTestAuthContext } from "../auth/auth-context.interface.js";
import {
  assertHighRiskAction,
  type HighRiskAction,
} from "../auth/step-up/high-risk-action.policy.js";
import { DenyAllStepUpVerifier, LocalTestStepUpVerifier } from "../auth/step-up/step-up.service.js";

const BASE_TIME = Date.parse("2026-07-18T12:00:00.000Z");

function approval(
  action: HighRiskAction,
  overrides: Partial<ApprovalResponse> = {},
): ApprovalResponse {
  return {
    id: "00000000-0000-4000-8000-000000000801",
    tenantId: "00000000-0000-4000-8000-000000000002",
    action,
    status: "approved",
    requestedBy: "00000000-0000-4000-8000-000000000001",
    approvedBy: "00000000-0000-4000-8000-000000000001",
    evidenceRefs: ["synthetic:approval"],
    expiresAt: "2026-07-18T12:15:00.000Z",
    createdAt: "2026-07-18T12:00:00.000Z",
    updatedAt: "2026-07-18T12:00:01.000Z",
    ...overrides,
  };
}

describe("approval expiry and MFA step-up", () => {
  it("expires pending approvals and prevents later decisions", () => {
    let now = BASE_TIME;
    const activities = new ActivityService(new AuditService());
    const service = new ApprovalsService(activities, () => now);
    const context = createTestAuthContext({ isMfaVerified: true });
    const created = service.create(context, {
      action: "provider.credentials_change",
      evidenceRefs: ["synthetic:change-request"],
    });

    expect(Date.parse(created.data.expiresAt ?? "")).toBe(BASE_TIME + 15 * 60 * 1000);
    now += 16 * 60 * 1000;
    expect(service.getRecord(context, created.data.id)?.status).toBe("expired");
    expect(() =>
      service.decide(context, created.data.id, { decision: "approved", mfaVerified: true }),
    ).toThrow();
  });

  it("requires current tenant-matched approvals and MFA for named high-risk categories", () => {
    const context = createTestAuthContext({ isMfaVerified: true });
    const actions: readonly HighRiskAction[] = [
      "offer.send",
      "campaign.launch",
      "provider.credentials_change",
      "compliance.dnc_settings_change",
      "telegram.account_link",
    ];

    for (const action of actions) {
      expect(() =>
        assertHighRiskAction(context, action, approval(action), BASE_TIME),
      ).not.toThrow();
      expect(() =>
        assertHighRiskAction(context, action, approval(action, { status: "pending" }), BASE_TIME),
      ).toThrow();
    }
    expect(() =>
      assertHighRiskAction(
        createTestAuthContext({ isMfaVerified: false }),
        "offer.send",
        approval("offer.send"),
        BASE_TIME,
      ),
    ).toThrow();
    expect(() =>
      assertHighRiskAction(
        context,
        "telegram.account_link",
        approval("telegram.account_link", { expiresAt: "2026-07-18T11:59:59.000Z" }),
        BASE_TIME,
      ),
    ).toThrow();
  });

  it("keeps production-style step-up deny-all and limits the synthetic adapter to its session", async () => {
    const context = createTestAuthContext();
    const challenge = { sessionId: context.sessionId, code: "123456" };
    await expect(new DenyAllStepUpVerifier().verify(context, challenge)).resolves.toBe(false);
    const local = new LocalTestStepUpVerifier("123456");
    await expect(local.verify(context, challenge)).resolves.toBe(true);
    await expect(local.verify(context, { ...challenge, sessionId: "other" })).resolves.toBe(false);
    await expect(local.verify(context, { ...challenge, code: "000000" })).resolves.toBe(false);
  });
});
