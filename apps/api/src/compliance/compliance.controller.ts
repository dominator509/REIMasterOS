import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { ComplianceCheckRequestSchema } from "@rei-os/contracts";
import type { ComplianceCheckRequest } from "@rei-os/contracts";
import { successResponse } from "../common/response.envelope.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";
import { ComplianceService } from "./compliance.service.js";

@Controller("compliance")
@UseGuards(AuthGuard)
export class ComplianceController {
  constructor(private readonly service: ComplianceService) {}

  @Post("check")
  check(
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(ComplianceCheckRequestSchema)) body: ComplianceCheckRequest,
  ) {
    const context = requireAuthContext(request);
    return successResponse(this.service.check(context, body), { tenantId: context.tenantId });
  }
}
