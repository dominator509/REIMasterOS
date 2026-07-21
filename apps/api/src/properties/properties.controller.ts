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
import { PropertiesService } from "./properties.service.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { PropertyCreateRequestSchema, PropertyListQuerySchema } from "@rei-os/contracts";
import type { PropertyCreateRequest, PropertyListQuery } from "@rei-os/contracts";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";

@Controller("properties")
@UseGuards(AuthGuard)
export class PropertiesController {
  constructor(private readonly service: PropertiesService) {}

  @Get()
  async list(
    @Req() request: AuthenticatedRequest,
    @Query(new ZodValidationPipe(PropertyListQuerySchema)) query: PropertyListQuery,
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
    @Body(new ZodValidationPipe(PropertyCreateRequestSchema)) body: PropertyCreateRequest,
  ) {
    return this.service.create(requireAuthContext(request), body);
  }
}
