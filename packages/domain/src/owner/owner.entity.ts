import type { TenantId, EntityId } from "../value-objects/entity-id.js";
import type { Address } from "../value-objects/address.js";

export interface Owner {
  readonly id: EntityId;
  readonly tenantId: TenantId;
  readonly name: string;
  readonly entityType: OwnerEntityType;
  readonly mailingAddress?: Address;
  readonly propertiesOwned: number;
  readonly ownershipLengthYears?: number;
  readonly tags: readonly string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type OwnerEntityType = "individual" | "llc" | "corporation" | "trust" | "other";

export function createOwner(params: {
  id: string;
  tenantId: string;
  name: string;
  entityType?: OwnerEntityType;
  mailingAddress?: Address;
}): Owner {
  if (!params.name.trim()) throw new Error("Owner name is required");
  return {
    id: params.id as EntityId,
    tenantId: params.tenantId as TenantId,
    name: params.name.trim(),
    entityType: params.entityType ?? "individual",
    mailingAddress: params.mailingAddress,
    propertiesOwned: 0,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
