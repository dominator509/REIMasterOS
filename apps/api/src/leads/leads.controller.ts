import { Controller, Get, Post, Param, Query, Body } from "@nestjs/common";
import { LeadsService } from "./leads.service.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { LeadCreateRequestSchema, LeadListQuerySchema } from "@rei-os/contracts";
import type { LeadListQuery } from "@rei-os/contracts";

@Controller("leads")
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Get()
  async list(@Query(new ZodValidationPipe(LeadListQuerySchema)) query: LeadListQuery) {
    return this.service.list(query);
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.service.getById(id);
  }

  @Post()
  async create(@Body(new ZodValidationPipe(LeadCreateRequestSchema)) body: any) {
    return this.service.create(body);
  }
}
