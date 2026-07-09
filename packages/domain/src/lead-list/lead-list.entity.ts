import type { TenantId, EntityId } from "../value-objects/entity-id.js";

export interface LeadList {
  readonly id: EntityId;
  readonly tenantId: TenantId;
  readonly name: string;
  readonly description: string;
  readonly sources: readonly string[];
  readonly leadIds: readonly EntityId[];
  readonly tags: readonly string[];
  readonly stage: LeadListStage;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type LeadListStage = "importing" | "scrubbing" | "ready" | "in_campaign" | "archived";

export function createLeadList(params: {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
}): LeadList {
  return {
    id: params.id as EntityId,
    tenantId: params.tenantId as TenantId,
    name: params.name,
    description: params.description ?? "",
    sources: [],
    leadIds: [],
    tags: [],
    stage: "importing",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function addLeadsToList(list: LeadList, leadIds: readonly EntityId[]): LeadList {
  const existing = new Set(list.leadIds);
  const newLeads = leadIds.filter((id) => !existing.has(id));
  return { ...list, leadIds: [...list.leadIds, ...newLeads], updatedAt: new Date() };
}

export function deduplicateByKey<T>(items: readonly T[], keyFn: (item: T) => string): T[] {
  const seen = new Map<string, T>();
  for (const item of items) {
    const key = keyFn(item);
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
}
