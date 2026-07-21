import { Module } from "@nestjs/common";
import { ApprovalsModule } from "../approvals/approvals.module.js";
import { ComplianceModule } from "../compliance/compliance.module.js";
import { CampaignsController } from "./campaigns.controller.js";
import { CampaignsService } from "./campaigns.service.js";

@Module({
  imports: [ComplianceModule, ApprovalsModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
