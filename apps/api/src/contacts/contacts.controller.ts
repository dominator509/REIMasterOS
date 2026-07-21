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
import { ContactsService } from "./contacts.service.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { ContactCreateRequestSchema, ContactListQuerySchema } from "@rei-os/contracts";
import type { ContactCreateRequest, ContactListQuery } from "@rei-os/contracts";
import { AuthGuard } from "../auth/auth.guard.js";
import { requireAuthContext, type AuthenticatedRequest } from "../auth/request-context.js";

@Controller("contacts")
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly service: ContactsService) {}

  @Get()
  async list(
    @Req() request: AuthenticatedRequest,
    @Query(new ZodValidationPipe(ContactListQuerySchema)) query: ContactListQuery,
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
    @Body(new ZodValidationPipe(ContactCreateRequestSchema)) body: ContactCreateRequest,
  ) {
    return this.service.create(requireAuthContext(request), body);
  }
}
