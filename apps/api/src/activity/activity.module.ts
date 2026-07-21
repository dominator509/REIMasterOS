import { Global, Module } from "@nestjs/common";
import { AuditService } from "../audit/audit.service.js";
import { ActivityController } from "./activity.controller.js";
import { ActivityService } from "./activity.service.js";

@Global()
@Module({
  controllers: [ActivityController],
  providers: [AuditService, ActivityService],
  exports: [AuditService, ActivityService],
})
export class ActivityModule {}
