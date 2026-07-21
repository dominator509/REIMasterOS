import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ActivityListQuerySchema, type ActivityListQuery } from "@rei-os/contracts";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { ActivityService } from "./activity.service.js";

@Controller("activities")
@UseGuards(AuthGuard)
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Get()
  list(
    @Req() request: AuthenticatedRequest,
    @Query(new ZodValidationPipe(ActivityListQuerySchema)) query: ActivityListQuery,
  ) {
    return this.service.list(requireAuthContext(request), query);
  }
}
