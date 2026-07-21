import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApprovalCreateRequestSchema,
  ApprovalDecisionRequestSchema,
  ApprovalListQuerySchema,
  type ApprovalCreateRequest,
  type ApprovalDecisionRequest,
  type ApprovalListQuery,
} from "@rei-os/contracts";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { ApprovalsService } from "./approvals.service.js";

@Controller("approvals")
@UseGuards(AuthGuard)
export class ApprovalsController {
  constructor(private readonly service: ApprovalsService) {}

  @Get()
  list(
    @Req() request: AuthenticatedRequest,
    @Query(new ZodValidationPipe(ApprovalListQuerySchema)) query: ApprovalListQuery,
  ) {
    return this.service.list(requireAuthContext(request), query);
  }

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(ApprovalCreateRequestSchema)) body: ApprovalCreateRequest,
  ) {
    return this.service.create(requireAuthContext(request), body);
  }

  @Patch(":id/decision")
  decide(
    @Req() request: AuthenticatedRequest,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(ApprovalDecisionRequestSchema)) body: ApprovalDecisionRequest,
  ) {
    return this.service.decide(requireAuthContext(request), id, body);
  }
}
