import type { ConsentState, SuppressionState } from "../value-objects/contact-point.js";
import type { CampaignChannel } from "../campaign/campaign.entity.js";

export type ComplianceVerdict = "allowed" | "blocked" | "needs_approval";

export interface ComplianceResult {
  readonly verdict: ComplianceVerdict;
  readonly reasonCodes: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly requiredApprovals: readonly string[];
}

export interface OutreachContext {
  readonly channel: CampaignChannel;
  readonly consent: ConsentState;
  readonly suppression: SuppressionState;
  readonly isQuietHours: boolean;
  readonly hasCallRecordingSetup: boolean;
  readonly hasSmsSetup: boolean;
  readonly isAiVoiceEnabled: boolean;
}

const QUIET_HOURS_START = 21; // 9 PM
const QUIET_HOURS_END = 8; // 8 AM

export function isQuietHours(hour: number, timezoneOffset?: number): boolean {
  const localHour = timezoneOffset ? (hour + timezoneOffset + 24) % 24 : hour;
  return localHour >= QUIET_HOURS_START || localHour < QUIET_HOURS_END;
}

export function checkOutreachCompliance(ctx: OutreachContext): ComplianceResult {
  const reasons: string[] = [];
  const evidence: string[] = [];
  const approvals: string[] = [];

  // DNC checks — block immediately
  if (ctx.suppression.internalDnc) {
    reasons.push("INTERNAL_DNC");
    evidence.push("internal_dnc_list");
    return {
      verdict: "blocked",
      reasonCodes: reasons,
      evidenceRefs: evidence,
      requiredApprovals: [],
    };
  }
  if (ctx.suppression.nationalDnc) {
    reasons.push("NATIONAL_DNC");
    evidence.push("national_dnc_registry");
    return {
      verdict: "blocked",
      reasonCodes: reasons,
      evidenceRefs: evidence,
      requiredApprovals: [],
    };
  }
  if (ctx.suppression.optedOut) {
    reasons.push("CONTACT_OPTED_OUT");
    evidence.push("opt_out_record");
    return {
      verdict: "blocked",
      reasonCodes: reasons,
      evidenceRefs: evidence,
      requiredApprovals: [],
    };
  }
  if (ctx.suppression.unsubscribed && ctx.channel === "email") {
    reasons.push("UNSUBSCRIBED");
    evidence.push("unsubscribe_record");
    return {
      verdict: "blocked",
      reasonCodes: reasons,
      evidenceRefs: evidence,
      requiredApprovals: [],
    };
  }

  // Channel-specific consent checks
  switch (ctx.channel) {
    case "email":
      if (!ctx.consent.canEmail) {
        reasons.push("MISSING_EMAIL_CONSENT");
        approvals.push("email_consent_override");
      }
      break;
    case "voice":
    case "ringless_voicemail":
      if (!ctx.consent.canCall) {
        reasons.push("MISSING_CALL_CONSENT");
        approvals.push("call_consent_override");
      }
      if (!ctx.consent.callRecordingConsent) {
        reasons.push("MISSING_CALL_RECORDING_CONSENT");
        evidence.push("call_recording_policy");
        approvals.push("call_recording_consent");
      }
      if (!ctx.hasCallRecordingSetup) {
        reasons.push("CALL_RECORDING_NOT_CONFIGURED");
        approvals.push("call_recording_setup");
      }
      if (ctx.isAiVoiceEnabled) {
        reasons.push("AI_VOICE_BLOCKED");
        return {
          verdict: "blocked",
          reasonCodes: reasons,
          evidenceRefs: evidence,
          requiredApprovals: approvals,
        };
      }
      break;
    case "sms":
      if (!ctx.consent.canText) {
        reasons.push("MISSING_SMS_CONSENT");
        approvals.push("sms_consent_override");
      }
      if (!ctx.hasSmsSetup) {
        reasons.push("SMS_NOT_CONFIGURED");
        approvals.push("sms_setup");
      }
      break;
    case "direct_mail":
      if (!ctx.consent.canDirectMail) {
        reasons.push("MISSING_DIRECT_MAIL_CONSENT");
        approvals.push("direct_mail_consent_override");
      }
      break;
  }

  // Quiet hours
  if (
    ctx.isQuietHours &&
    (ctx.channel === "voice" || ctx.channel === "ringless_voicemail" || ctx.channel === "sms")
  ) {
    reasons.push("QUIET_HOURS");
    evidence.push("quiet_hours_policy");
    return {
      verdict: "blocked",
      reasonCodes: reasons,
      evidenceRefs: evidence,
      requiredApprovals: approvals,
    };
  }

  if (approvals.length > 0) {
    return {
      verdict: "needs_approval",
      reasonCodes: reasons,
      evidenceRefs: evidence,
      requiredApprovals: approvals,
    };
  }

  return { verdict: "allowed", reasonCodes: [], evidenceRefs: evidence, requiredApprovals: [] };
}

/** High-risk action classification — deterministic, not model-based. */
export type HighRiskAction =
  | "binding_offer_submission"
  | "contract_execution"
  | "earnest_money_release"
  | "deed_transfer"
  | "ai_voice_outbound"
  | "bulk_sms_send"
  | "data_export_pii"
  | "skip_trace_request"
  | "mls_data_access";

export function classifyAction(action: string): HighRiskAction | null {
  const map: Record<string, HighRiskAction> = {
    submit_binding_offer: "binding_offer_submission",
    execute_contract: "contract_execution",
    release_earnest_money: "earnest_money_release",
    transfer_deed: "deed_transfer",
    ai_voice_outbound: "ai_voice_outbound",
    bulk_sms_send: "bulk_sms_send",
    export_pii_data: "data_export_pii",
    skip_trace: "skip_trace_request",
    access_mls: "mls_data_access",
  };
  return map[action] ?? null;
}
