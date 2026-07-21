import type { TenantContext } from "../repository.interface.js";

export interface CacheService {
  get<T>(ctx: TenantContext, key: string): Promise<T | null>;
  set<T>(ctx: TenantContext, key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(ctx: TenantContext, key: string): Promise<void>;
  exists(ctx: TenantContext, key: string): Promise<boolean>;
}

export function createTestCacheService(): CacheService {
  const store = new Map<string, { value: unknown; expiresAt: number }>();
  const scoped = (ctx: TenantContext, key: string) => `${ctx.tenantId}:${key}`;
  return {
    async get<T>(ctx: TenantContext, key: string): Promise<T | null> {
      const scopedKey = scoped(ctx, key);
      const entry = store.get(scopedKey);
      if (!entry) return null;
      if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
        store.delete(scopedKey);
        return null;
      }
      return entry.value as T;
    },
    async set<T>(ctx: TenantContext, key: string, value: T, ttlSeconds?: number): Promise<void> {
      const expiresAt =
        ttlSeconds !== undefined ? (ttlSeconds === 0 ? 1 : Date.now() + ttlSeconds * 1000) : 0;
      store.set(scoped(ctx, key), { value, expiresAt });
    },
    async delete(ctx: TenantContext, key: string): Promise<void> {
      store.delete(scoped(ctx, key));
    },
    async exists(ctx: TenantContext, key: string): Promise<boolean> {
      return store.has(scoped(ctx, key));
    },
  };
}
