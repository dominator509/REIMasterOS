import { Body, Controller, Param, ParseUUIDPipe, Post, Req, UseGuards } from "@nestjs/common";
import { CampaignLaunchRequestSchema, type CampaignLaunchRequest } from "@rei-os/contracts";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { CampaignsService } from "./campaigns.service.js";

@Controller("campaigns")
@UseGuards(AuthGuard)
export class CampaignsController {
  constructor(private readonly service: CampaignsService) {}

  @Post(":id/launch")
  launch(
    @Req() request: AuthenticatedRequest,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(CampaignLaunchRequestSchema)) body: CampaignLaunchRequest,
  ) {
    return this.service.launch(requireAuthContext(request), id, body);
  }
}
