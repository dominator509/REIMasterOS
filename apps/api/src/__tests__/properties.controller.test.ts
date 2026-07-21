import { describe, it, expect } from "vitest";
import { PropertiesController } from "../properties/properties.controller.js";
import { PropertiesService } from "../properties/properties.service.js";
import { ActivityService } from "../activity/activity.service.js";
import { AuditService } from "../audit/audit.service.js";
import { createTestAuthContext } from "../auth/auth-context.interface.js";
import type { AuthenticatedRequest } from "../auth/request-context.js";

describe("PropertiesController", () => {
  const activities = new ActivityService(new AuditService());
  const controller = new PropertiesController(new PropertiesService(activities));
  const request = { authContext: createTestAuthContext() } as AuthenticatedRequest;

  it("returns empty list", async () => {
    const result = await controller.list(request, { page: 1, limit: 20 });
    expect(result.data.items).toEqual([]);
  });

  it("creates a property", async () => {
    const result = await controller.create(request, {
      address: { street: "123 Main", city: "Austin", state: "TX", zip: "78701" },
      characteristics: { propertyType: "single_family" },
    });
    expect(result.data).toBeDefined();
    expect(result.data.tenantId).toBe(request.authContext?.tenantId);
  });

  it("returns 404 for missing property", async () => {
    await expect(controller.get(request, "nonexistent")).rejects.toThrow();
  });
});
