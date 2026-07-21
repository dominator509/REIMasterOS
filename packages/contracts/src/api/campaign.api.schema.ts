import { z } from "zod";
import { ComplianceCheckRequestSchema } from "./compliance.api.schema.js";

export const CampaignLaunchRequestSchema = z.object({
  compliance: ComplianceCheckRequestSchema,
  approvalId: z.string().uuid().optional(),
});
export const CampaignLaunchResponseSchema = z.object({
  campaignId: z.string().uuid(),
  jobId: z.string().uuid(),
  status: z.literal("queued"),
});

export type CampaignLaunchRequest = z.infer<typeof CampaignLaunchRequestSchema>;
