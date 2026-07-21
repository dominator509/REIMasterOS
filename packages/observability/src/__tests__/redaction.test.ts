import { describe, it, expect } from "vitest";
import { redact, hasDncData, sanitizeForLogging } from "../redaction.js";

describe("redact", () => {
  it("redacts password fields", () => {
    const result = redact({ email: "user@test.com", password: "secret123" });
    expect(result.email).toBe("[REDACTED]");
    expect(result.password).toBe("[REDACTED]");
  });

  it("redacts token fields", () => {
    const result = redact({ apiKey: "sk-12345", name: "test" });
    expect(result.apiKey).toBe("[REDACTED]");
    expect(result.name).toBe("test");
  });

  it("redacts nested sensitive fields", () => {
    const result = redact({ user: { credentials: { password: "secret" } } });
    expect(result.user).toEqual({ credentials: { password: "[REDACTED]" } });
  });

  it("redacts database URLs", () => {
    const result = redact({ DATABASE_URL: "postgresql://user:pass@localhost/db" });
    expect(result.DATABASE_URL).toBe("[REDACTED]");
  });

  it("handles arrays with sensitive data", () => {
    const result = redact({ users: [{ password: "a" }, { password: "b" }] });
    expect(result.users).toEqual([{ password: "[REDACTED]" }, { password: "[REDACTED]" }]);
  });
});

describe("hasDncData", () => {
  it("detects DNC references", () => {
    expect(hasDncData({ list: "DNC" })).toBe(true);
    expect(hasDncData({ list: "Do Not Call registry" })).toBe(true);
  });
  it("passes clean data", () => {
    expect(hasDncData({ name: "John", city: "Austin" })).toBe(false);
  });
});

describe("sanitizeForLogging", () => {
  it("throws on DNC data", () => {
    expect(() => sanitizeForLogging({ dnc: true })).toThrow("DNC data must not be logged");
  });
  it("redacts sensitive fields", () => {
    const result = sanitizeForLogging({
      user: "test",
      token: "abc",
      nested: { compiled_prompt: "private", provider_payload: "private" },
    });
    expect(result.token).toBe("[REDACTED]");
    expect(result.nested).toEqual({
      compiled_prompt: "[REDACTED]",
      provider_payload: "[REDACTED]",
    });
  });
});
