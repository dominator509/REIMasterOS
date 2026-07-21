import { describe, it, expect } from "vitest";
import { authConfigSchema, loadAuthConfig } from "../auth.config.js";

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

  it("parses false as false instead of JavaScript string truthiness", () => {
    const result = authConfigSchema.parse({ MFA_ENABLED: "false" });
    expect(result.MFA_ENABLED).toBe(false);
  });

  it("rejects local placeholder secrets in staging and production", () => {
    expect(() => loadAuthConfig({ APP_ENV: "production" })).toThrow(
      "owner-provided session secret",
    );
    expect(() =>
      loadAuthConfig({
        APP_ENV: "staging",
        SESSION_SECRET: "replace-with-at-least-32-byte-secret-key",
        ENCRYPTION_KEY: "replace-with-at-least-32-byte-key-value",
        CORS_ALLOWED_ORIGINS: "https://app.example.test",
      }),
    ).toThrow("owner-provided");
  });

  it("accepts owner-provided staging secrets", () => {
    const result = loadAuthConfig({
      APP_ENV: "staging",
      SESSION_SECRET: "staging-session-secret-32-bytes-minimum-unique",
      ENCRYPTION_KEY: "staging-encryption-key-32-bytes-minimum-unique",
      CORS_ALLOWED_ORIGINS: "https://app.example.test",
    });
    expect(result.APP_ENV).toBe("staging");
    expect(result.CORS_ALLOWED_ORIGINS).toEqual(["https://app.example.test"]);
  });
});
