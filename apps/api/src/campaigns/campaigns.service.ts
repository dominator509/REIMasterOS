import { ForbiddenException, Injectable } from "@nestjs/common";
import type { CampaignLaunchRequest } from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import { ActivityService } from "../activity/activity.service.js";
import { ApprovalsService } from "../approvals/approvals.service.js";
import type { AuthContext } from "../auth/auth-context.interface.js";
import { assertPermission } from "../auth/authorization.js";
import { assertHighRiskAction } from "../auth/step-up/high-risk-action.policy.js";
import { errorResponse, successResponse } from "../common/response.envelope.js";
import { ComplianceService } from "../compliance/compliance.service.js";
import { InMemoryJobQueue } from "../jobs/in-memory-job-queue.service.js";

@Injectable()
export class CampaignsService {
  constructor(
    private readonly compliance: ComplianceService,
    private readonly approvals: ApprovalsService,
    private readonly jobs: InMemoryJobQueue,
    private readonly activities: ActivityService,
  ) {}

  async launch(context: AuthContext, campaignId: string, request: CampaignLaunchRequest) {
    assertPermission(context, PERMISSIONS.CAMPAIGN_LAUNCH);
    const verdict = this.compliance.check(context, request.compliance);
    if (verdict.verdict === "blocked") {
      this.activities.record(context, {
        action: "campaign.launch_blocked",
        targetType: "campaign",
        targetId: campaignId,
        metadata: { reasonCodes: verdict.reasonCodes },
      });
      throw new ForbiddenException(
        errorResponse(
          "COMPLIANCE_BLOCKED",
          verdict.userMessage,
          verdict.reasonCodes.map((code) => ({ code, message: code })),
        ),
      );
    }

    const approval = request.approvalId
      ? this.approvals.getRecord(context, request.approvalId)
      : undefined;
    if (!approval) {
      throw new ForbiddenException(
        errorResponse(
          "APPROVAL_REQUIRED",
          verdict.verdict === "needs_approval"
            ? verdict.userMessage
            : "Campaign launch requires an approved campaign.launch record.",
          verdict.reasonCodes.map((code) => ({ code, message: code })),
        ),
      );
    }
    assertHighRiskAction(context, "campaign.launch", approval);
    const job = await this.jobs.enqueue({
      tenantId: context.tenantId,
      type: "campaign.launch",
      idempotencyKey: `campaign-launch:${campaignId}`,
      payload: { campaignId, channel: request.compliance.channel },
    });
    this.activities.record(context, {
      action: "campaign.launch_queued",
      targetType: "campaign",
      targetId: campaignId,
      metadata: { jobId: job.id, channel: request.compliance.channel },
    });
    return successResponse(
      { campaignId, jobId: job.id, status: job.status },
      { tenantId: context.tenantId },
    );
  }
}
