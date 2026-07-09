import { describe, it, expect } from "vitest";
import { envSchema, loadConfig } from "../env.config.js";

describe("envSchema", () => {
  it("accepts valid minimal config", () => {
    const result = envSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NODE_ENV).toBe("development");
      expect(result.data.APP_ENV).toBe("local");
    }
  });

  it("rejects invalid NODE_ENV", () => {
    const result = envSchema.safeParse({ NODE_ENV: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid APP_BASE_URL", () => {
    const result = envSchema.safeParse({ APP_BASE_URL: "not-a-url" });
    expect(result.success).toBe(false);
  });
});

describe("loadConfig", () => {
  it("loads from process.env-like object", () => {
    const config = loadConfig({ NODE_ENV: "test", APP_ENV: "test" });
    expect(config.NODE_ENV).toBe("test");
  });

  it("throws on invalid config", () => {
    expect(() => loadConfig({ NODE_ENV: "bogus" })).toThrow("Invalid environment configuration");
  });
});
