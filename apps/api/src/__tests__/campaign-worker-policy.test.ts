import { describe, expect, it } from "vitest";
import { createTestAuthContext } from "../auth/auth-context.interface.js";
import {
  CampaignWorkerPolicy,
  type CampaignComplianceFactsLoader,
} from "../campaigns/campaign-worker-policy.js";
import { ComplianceService } from "../compliance/compliance.service.js";

describe("campaign worker policy recheck", () => {
  it("reloads current facts and blocks a job after a later opt-out", async () => {
    let optedOut = false;
    const loader: CampaignComplianceFactsLoader = {
      loadCurrent: async () => ({
        channel: "email",
        contactId: "00000000-0000-4000-8000-000000000921",
        facts: {
          canEmail: true,
          canCall: false,
          canText: false,
          canDirectMail: false,
          callRecordingConsent: false,
          internalDnc: false,
          nationalDnc: false,
          optedOut,
          unsubscribed: false,
          isQuietHours: false,
          hasCallRecordingSetup: false,
          hasSmsSetup: false,
          isAiVoiceEnabled: false,
        },
      }),
    };
    const policy = new CampaignWorkerPolicy(new ComplianceService(), loader);
    const context = createTestAuthContext({ role: "manager" });

    await expect(policy.recheck(context, "campaign-synthetic")).resolves.toBeUndefined();
    optedOut = true;
    await expect(policy.recheck(context, "campaign-synthetic")).rejects.toThrow();
  });

  it("denies a worker context without current campaign permission before loading facts", async () => {
    let loads = 0;
    const policy = new CampaignWorkerPolicy(new ComplianceService(), {
      loadCurrent: async () => {
        loads += 1;
        throw new Error("should not load");
      },
    });
    await expect(
      policy.recheck(createTestAuthContext({ role: "viewer" }), "campaign-synthetic"),
    ).rejects.toThrow();
    expect(loads).toBe(0);
  });
});
