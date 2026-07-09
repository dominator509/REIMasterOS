import type { HighRiskAction } from "./compliance.js";

export interface ApprovalRequirement {
  readonly action: HighRiskAction;
  readonly requiresMfa: boolean;
  readonly requiresAdminApproval: boolean;
  readonly requiresComplianceReview: boolean;
  readonly requiresLegalReview: boolean;
  readonly maxAutoApprovalAmountCents?: number;
}

const APPROVAL_MATRIX: Record<HighRiskAction, ApprovalRequirement> = {
  binding_offer_submission: {
    action: "binding_offer_submission",
    requiresMfa: true,
    requiresAdminApproval: false,
    requiresComplianceReview: false,
    requiresLegalReview: false,
    maxAutoApprovalAmountCents: 100_000_00, // $100k
  },
  contract_execution: {
    action: "contract_execution",
    requiresMfa: true,
    requiresAdminApproval: true,
    requiresComplianceReview: false,
    requiresLegalReview: true,
  },
  earnest_money_release: {
    action: "earnest_money_release",
    requiresMfa: true,
    requiresAdminApproval: true,
    requiresComplianceReview: false,
    requiresLegalReview: false,
  },
  deed_transfer: {
    action: "deed_transfer",
    requiresMfa: true,
    requiresAdminApproval: true,
    requiresComplianceReview: true,
    requiresLegalReview: true,
  },
  ai_voice_outbound: {
    action: "ai_voice_outbound",
    requiresMfa: true,
    requiresAdminApproval: true,
    requiresComplianceReview: true,
    requiresLegalReview: true,
  }, // Default locked
  bulk_sms_send: {
    action: "bulk_sms_send",
    requiresMfa: true,
    requiresAdminApproval: true,
    requiresComplianceReview: true,
    requiresLegalReview: false,
  },
  data_export_pii: {
    action: "data_export_pii",
    requiresMfa: true,
    requiresAdminApproval: true,
    requiresComplianceReview: true,
    requiresLegalReview: false,
  },
  skip_trace_request: {
    action: "skip_trace_request",
    requiresMfa: true,
    requiresAdminApproval: false,
    requiresComplianceReview: true,
    requiresLegalReview: false,
  },
  mls_data_access: {
    action: "mls_data_access",
    requiresMfa: true,
    requiresAdminApproval: true,
    requiresComplianceReview: true,
    requiresLegalReview: false,
  },
};

export function getApprovalRequirements(action: HighRiskAction): ApprovalRequirement {
  return APPROVAL_MATRIX[action];
}

export function needsApproval(action: HighRiskAction, amountCents?: number): boolean {
  const req = APPROVAL_MATRIX[action];
  if (!req) return true;
  if (req.requiresAdminApproval || req.requiresComplianceReview || req.requiresLegalReview)
    return true;
  if (req.maxAutoApprovalAmountCents !== undefined && amountCents !== undefined) {
    return amountCents > req.maxAutoApprovalAmountCents;
  }
  return false;
}

export function requiresMfa(action: HighRiskAction): boolean {
  return APPROVAL_MATRIX[action]?.requiresMfa ?? true;
}
