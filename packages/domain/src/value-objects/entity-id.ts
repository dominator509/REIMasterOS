/** Opaque entity identifier with tenant scope. */
export type TenantId = string & { readonly __brand: "TenantId" };
export type EntityId = string & { readonly __brand: "EntityId" };
export type UserId = string & { readonly __brand: "UserId" };

export function toTenantId(id: string): TenantId {
  if (!id || id.length < 1) throw new Error("Invalid tenant ID");
  return id as TenantId;
}

export function toEntityId(id: string): EntityId {
  if (!id || id.length < 1) throw new Error("Invalid entity ID");
  return id as EntityId;
}

export function toUserId(id: string): UserId {
  if (!id || id.length < 1) throw new Error("Invalid user ID");
  return id as UserId;
}
