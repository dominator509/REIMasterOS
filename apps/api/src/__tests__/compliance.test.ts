import { describe, it, expect } from "vitest";
import { ComplianceController } from "../compliance/compliance.controller.js";
import { ComplianceService } from "../compliance/compliance.service.js";
import { createTestAuthContext } from "../auth/auth-context.interface.js";
import type { AuthenticatedRequest } from "../auth/request-context.js";

describe("ComplianceController", () => {
  const controller = new ComplianceController(new ComplianceService());
  const request = { authContext: createTestAuthContext() } as AuthenticatedRequest;

  it("returns needs_approval when consent facts are absent", () => {
    const result = controller.check(request, {
      channel: "email",
      contactId: "00000000-0000-0000-0000-000000000001",
    });
    expect(result.data.verdict).toBe("needs_approval");
  });

  it("returns blocked for deterministic suppression", () => {
    const result = controller.check(request, {
      channel: "email",
      contactId: "00000000-0000-0000-0000-000000000001",
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
    });
    expect(result.data.verdict).toBe("blocked");
    expect(result.data.reasonCodes).toContain("INTERNAL_DNC");
  });
});
