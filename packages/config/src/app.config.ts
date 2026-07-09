import { z } from "zod";

export type DeploymentProfile = "solo-budget" | "solo-pro" | "team" | "enterprise";

export const appConfigSchema = z.object({
  name: z.string().default("REI-OS"),
  version: z.string().default("0.0.0"),
  deploymentProfile: z
    .enum(["solo-budget", "solo-pro", "team", "enterprise"])
    .default("solo-budget"),
  features: z.object({
    licensedAgentModule: z.boolean().default(false),
    brokerageModule: z.boolean().default(false),
    mlsIntegration: z.boolean().default(false),
    aiVoiceCampaigns: z.boolean().default(false),
    premiumProviders: z.boolean().default(false),
  }),
});

export type AppConfig = z.infer<typeof appConfigSchema>;
