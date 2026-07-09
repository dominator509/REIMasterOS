import { describe, it, expect } from "vitest";
import { authConfigSchema } from "../auth.config.js";

describe("authConfigSchema", () => {
  it("accepts defaults", () => {
    const result = authConfigSchema.safeParse({});
    expect(result.success).toBe(true);
  });
  it("rejects short session secret", () => {
    const result = authConfigSchema.safeParse({ SESSION_SECRET: "short" });
    expect(result.success).toBe(false);
  });
  it("accepts valid config", () => {
    const result = authConfigSchema.safeParse({
      AUTH_PROVIDER: "built-in",
      SESSION_SECRET: "a-32-character-secret-key-here-ok",
      ENCRYPTION_KEY: "a-32-character-encryption-key-here",
    });
    expect(result.success).toBe(true);
  });
});
