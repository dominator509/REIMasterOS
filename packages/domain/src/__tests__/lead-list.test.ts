import { describe, it, expect } from "vitest";
import { createLeadList, addLeadsToList, deduplicateByKey } from "../lead-list/lead-list.entity.js";

describe("LeadList", () => {
  it("creates empty list", () => {
    const list = createLeadList({ id: "ll-1", tenantId: "t-1", name: "Test List" });
    expect(list.leadIds).toHaveLength(0);
  });
  it("adds leads without duplicates", () => {
    let list = createLeadList({ id: "ll-1", tenantId: "t-1", name: "Test List" });
    list = addLeadsToList(list, ["lead-1" as any, "lead-2" as any]);
    list = addLeadsToList(list, ["lead-2" as any, "lead-3" as any]);
    expect(list.leadIds).toHaveLength(3);
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
