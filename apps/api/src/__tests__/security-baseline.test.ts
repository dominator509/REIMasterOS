import type { CallHandler, ExecutionContext } from "@nestjs/common";
import { ForbiddenException } from "@nestjs/common";
import { loadAuthConfig } from "@rei-os/config";
import type { NextFunction, Request, Response } from "express";
import { firstValueFrom, throwError } from "rxjs";
import { describe, expect, it, vi } from "vitest";
import { AuditService } from "../audit/audit.service.js";
import { createTestAuthContext } from "../auth/auth-context.interface.js";
import { AuthSessionService } from "../auth/session/auth-session.service.js";
import { CsrfMiddleware } from "../security/csrf.middleware.js";
import { RateLimitMiddleware } from "../security/rate-limit.middleware.js";
import { SecurityAuditInterceptor } from "../security/security-audit.interceptor.js";
import { SecurityHeadersMiddleware } from "../security/security-headers.middleware.js";

function response(headers: Record<string, string>): Response {
  return {
    setHeader: (name: string, value: string | number | readonly string[]) => {
      headers[name] = String(value);
      return undefined as never;
    },
  } as unknown as Response;
}

describe("API security baseline", () => {
  it("sets modern API headers and only enables HSTS for secure environments", () => {
    const localHeaders: Record<string, string> = {};
    new SecurityHeadersMiddleware(loadAuthConfig()).use(
      {} as Request,
      response(localHeaders),
      vi.fn(),
    );
    expect(localHeaders["Content-Security-Policy"]).toContain("default-src 'none'");
    expect(localHeaders["X-XSS-Protection"]).toBe("0");
    expect(localHeaders).not.toHaveProperty("Strict-Transport-Security");

    const productionHeaders: Record<string, string> = {};
    new SecurityHeadersMiddleware(
      loadAuthConfig({
        APP_ENV: "production",
        SESSION_SECRET: "production-session-secret-32-bytes-minimum-unique",
        ENCRYPTION_KEY: "production-encryption-key-32-bytes-minimum-unique",
        CORS_ALLOWED_ORIGINS: "https://app.example.test",
      }),
    ).use({} as Request, response(productionHeaders), vi.fn());
    expect(productionHeaders["Strict-Transport-Security"]).toContain("max-age=31536000");
  });

  it("requires a matching double-submit CSRF token for cookie-authenticated writes", () => {
    const config = loadAuthConfig();
    const session = new AuthSessionService(config).create({
      userId: "00000000-0000-4000-8000-000000000901",
      tenantId: "00000000-0000-4000-8000-000000000902",
      role: "admin",
    });
    const middleware = new CsrfMiddleware(config);
    const cookie = `${config.SESSION_COOKIE_NAME}=${session.token}; ${config.CSRF_COOKIE_NAME}=${session.csrfToken}`;
    expect(() =>
      middleware.use({ method: "POST", headers: { cookie } } as Request, {} as Response, vi.fn()),
    ).toThrow();
    const next = vi.fn();
    middleware.use(
      {
        method: "POST",
        headers: { cookie, "x-csrf-token": session.csrfToken },
      } as unknown as Request,
      {} as Response,
      next,
    );
    expect(next).toHaveBeenCalledOnce();
  });

  it("returns the stable RATE_LIMITED envelope after a sensitive-route budget is exhausted", () => {
    const middleware = new RateLimitMiddleware(
      loadAuthConfig({ RATE_LIMIT_SENSITIVE_REQUESTS: "1" }),
    );
    const request = {
      path: "/ai/chat",
      method: "POST",
      ip: "127.0.0.1",
      headers: {},
      authContext: createTestAuthContext(),
    } as unknown as Request & { authContext: ReturnType<typeof createTestAuthContext> };
    const next = vi.fn() as NextFunction;
    middleware.use(request, response({}), next);
    expect(() => middleware.use(request, response({}), next)).toThrow();
  });

  it("audits authorization denials with route metadata and no sensitive payload", async () => {
    const audit = new AuditService();
    const interceptor = new SecurityAuditInterceptor(audit);
    const request = {
      path: "/providers",
      method: "PATCH",
      route: { path: "/providers" },
      authContext: createTestAuthContext(),
    };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
    const next = {
      handle: () => throwError(() => new ForbiddenException("denied")),
    } as CallHandler;
    await expect(firstValueFrom(interceptor.intercept(context, next))).rejects.toThrow();
    expect(audit.getEntries(request.authContext.tenantId)[0]).toMatchObject({
      action: "security.request_denied",
      targetId: "/providers",
      metadata: { status: 403, method: "PATCH" },
    });
  });
});
