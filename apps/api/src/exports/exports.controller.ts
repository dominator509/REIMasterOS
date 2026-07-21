import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ExportRequestSchema, type ExportRequest } from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import { ActivityService } from "../activity/activity.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";
import { assertPermission } from "../auth/authorization.js";
import { successResponse } from "../common/response.envelope.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { InMemoryJobQueue } from "../jobs/in-memory-job-queue.service.js";

@Controller("exports")
@UseGuards(AuthGuard)
export class ExportsController {
  constructor(
    private readonly jobs: InMemoryJobQueue,
    private readonly activities: ActivityService,
  ) {}

  @Post()
  async create(
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(ExportRequestSchema)) body: ExportRequest,
  ) {
    const context = requireAuthContext(request);
    assertPermission(context, PERMISSIONS.EXPORT_DATA);
    const job = await this.jobs.enqueue({
      tenantId: context.tenantId,
      type: "export.create",
      idempotencyKey: `export:${body.entityType}:${body.format}:${[...body.entityIds].sort().join(",")}`,
      payload: { format: body.format, entityType: body.entityType, entityIds: body.entityIds },
    });
    this.activities.record(context, {
      action: "export.queued",
      targetType: "job",
      targetId: job.id,
      metadata: { format: body.format, entityType: body.entityType },
    });
    return successResponse({ jobId: job.id, status: job.status }, { tenantId: context.tenantId });
  }
}
