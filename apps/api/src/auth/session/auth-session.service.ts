import { createHmac, randomBytes, randomUUID, timingSafeEqual, type BinaryLike } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { loadAuthConfig, type AuthConfig } from "@rei-os/config";
import { ROLES, type Role, type TenantId, type UserId } from "@rei-os/domain";
import type { AuthContext } from "../auth-context.interface.js";
import type { NewSessionInput, SessionClaims } from "./session.types.js";

const roles = new Set<Role>(Object.values(ROLES));

export const AUTH_CONFIG = Symbol("AUTH_CONFIG");
export const AUTH_CLOCK = Symbol("AUTH_CLOCK");

function sign(value: BinaryLike, secret: string): Buffer {
  return createHmac("sha256", secret).update(value).digest();
}

function isSessionClaims(value: unknown): value is SessionClaims {
  if (!value || typeof value !== "object") return false;
  const claims = value as Record<string, unknown>;
  return (
    typeof claims["sessionId"] === "string" &&
    claims["sessionId"].trim().length > 0 &&
    typeof claims["userId"] === "string" &&
    claims["userId"].trim().length > 0 &&
    typeof claims["tenantId"] === "string" &&
    claims["tenantId"].trim().length > 0 &&
    typeof claims["role"] === "string" &&
    roles.has(claims["role"] as Role) &&
    typeof claims["issuedAt"] === "number" &&
    typeof claims["expiresAt"] === "number" &&
    typeof claims["idleExpiresAt"] === "number" &&
    typeof claims["isMfaVerified"] === "boolean" &&
    Array.isArray(claims["integrationScopes"]) &&
    claims["integrationScopes"].every((scope) => typeof scope === "string")
  );
}

@Injectable()
export class AuthSessionService {
  private readonly config: AuthConfig;
  private readonly now: () => number;

  constructor(
    @Inject(AUTH_CONFIG) config: AuthConfig = loadAuthConfig(),
    @Inject(AUTH_CLOCK) now: () => number = Date.now,
  ) {
    this.config = config;
    this.now = now;
  }

  get cookieName(): string {
    return this.config.SESSION_COOKIE_NAME;
  }

  create(input: NewSessionInput): {
    token: string;
    claims: SessionClaims;
    cookie: string;
    csrfToken: string;
    csrfCookie: string;
  } {
    if (!input.userId.trim() || !input.tenantId.trim()) {
      throw new Error("Session user and tenant context are required");
    }
    const nowSeconds = Math.floor(this.now() / 1000);
    const claims: SessionClaims = {
      sessionId: randomUUID(),
      userId: input.userId,
      tenantId: input.tenantId,
      role: input.role,
      issuedAt: nowSeconds,
      expiresAt: nowSeconds + this.config.SESSION_MAX_AGE_SECONDS,
      idleExpiresAt:
        nowSeconds +
        Math.min(this.config.SESSION_IDLE_TIMEOUT_SECONDS, this.config.SESSION_MAX_AGE_SECONDS),
      isMfaVerified: input.isMfaVerified ?? false,
      integrationScopes: [...(input.integrationScopes ?? [])],
    };
    const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
    const signature = sign(payload, this.config.SESSION_SECRET).toString("base64url");
    const token = `${payload}.${signature}`;
    const csrfToken = randomBytes(32).toString("base64url");
    return {
      token,
      claims,
      cookie: this.serializeCookie(token),
      csrfToken,
      csrfCookie: this.serializeCsrfCookie(csrfToken),
    };
  }

  verify(token: string): AuthContext | undefined {
    const [payload, signatureText, extra] = token.split(".");
    if (!payload || !signatureText || extra) return undefined;
    const expected = sign(payload, this.config.SESSION_SECRET);
    let actual: Buffer;
    try {
      actual = Buffer.from(signatureText, "base64url");
    } catch {
      return undefined;
    }
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return undefined;
    try {
      const claims: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
      if (!isSessionClaims(claims)) return undefined;
      const nowSeconds = Math.floor(this.now() / 1000);
      if (claims.expiresAt <= nowSeconds || claims.idleExpiresAt <= nowSeconds) return undefined;
      return {
        userId: claims.userId as UserId,
        tenantId: claims.tenantId as TenantId,
        role: claims.role,
        sessionId: claims.sessionId,
        isAuthenticated: true,
        isMfaVerified: claims.isMfaVerified,
        integrationScopes: claims.integrationScopes,
      };
    } catch {
      return undefined;
    }
  }

  clearCookie(): string {
    return this.serializeCookie("", 0);
  }

  clearCsrfCookie(): string {
    return this.serializeCsrfCookie("", 0);
  }

  private serializeCookie(value: string, maxAge = this.config.SESSION_MAX_AGE_SECONDS): string {
    const parts = [
      `${this.config.SESSION_COOKIE_NAME}=${value}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Strict",
      `Max-Age=${String(maxAge)}`,
    ];
    if (this.config.APP_ENV === "staging" || this.config.APP_ENV === "production") {
      parts.push("Secure");
    }
    return parts.join("; ");
  }

  private serializeCsrfCookie(value: string, maxAge = this.config.SESSION_MAX_AGE_SECONDS): string {
    const parts = [
      `${this.config.CSRF_COOKIE_NAME}=${value}`,
      "Path=/",
      "SameSite=Strict",
      `Max-Age=${String(maxAge)}`,
    ];
    if (this.config.APP_ENV === "staging" || this.config.APP_ENV === "production") {
      parts.push("Secure");
    }
    return parts.join("; ");
  }
}
