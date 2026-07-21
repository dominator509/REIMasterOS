import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import {
  ImportCommitRequestSchema,
  ImportPreviewRequestSchema,
  type ImportCommitRequest,
  type ImportPreviewRequest,
} from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import { ActivityService } from "../activity/activity.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";
import { assertPermission } from "../auth/authorization.js";
import { successResponse } from "../common/response.envelope.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { InMemoryJobQueue } from "../jobs/in-memory-job-queue.service.js";

@Controller("imports")
@UseGuards(AuthGuard)
export class ImportsController {
  constructor(
    private readonly jobs: InMemoryJobQueue,
    private readonly activities: ActivityService,
  ) {}

  @Post("preview")
  async preview(
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(ImportPreviewRequestSchema)) body: ImportPreviewRequest,
  ) {
    const context = requireAuthContext(request);
    assertPermission(context, PERMISSIONS.IMPORT_DATA);
    const job = await this.jobs.enqueue({
      tenantId: context.tenantId,
      type: "import.preview",
      idempotencyKey: `preview:${body.artifactKey}`,
      payload: { artifactKey: body.artifactKey, format: body.format },
    });
    this.activities.record(context, {
      action: "import.preview_queued",
      targetType: "job",
      targetId: job.id,
    });
    return successResponse({ jobId: job.id, status: job.status }, { tenantId: context.tenantId });
  }

  @Post("commit")
  async commit(
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(ImportCommitRequestSchema)) body: ImportCommitRequest,
  ) {
    const context = requireAuthContext(request);
    assertPermission(context, PERMISSIONS.IMPORT_DATA);
    const job = await this.jobs.enqueue({
      tenantId: context.tenantId,
      type: "import.commit",
      idempotencyKey: `commit:${body.previewId}`,
      payload: { previewId: body.previewId },
    });
    this.activities.record(context, {
      action: "import.commit_queued",
      targetType: "job",
      targetId: job.id,
    });
    return successResponse({ jobId: job.id, status: job.status }, { tenantId: context.tenantId });
  }
}
