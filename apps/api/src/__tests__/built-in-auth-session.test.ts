import { describe, expect, it } from "vitest";
import { authConfigSchema } from "@rei-os/config";
import {
  BuiltInAuthService,
  hashPassword,
  type IdentityStore,
} from "../auth/built-in-auth.service.js";
import { AuthSessionService } from "../auth/session/auth-session.service.js";

const baseTime = Date.parse("2026-07-18T12:00:00.000Z");

function config(overrides: Record<string, string> = {}) {
  return authConfigSchema.parse({ APP_ENV: "test", ...overrides });
}

describe("built-in auth session foundation", () => {
  it("creates and verifies a signed, HttpOnly, same-site session", () => {
    const sessions = new AuthSessionService(config(), () => baseTime);
    const created = sessions.create({
      userId: "00000000-0000-4000-8000-000000000701",
      tenantId: "00000000-0000-4000-8000-000000000702",
      role: "admin",
    });
    expect(created.cookie).toContain("HttpOnly");
    expect(created.cookie).toContain("SameSite=Strict");
    expect(created.cookie).not.toContain("Secure");
    expect(sessions.verify(created.token)?.tenantId).toBe(created.claims.tenantId);
    expect(sessions.verify(`${created.token}tampered`)).toBeUndefined();
  });

  it("expires sessions at the idle boundary", () => {
    let now = baseTime;
    const sessions = new AuthSessionService(
      config({ SESSION_IDLE_TIMEOUT_SECONDS: "60", SESSION_MAX_AGE_SECONDS: "300" }),
      () => now,
    );
    const created = sessions.create({
      userId: "00000000-0000-4000-8000-000000000703",
      tenantId: "00000000-0000-4000-8000-000000000704",
      role: "viewer",
    });
    now += 60_000;
    expect(sessions.verify(created.token)).toBeUndefined();
  });

  it("uses Secure cookies and rejects placeholder secrets in production", () => {
    const sessions = new AuthSessionService(
      config({
        APP_ENV: "production",
        SESSION_SECRET: "production-session-secret-owned-and-unique-123",
        ENCRYPTION_KEY: "production-encryption-key-owned-and-unique-123",
        CORS_ALLOWED_ORIGINS: "https://app.example.test",
      }),
      () => baseTime,
    );
    const created = sessions.create({
      userId: "00000000-0000-4000-8000-000000000705",
      tenantId: "00000000-0000-4000-8000-000000000706",
      role: "manager",
    });
    expect(created.cookie).toContain("Secure");
    expect(created.csrfCookie).toContain("Secure");
  });

  it("authenticates a stored password hash and denies invalid or disabled identities", async () => {
    const sessions = new AuthSessionService(config(), () => baseTime);
    const identity = {
      userId: "00000000-0000-4000-8000-000000000707",
      tenantId: "00000000-0000-4000-8000-000000000708",
      email: "operator@example.test",
      passwordHash: hashPassword("correct synthetic password"),
      role: "member" as const,
      disabled: false,
    };
    const store: IdentityStore = {
      findByEmail: async (email) => (email === identity.email ? identity : undefined),
    };
    const auth = new BuiltInAuthService(sessions, store);
    const login = await auth.login(" Operator@Example.Test ", "correct synthetic password");
    expect(sessions.verify(login.token)?.role).toBe("member");
    await expect(auth.login(identity.email, "wrong password")).rejects.toThrow();
    const disabled = new BuiltInAuthService(sessions, {
      findByEmail: async () => ({ ...identity, disabled: true }),
    });
    await expect(disabled.login(identity.email, "correct synthetic password")).rejects.toThrow();
  });
});
