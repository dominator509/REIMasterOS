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
import { LeadsService } from "./leads.service.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { LeadCreateRequestSchema, LeadListQuerySchema } from "@rei-os/contracts";
import type { LeadCreateRequest, LeadListQuery } from "@rei-os/contracts";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";

@Controller("leads")
@UseGuards(AuthGuard)
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Get()
  async list(
    @Req() request: AuthenticatedRequest,
    @Query(new ZodValidationPipe(LeadListQuerySchema)) query: LeadListQuery,
  ) {
    return this.service.list(requireAuthContext(request), query);
  }

  @Get(":id")
  async get(@Req() request: AuthenticatedRequest, @Param("id", new ParseUUIDPipe()) id: string) {
    return this.service.getById(requireAuthContext(request), id);
  }

  @Post()
  async create(
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(LeadCreateRequestSchema)) body: LeadCreateRequest,
  ) {
    return this.service.create(requireAuthContext(request), body);
  }
}
