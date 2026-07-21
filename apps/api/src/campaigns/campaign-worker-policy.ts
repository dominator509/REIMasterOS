import { ForbiddenException } from "@nestjs/common";
import type { ComplianceCheckRequest } from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import type { AuthContext } from "../auth/auth-context.interface.js";
import { assertPermission } from "../auth/authorization.js";
import { errorResponse } from "../common/response.envelope.js";
import { ComplianceService } from "../compliance/compliance.service.js";

export interface CampaignComplianceFactsLoader {
  loadCurrent(tenantId: string, campaignId: string): Promise<ComplianceCheckRequest>;
}

/** Policy seam for a future worker; it performs no send or provider call. */
export class CampaignWorkerPolicy {
  constructor(
    private readonly compliance: ComplianceService,
    private readonly facts: CampaignComplianceFactsLoader,
  ) {}

  async recheck(context: AuthContext, campaignId: string): Promise<void> {
    assertPermission(context, PERMISSIONS.CAMPAIGN_LAUNCH);
    const current = await this.facts.loadCurrent(context.tenantId, campaignId);
    const verdict = this.compliance.check(context, current);
    if (verdict.verdict !== "allowed") {
      throw new ForbiddenException(
        errorResponse(
          verdict.verdict === "blocked" ? "COMPLIANCE_BLOCKED" : "APPROVAL_REQUIRED",
          "Current outreach policy no longer permits this queued side effect.",
          verdict.reasonCodes.map((code) => ({ code, message: code })),
        ),
      );
    }
  }
}
