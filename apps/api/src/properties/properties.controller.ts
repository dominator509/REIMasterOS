import { Controller, Get, Post, Param, Query, Body } from "@nestjs/common";
import { PropertiesService } from "./properties.service.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { PropertyCreateRequestSchema, PropertyListQuerySchema } from "@rei-os/contracts";
import type { PropertyListQuery } from "@rei-os/contracts";

@Controller("properties")
export class PropertiesController {
  constructor(private readonly service: PropertiesService) {}

  @Get()
  async list(@Query(new ZodValidationPipe(PropertyListQuerySchema)) query: PropertyListQuery) {
    return this.service.list(query);
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.service.getById(id);
  }

  @Post()
  async create(@Body(new ZodValidationPipe(PropertyCreateRequestSchema)) body: any) {
    return this.service.create(body);
  }
}
