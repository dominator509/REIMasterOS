export interface TenantRecord {
  readonly id: string;
  readonly tenantId: string;
}

export class TenantMemoryStore<T extends TenantRecord> {
  private readonly records = new Map<string, T>();

  private key(tenantId: string, id: string): string {
    return `${tenantId}:${id}`;
  }

  set(record: T): void {
    this.records.set(this.key(record.tenantId, record.id), record);
  }

  get(tenantId: string, id: string): T | undefined {
    return this.records.get(this.key(tenantId, id));
  }

  list(tenantId: string): T[] {
    return [...this.records.values()].filter((record) => record.tenantId === tenantId);
  }
}
