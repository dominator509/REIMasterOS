import type { TenantId, EntityId } from "../value-objects/entity-id.js";

export interface Campaign {
  readonly id: EntityId;
  readonly tenantId: TenantId;
  readonly name: string;
  readonly channel: CampaignChannel;
  readonly status: CampaignStatus;
  readonly targetListId?: EntityId;
  readonly templateId?: string;
  readonly scheduledAt?: Date;
  readonly startedAt?: Date;
  readonly completedAt?: Date;
  readonly stats: CampaignStats;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type CampaignChannel = "email" | "direct_mail" | "voice" | "sms" | "ringless_voicemail";
export type CampaignStatus =
  "draft" | "scheduled" | "running" | "paused" | "completed" | "cancelled";

export interface CampaignStats {
  totalTargets: number;
  sent: number;
  delivered: number;
  opened: number;
  replied: number;
  bounced: number;
  optedOut: number;
}

export function createCampaign(params: {
  id: string;
  tenantId: string;
  name: string;
  channel: CampaignChannel;
  now: Date;
}): Campaign {
  if (!["email", "direct_mail", "voice", "sms", "ringless_voicemail"].includes(params.channel)) {
    throw new Error(`Invalid campaign channel: ${params.channel}`);
  }
  return {
    id: params.id as EntityId,
    tenantId: params.tenantId as TenantId,
    name: params.name,
    channel: params.channel,
    status: "draft",
    stats: {
      totalTargets: 0,
      sent: 0,
      delivered: 0,
      opened: 0,
      replied: 0,
      bounced: 0,
      optedOut: 0,
    },
    createdAt: params.now,
    updatedAt: params.now,
  };
}

export function canActivateCampaign(campaign: Campaign): boolean {
  return campaign.status === "draft" || campaign.status === "paused";
}
