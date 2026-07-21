import { Module } from "@nestjs/common";
import { ApprovalsController } from "./approvals.controller.js";
import { APPROVAL_CLOCK, ApprovalsService } from "./approvals.service.js";

@Module({
  controllers: [ApprovalsController],
  providers: [{ provide: APPROVAL_CLOCK, useValue: Date.now }, ApprovalsService],
  exports: [ApprovalsService],
})
export class ApprovalsModule {}
