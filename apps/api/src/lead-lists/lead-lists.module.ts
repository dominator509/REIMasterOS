import { Module } from "@nestjs/common";
import { LeadListsController } from "./lead-lists.controller.js";
import { LeadListsService } from "./lead-lists.service.js";

@Module({ controllers: [LeadListsController], providers: [LeadListsService] })
export class LeadListsModule {}
