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
  now: Date;
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
    createdAt: params.now,
    updatedAt: params.now,
  };
}

export function addLeadsToList(list: LeadList, leadIds: readonly EntityId[], now: Date): LeadList {
  const existing = new Set(list.leadIds);
  const newLeads = leadIds.filter((id) => !existing.has(id));
  return { ...list, leadIds: [...list.leadIds, ...newLeads], updatedAt: now };
}

export function assertSameTenant(
  parent: { readonly tenantId: TenantId },
  child: { readonly tenantId: TenantId },
): void {
  if (parent.tenantId !== child.tenantId) throw new Error("Cross-tenant relationship denied");
}

export function deduplicateByKey<T>(items: readonly T[], keyFn: (item: T) => string): T[] {
  const seen = new Map<string, T>();
  for (const item of items) {
    const key = keyFn(item);
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
}
