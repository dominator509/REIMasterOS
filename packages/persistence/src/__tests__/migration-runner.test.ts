import { describe, expect, it } from "vitest";
import { discoverMigrations } from "../migrate.js";

describe("migration runner", () => {
  it("discovers versioned migrations in deterministic order", () => {
    expect(discoverMigrations()).toEqual(["V001__initial_schema.sql"]);
  });
});
