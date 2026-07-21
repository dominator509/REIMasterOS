import { describe, it, expect } from "vitest";
import { createTestSearchService } from "../search/search.interface.js";
import { createTestStorageService, buildObjectKey } from "../storage/storage.interface.js";
import { createTestCacheService } from "../cache/cache.interface.js";
import type { TenantContext } from "../repository.interface.js";
import { toTenantId } from "@rei-os/domain";

const ctx: TenantContext = { tenantId: toTenantId("t-1") };
const otherCtx: TenantContext = { tenantId: toTenantId("t-2") };

describe("SearchService (test stub)", () => {
  it("indexes and searches documents", async () => {
    const svc = createTestSearchService();
    await svc.index(ctx, {
      id: "p-1",
      type: "property",
      tenantId: "t-1",
      body: { city: "Austin" },
    });
    const result = await svc.search(ctx, { type: "property", query: "", page: 1, limit: 10 });
    expect(result.total).toBe(1);
  });
  it("enforces tenant isolation", async () => {
    const svc = createTestSearchService();
    await svc.index(ctx, { id: "p-1", type: "property", tenantId: "t-1", body: {} });
    const result = await svc.search(otherCtx, { type: "property", query: "", page: 1, limit: 10 });
    expect(result.total).toBe(0);
  });
  it("rejects cross-tenant indexing", async () => {
    const svc = createTestSearchService();
    await expect(
      svc.index(ctx, { id: "p-1", type: "property", tenantId: "t-2", body: {} }),
    ).rejects.toThrow("Cross-tenant search write denied");
  });
});

describe("StorageService (test stub)", () => {
  it("puts and gets objects", async () => {
    const svc = createTestStorageService();
    const key = buildObjectKey("t-1", "imports", "test.csv");
    await svc.put(ctx, key, Buffer.from("hello"));
    const result = await svc.get(ctx, key);
    expect(result?.toString()).toBe("hello");
  });
  it("generates signed URLs", async () => {
    const svc = createTestStorageService();
    const url = await svc.getSignedUrl(ctx, "t-1/test/file.pdf", 3600);
    expect(url).toContain("test-storage");
  });
  it("rejects cross-tenant keys and traversal", async () => {
    const svc = createTestStorageService();
    await expect(svc.get(otherCtx, "t-1/imports/test.csv")).rejects.toThrow(
      "Cross-tenant object access denied",
    );
    expect(() => buildObjectKey("t-1", "imports", "../secret.txt")).toThrow(
      "Invalid object filename segment",
    );
  });
});

describe("CacheService (test stub)", () => {
  it("sets and gets values", async () => {
    const svc = createTestCacheService();
    await svc.set(ctx, "key1", { data: "value" }, 60);
    const val = await svc.get<{ data: string }>(ctx, "key1");
    expect(val?.data).toBe("value");
  });
  it("returns null for missing keys", async () => {
    const svc = createTestCacheService();
    expect(await svc.get(ctx, "missing")).toBeNull();
  });
  it("expires TTL entries", async () => {
    const svc = createTestCacheService();
    await svc.set(ctx, "ephemeral", "data", 0); // immediate expiry with 0 TTL
    // With 0 TTL, Date.now() > expiresAt immediately
    const val = await svc.get(ctx, "ephemeral");
    expect(val).toBeNull();
  });
  it("isolates identical keys by tenant", async () => {
    const svc = createTestCacheService();
    await svc.set(ctx, "shared", "tenant-one");
    expect(await svc.get(otherCtx, "shared")).toBeNull();
  });
});
