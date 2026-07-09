import { Controller, Get, Post, Param, Query, Body } from "@nestjs/common";
import { ContactsService } from "./contacts.service.js";
import { ZodValidationPipe } from "../common/validation.pipe.js";
import { ContactCreateRequestSchema, ContactListQuerySchema } from "@rei-os/contracts";

@Controller("contacts")
export class ContactsController {
  constructor(private readonly service: ContactsService) {}

  @Get()
  async list(@Query(new ZodValidationPipe(ContactListQuerySchema)) query: any) {
    return this.service.list(query);
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.service.getById(id);
  }

  @Post()
  async create(@Body(new ZodValidationPipe(ContactCreateRequestSchema)) body: any) {
    return this.service.create(body);
  }
}
