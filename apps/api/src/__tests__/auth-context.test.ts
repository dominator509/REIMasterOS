import { describe, it, expect } from "vitest";
import { createTestAuthContext } from "../auth/auth-context.interface.js";

describe("AuthContext", () => {
  it("creates test context with defaults", () => {
    const ctx = createTestAuthContext();
    expect(ctx.role).toBe("admin");
    expect(ctx.isAuthenticated).toBe(true);
  });
  it("allows overrides", () => {
    const ctx = createTestAuthContext({ role: "viewer" });
    expect(ctx.role).toBe("viewer");
  });
});
