import { describe, it, expect } from "vitest";
import { CreatePropertySchema } from "../property.schema.js";

describe("CreatePropertySchema", () => {
  it("validates a correct property", () => {
    const result = CreatePropertySchema.safeParse({
      tenantId: "00000000-0000-0000-0000-000000000001",
      address: { street: "123 Main", city: "Austin", state: "TX", zip: "78701" },
      characteristics: { propertyType: "single_family" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing street", () => {
    const result = CreatePropertySchema.safeParse({
      tenantId: "00000000-0000-0000-0000-000000000001",
      address: { city: "Austin", state: "TX", zip: "78701" },
      characteristics: { propertyType: "single_family" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid state code", () => {
    const result = CreatePropertySchema.safeParse({
      tenantId: "00000000-0000-0000-0000-000000000001",
      address: { street: "123 Main", city: "Austin", state: "Texas", zip: "78701" },
      characteristics: { propertyType: "single_family" },
    });
    expect(result.success).toBe(false);
  });
});
