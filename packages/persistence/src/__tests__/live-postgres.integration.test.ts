import { afterAll, describe, expect, it } from "vitest";
import { toTenantId } from "@rei-os/domain";
import { PgDbConnection } from "../connection.js";
import { OwnerRepository } from "../repositories/canonical.repository.js";

const RUN_LIVE = process.env.REI_OS_RUN_DB_INTEGRATION === "1";
const url = new URL(process.env.DATABASE_URL ?? "postgresql://rei:rei@127.0.0.1:5433/rei_os");

if (RUN_LIVE && !["127.0.0.1", "localhost"].includes(url.hostname)) {
  throw new Error("Live persistence tests are restricted to a local PostgreSQL host");
}
if (RUN_LIVE && url.pathname !== "/rei_os") {
  throw new Error("Live persistence tests require the synthetic rei_os database");
}

const db = new PgDbConnection({
  host: url.hostname,
  port: Number.parseInt(url.port || "5432", 10),
  database: url.pathname.slice(1),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
});

describe.skipIf(!RUN_LIVE)("live PostgreSQL repository isolation", () => {
  const tenantA = "10000000-0000-4000-8000-000000000001";
  const tenantB = "10000000-0000-4000-8000-000000000002";
  const ownerId = "20000000-0000-4000-8000-000000000001";

  afterAll(async () => {
    if (RUN_LIVE) await db.close();
  });

  it("returns a canonical row only to its owning tenant", async () => {
    await db.execute("DELETE FROM owners WHERE id = $1", [ownerId]);
    await db.execute("DELETE FROM tenants WHERE id IN ($1, $2)", [tenantA, tenantB]);
    await db.execute("INSERT INTO tenants (id, name) VALUES ($1, $2), ($3, $4)", [
      tenantA,
      "Synthetic Tenant A",
      tenantB,
      "Synthetic Tenant B",
    ]);

    try {
      const repository = new OwnerRepository(db);
      await repository.insert(
        { tenantId: toTenantId(tenantA) },
        {
          id: ownerId,
          tenant_id: tenantA,
          name: "Synthetic Owner",
          entity_type: "individual",
          properties_owned: 0,
          tags: [],
          created_at: "2026-07-18T12:00:00.000Z",
          updated_at: "2026-07-18T12:00:00.000Z",
        },
      );

      await expect(
        repository.findById({ tenantId: toTenantId(tenantA) }, ownerId),
      ).resolves.toMatchObject({
        id: ownerId,
        tenant_id: tenantA,
      });
      await expect(
        repository.findById({ tenantId: toTenantId(tenantB) }, ownerId),
      ).resolves.toBeNull();
    } finally {
      await db.execute("DELETE FROM owners WHERE id = $1", [ownerId]);
      await db.execute("DELETE FROM tenants WHERE id IN ($1, $2)", [tenantA, tenantB]);
    }
  });
});
