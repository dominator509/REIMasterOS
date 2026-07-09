import type { TenantId, EntityId, UserId } from "../value-objects/entity-id.js";

export interface ActivityEvent {
  readonly id: EntityId;
  readonly tenantId: TenantId;
  readonly actorId: UserId | "system" | "provider" | "ai";
  readonly action: string;
  readonly targetType: string;
  readonly targetId: EntityId;
  readonly metadata: Record<string, unknown>;
  readonly timestamp: Date;
}

export function createActivityEvent(params: {
  id: string;
  tenantId: string;
  actorId: string | "system" | "provider" | "ai";
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}): ActivityEvent {
  return {
    id: params.id as EntityId,
    tenantId: params.tenantId as TenantId,
    actorId: params.actorId as UserId | "system" | "provider" | "ai",
    action: params.action,
    targetType: params.targetType,
    targetId: params.targetId as EntityId,
    metadata: params.metadata ?? {},
    timestamp: new Date(),
  };
}
