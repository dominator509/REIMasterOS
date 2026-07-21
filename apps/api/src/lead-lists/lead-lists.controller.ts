import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  LeadListCollectionQuerySchema,
  LeadListCreateRequestSchema,
  type LeadListCollectionQuery,
  type LeadListCreateRequest,
} from "@rei-os/contracts";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { LeadListsService } from "./lead-lists.service.js";

@Controller("lead-lists")
@UseGuards(AuthGuard)
export class LeadListsController {
  constructor(private readonly service: LeadListsService) {}

  @Get()
  list(
    @Req() request: AuthenticatedRequest,
    @Query(new ZodValidationPipe(LeadListCollectionQuerySchema)) query: LeadListCollectionQuery,
  ) {
    return this.service.list(requireAuthContext(request), query);
  }

  @Get(":id")
  get(@Req() request: AuthenticatedRequest, @Param("id", new ParseUUIDPipe()) id: string) {
    return this.service.get(requireAuthContext(request), id);
  }

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(LeadListCreateRequestSchema)) body: LeadListCreateRequest,
  ) {
    return this.service.create(requireAuthContext(request), body);
  }
}
