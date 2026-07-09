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
  return `${tenantId}/${category}/${filename}`;
}

export function createTestStorageService(): StorageService {
  const store = new Map<string, Buffer>();
  return {
    async put(_ctx, key, body) {
      store.set(key, body);
      return { key, size: body.length };
    },
    async get(_ctx, key) {
      return store.get(key) ?? null;
    },
    async delete(_ctx, key) {
      store.delete(key);
    },
    async getSignedUrl(_ctx, key, _exp) {
      return `http://test-storage/${key}`;
    },
  };
}
