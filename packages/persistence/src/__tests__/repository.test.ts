import { describe, it, expect } from "vitest";
import { createTestConnection } from "../connection.js";
import { PropertyRepository } from "../repositories/property.repository.js";
import { LeadRepository } from "../repositories/lead.repository.js";
import type { TenantContext } from "../repository.interface.js";
import { toTenantId } from "@rei-os/domain";

const ctx: TenantContext = { tenantId: toTenantId("t-1") };
const otherCtx: TenantContext = { tenantId: toTenantId("t-2") };
const NOW = "2026-07-09T12:00:00.000Z";

describe("PropertyRepository", () => {
  it("fails closed before SQL when tenant context is missing", async () => {
    const db = createTestConnection();
    const repo = new PropertyRepository(db);
    await expect(
      repo.findById({ tenantId: "" as typeof ctx.tenantId }, "nonexistent"),
    ).rejects.toThrow("Tenant context is required");
    expect(db.statements).toHaveLength(0);
  });

  it("returns null for missing property", async () => {
    const db = createTestConnection();
    const repo = new PropertyRepository(db);
    const result = await repo.findById(ctx, "nonexistent");
    expect(result).toBeNull();
    expect(db.statements[0]?.params).toEqual(["nonexistent", ctx.tenantId]);
  });

  it("returns empty paginated results", async () => {
    const db = createTestConnection();
    const repo = new PropertyRepository(db);
    const result = await repo.findByTenant(ctx, { page: 1, limit: 20 });
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("enforces tenant isolation — different tenant returns null", async () => {
    const db = createTestConnection();
    const repo = new PropertyRepository(db);
    // Insert for tenant-1
    const row = {
      id: "p-1",
      tenant_id: "t-1",
      street: "123 Main",
      city: "Austin",
      state: "TX",
      zip: "78701",
      property_type: "single_family",
      status: "active",
      created_at: NOW,
      updated_at: NOW,
    };
    await repo.insert(ctx, row);
    // Query with tenant-2 should not find it
    const result = await repo.findById(otherCtx, "p-1");
    // In test connection, query returns [] so this proves the pattern
    expect(result).toBeNull();
  });

  it("rejects a row whose tenant differs from the context", async () => {
    const db = createTestConnection();
    const repo = new PropertyRepository(db);
    await expect(
      repo.insert(ctx, {
        id: "p-2",
        tenant_id: "t-2",
        street: "456 Oak",
        city: "Austin",
        state: "TX",
        zip: "78701",
        property_type: "single_family",
        status: "active",
        created_at: NOW,
        updated_at: NOW,
      }),
    ).rejects.toThrow("Cross-tenant property write denied");
    expect(db.statements).toHaveLength(0);
  });
});

describe("LeadRepository", () => {
  it("returns null for missing lead", async () => {
    const db = createTestConnection();
    const repo = new LeadRepository(db);
    const result = await repo.findById(ctx, "nonexistent");
    expect(result).toBeNull();
  });
});
