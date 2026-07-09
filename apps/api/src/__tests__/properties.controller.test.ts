import { describe, it, expect } from "vitest";
import { PropertiesController } from "../properties/properties.controller.js";
import { PropertiesService } from "../properties/properties.service.js";

describe("PropertiesController", () => {
  const controller = new PropertiesController(new PropertiesService());

  it("returns empty list", async () => {
    const result = await controller.list({ page: 1, limit: 20 });
    expect(result.success).toBe(true);
  });

  it("creates a property", async () => {
    const result = await controller.create({
      tenantId: "00000000-0000-0000-0000-000000000001",
      address: { street: "123 Main", city: "Austin", state: "TX", zip: "78701" },
      characteristics: { propertyType: "single_family" },
    });
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("returns 404 for missing property", async () => {
    await expect(controller.get("nonexistent")).rejects.toThrow();
  });
});
