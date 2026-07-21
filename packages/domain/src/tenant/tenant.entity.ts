/** A self-hosted tenant instance. */
export interface Tenant {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export function createTenant(params: { id: string; name: string; now: Date }): Tenant {
  return {
    id: params.id,
    name: params.name,
    createdAt: params.now,
    updatedAt: params.now,
  };
}
