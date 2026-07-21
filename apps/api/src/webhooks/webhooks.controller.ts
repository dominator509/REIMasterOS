import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Headers,
  Inject,
  Param,
  Post,
} from "@nestjs/common";
import { createHash } from "node:crypto";
import { errorResponse, successResponse } from "../common/response.envelope.js";
import { InMemoryJobQueue } from "../jobs/in-memory-job-queue.service.js";
import {
  WEBHOOK_SIGNATURE_VERIFIER,
  type WebhookSignatureVerifier,
} from "./webhook-signature.interface.js";

@Controller("webhooks")
export class WebhooksController {
  constructor(
    @Inject(WEBHOOK_SIGNATURE_VERIFIER) private readonly verifier: WebhookSignatureVerifier,
    private readonly jobs: InMemoryJobQueue,
  ) {}

  @Post(":provider")
  async receive(
    @Param("provider") provider: string,
    @Headers("x-provider-signature") signature: string | undefined,
    @Headers("x-rei-tenant-id") tenantId: string | undefined,
    @Body() payload: unknown,
  ) {
    if (!/^[a-z0-9_-]{1,64}$/u.test(provider)) {
      throw new BadRequestException(
        errorResponse("VALIDATION_FAILED", "Webhook provider is invalid."),
      );
    }
    if (!tenantId || !(await this.verifier.verify({ provider, signature, tenantId, payload }))) {
      throw new ForbiddenException(errorResponse("FORBIDDEN", "Webhook signature rejected."));
    }
    const payloadHash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    const job = await this.jobs.enqueue({
      tenantId,
      type: "webhook.process",
      idempotencyKey: `webhook:${provider}:${payloadHash}`,
      payload: { provider, payloadHash },
    });
    return successResponse({ accepted: true, jobId: job.id }, { tenantId });
  }
}
