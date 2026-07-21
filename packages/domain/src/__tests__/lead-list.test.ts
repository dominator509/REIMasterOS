import { describe, it, expect } from "vitest";
import { createLeadList, addLeadsToList, deduplicateByKey } from "../lead-list/lead-list.entity.js";
import { toEntityId, toTenantId } from "../value-objects/entity-id.js";

const NOW = new Date("2026-07-09T12:00:00.000Z");

describe("LeadList", () => {
  it("creates empty list", () => {
    const list = createLeadList({ id: "ll-1", tenantId: "t-1", name: "Test List", now: NOW });
    expect(list.leadIds).toHaveLength(0);
  });
  it("adds leads without duplicates", () => {
    let list = createLeadList({ id: "ll-1", tenantId: "t-1", name: "Test List", now: NOW });
    list = addLeadsToList(list, [toEntityId("lead-1"), toEntityId("lead-2")], NOW);
    list = addLeadsToList(list, [toEntityId("lead-2"), toEntityId("lead-3")], NOW);
    expect(list.leadIds).toHaveLength(3);
  });
});

describe("tenant relationships", () => {
  it("rejects cross-tenant relationships", async () => {
    const { assertSameTenant } = await import("../lead-list/lead-list.entity.js");
    expect(() =>
      assertSameTenant({ tenantId: toTenantId("t-1") }, { tenantId: toTenantId("t-2") }),
    ).toThrow("Cross-tenant relationship denied");
  });
});

describe("deduplicateByKey", () => {
  it("deduplicates by key", () => {
    const items = [
      { id: "a", v: 1 },
      { id: "b", v: 2 },
      { id: "a", v: 3 },
    ];
    const result = deduplicateByKey(items, (x) => x.id);
    expect(result).toHaveLength(2);
  });
});
