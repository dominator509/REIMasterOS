/** Opaque entity identifier with tenant scope. */
export type TenantId = string & { readonly __brand: "TenantId" };
export type EntityId = string & { readonly __brand: "EntityId" };
export type UserId = string & { readonly __brand: "UserId" };

export function toTenantId(id: string): TenantId {
  const value = id.trim();
  if (!value) throw new Error("Invalid tenant ID");
  return value as TenantId;
}

export function toEntityId(id: string): EntityId {
  const value = id.trim();
  if (!value) throw new Error("Invalid entity ID");
  return value as EntityId;
}

export function toUserId(id: string): UserId {
  const value = id.trim();
  if (!value) throw new Error("Invalid user ID");
  return value as UserId;
}
