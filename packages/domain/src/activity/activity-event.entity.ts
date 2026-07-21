import {
  toEntityId,
  toTenantId,
  toUserId,
  type TenantId,
  type EntityId,
  type UserId,
} from "../value-objects/entity-id.js";

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
  timestamp: Date;
}): ActivityEvent {
  if (!params.action.trim()) throw new Error("Activity action is required");
  if (!params.targetType.trim()) throw new Error("Activity target type is required");
  const systemActors = new Set(["system", "provider", "ai"]);
  return {
    id: toEntityId(params.id),
    tenantId: toTenantId(params.tenantId),
    actorId: systemActors.has(params.actorId)
      ? (params.actorId as "system" | "provider" | "ai")
      : toUserId(params.actorId),
    action: params.action,
    targetType: params.targetType,
    targetId: toEntityId(params.targetId),
    metadata: params.metadata ?? {},
    timestamp: params.timestamp,
  };
}
