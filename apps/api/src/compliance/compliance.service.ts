import { Injectable } from "@nestjs/common";
import type { ComplianceCheckRequest, ComplianceCheckResponse } from "@rei-os/contracts";
import { checkOutreachCompliance, PERMISSIONS } from "@rei-os/domain";
import type { AuthContext } from "../auth/auth-context.interface.js";
import { assertPermission } from "../auth/authorization.js";

const CONSERVATIVE_FACTS: NonNullable<ComplianceCheckRequest["facts"]> = {
  canEmail: false,
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
};

@Injectable()
export class ComplianceService {
  check(context: AuthContext, request: ComplianceCheckRequest): ComplianceCheckResponse {
    assertPermission(context, PERMISSIONS.COMPLIANCE_READ);
    const facts = request.facts ?? CONSERVATIVE_FACTS;
    const result = checkOutreachCompliance({
      channel: request.channel,
      consent: {
        canEmail: facts.canEmail,
        canCall: facts.canCall,
        canText: facts.canText,
        canDirectMail: facts.canDirectMail,
        callRecordingConsent: facts.callRecordingConsent,
        lastUpdated: new Date(facts.consentLastUpdated ?? 0),
      },
      suppression: {
        internalDnc: facts.internalDnc,
        nationalDnc: facts.nationalDnc,
        optedOut: facts.optedOut,
        unsubscribed: facts.unsubscribed,
      },
      isQuietHours: facts.isQuietHours,
      hasCallRecordingSetup: facts.hasCallRecordingSetup,
      hasSmsSetup: facts.hasSmsSetup,
      isAiVoiceEnabled: facts.isAiVoiceEnabled,
    });
    return {
      verdict: result.verdict,
      reasonCodes: [...result.reasonCodes],
      evidenceRefs: [...result.evidenceRefs],
      requiredApprovals: [...result.requiredApprovals],
      userMessage: messageFor(result.verdict),
    };
  }
}

function messageFor(verdict: ComplianceCheckResponse["verdict"]): string {
  if (verdict === "blocked") return "This action is blocked by outreach policy.";
  if (verdict === "needs_approval") return "This action requires approval before continuing.";
  return "This action is allowed by the current outreach policy.";
}
