import { Body, Controller, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { AiChatRequestSchema, type AiChatRequest } from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import { ActivityService } from "../activity/activity.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";
import { assertPermission } from "../auth/authorization.js";
import { successResponse } from "../common/response.envelope.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { LLM_GATEWAY, type LlmGateway } from "./llm-gateway.interface.js";

@Controller("ai")
@UseGuards(AuthGuard)
export class AiChatController {
  constructor(
    @Inject(LLM_GATEWAY) private readonly gateway: LlmGateway,
    private readonly activities: ActivityService,
  ) {}

  @Post("chat")
  async chat(
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(AiChatRequestSchema)) body: AiChatRequest,
  ) {
    const context = requireAuthContext(request);
    assertPermission(context, PERMISSIONS.AI_QUERY);
    const response = await this.gateway.chat(context, body);
    this.activities.record(context, {
      action: "ai.chat_requested",
      targetType: "conversation",
      targetId: body.conversationId ?? "new",
      metadata: { routeStatus: response.status },
    });
    return successResponse(response, { tenantId: context.tenantId });
  }
}
