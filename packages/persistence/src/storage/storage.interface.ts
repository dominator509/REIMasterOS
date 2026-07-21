import type { TenantContext } from "../repository.interface.js";

export interface StorageService {
  put(
    ctx: TenantContext,
    key: string,
    body: Buffer,
    contentType?: string,
  ): Promise<{ key: string; size: number }>;
  get(ctx: TenantContext, key: string): Promise<Buffer | null>;
  delete(ctx: TenantContext, key: string): Promise<void>;
  getSignedUrl(ctx: TenantContext, key: string, expiresInSeconds: number): Promise<string>;
}

export function buildObjectKey(tenantId: string, category: string, filename: string): string {
  for (const [name, segment] of [
    ["tenant", tenantId],
    ["category", category],
    ["filename", filename],
  ] as const) {
    if (!segment || segment.includes("..") || segment.includes("\\") || segment.startsWith("/")) {
      throw new Error(`Invalid object ${name} segment`);
    }
  }
  return `${tenantId}/${category}/${filename}`;
}

function assertTenantKey(ctx: TenantContext, key: string): void {
  if (!key.startsWith(`${ctx.tenantId}/`)) throw new Error("Cross-tenant object access denied");
}

export function createTestStorageService(): StorageService {
  const store = new Map<string, Buffer>();
  return {
    async put(ctx, key, body) {
      assertTenantKey(ctx, key);
      store.set(key, body);
      return { key, size: body.length };
    },
    async get(ctx, key) {
      assertTenantKey(ctx, key);
      return store.get(key) ?? null;
    },
    async delete(ctx, key) {
      assertTenantKey(ctx, key);
      store.delete(key);
    },
    async getSignedUrl(ctx, key, _exp) {
      assertTenantKey(ctx, key);
      return `http://test-storage/${key}`;
    },
  };
}
