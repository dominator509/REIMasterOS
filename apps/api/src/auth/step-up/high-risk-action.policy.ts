import { ForbiddenException } from "@nestjs/common";
import type { ApprovalResponse } from "@rei-os/contracts";
import { errorResponse } from "../../common/response.envelope.js";
import type { AuthContext } from "../auth-context.interface.js";
import { assertMfa } from "../authorization.js";

export const HIGH_RISK_ACTIONS = [
  "offer.send",
  "offer.price_change",
  "offer.waive_contingency",
  "offer.commit_close_date",
  "offer.commit_seller_credit",
  "purchase_agreement.send",
  "campaign.launch",
  "campaign.cold_call_launch",
  "campaign.mass_outreach_launch",
  "provider.credentials_change",
  "compliance.dnc_settings_change",
  "telegram.account_link",
  "ai.outbound_voice_enable",
  "ai.hosted_enable",
] as const;

export type HighRiskAction = (typeof HIGH_RISK_ACTIONS)[number];

export function assertHighRiskAction(
  context: AuthContext,
  action: HighRiskAction,
  approval: ApprovalResponse | undefined,
  now = Date.now(),
): void {
  assertMfa(context);
  const expired = !approval?.expiresAt || Date.parse(approval.expiresAt) <= now;
  if (
    !approval ||
    approval.tenantId !== context.tenantId ||
    approval.action !== action ||
    approval.status !== "approved" ||
    expired
  ) {
    throw new ForbiddenException(
      errorResponse(
        "APPROVAL_REQUIRED",
        `A current approved ${action} record is required for this high-risk action.`,
      ),
    );
  }
}
