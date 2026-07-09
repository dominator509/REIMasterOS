import { describe, it, expect } from "vitest";
import { hasPermission, PERMISSIONS } from "../permissions/permissions.js";

describe("Permissions", () => {
  it("admin has all permissions", () => {
    expect(hasPermission("admin", PERMISSIONS.ADMIN_ACCESS)).toBe(true);
  });
  it("viewer can read properties", () => {
    expect(hasPermission("viewer", PERMISSIONS.PROPERTY_READ)).toBe(true);
  });
  it("viewer cannot write properties", () => {
    expect(hasPermission("viewer", PERMISSIONS.PROPERTY_WRITE)).toBe(false);
  });
  it("member cannot override compliance", () => {
    expect(hasPermission("member", PERMISSIONS.COMPLIANCE_OVERRIDE)).toBe(false);
  });
});
