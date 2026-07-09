import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller.js";
import { PropertiesModule } from "./properties/properties.module.js";
import { LeadsModule } from "./leads/leads.module.js";
import { ContactsModule } from "./contacts/contacts.module.js";
import { ComplianceModule } from "./compliance/compliance.module.js";

@Module({
  imports: [PropertiesModule, LeadsModule, ContactsModule, ComplianceModule],
  controllers: [HealthController],
})
export class AppModule {}
