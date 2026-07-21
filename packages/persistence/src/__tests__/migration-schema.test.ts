import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const MIGRATION = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../db/migrations/V001__initial_schema.sql",
);

describe("V001 migration security contract", () => {
  it("includes tenant scope on contact points and approval requests", async () => {
    const sql = await readFile(MIGRATION, "utf8");
    expect(sql).toMatch(/CREATE TABLE contact_points \([\s\S]*?tenant_id UUID NOT NULL/u);
    expect(sql).toMatch(/CREATE TABLE approval_requests \([\s\S]*?tenant_id UUID NOT NULL/u);
  });

  it("stores provider credential payloads only as encrypted bytes", async () => {
    const sql = await readFile(MIGRATION, "utf8");
    expect(sql).toContain("encrypted_payload BYTEA NOT NULL");
    expect(sql).not.toMatch(/provider_credentials[\s\S]*?\bconfig JSONB/u);
  });
});
