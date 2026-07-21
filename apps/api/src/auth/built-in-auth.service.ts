import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Role } from "@rei-os/domain";
import { errorResponse } from "../common/response.envelope.js";
import { AuthSessionService } from "./session/auth-session.service.js";
import { AuditService } from "../audit/audit.service.js";

export interface BuiltInIdentity {
  readonly userId: string;
  readonly tenantId: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly role: Role;
  readonly disabled: boolean;
}

export interface IdentityStore {
  findByEmail(normalizedEmail: string): Promise<BuiltInIdentity | undefined>;
}

export const IDENTITY_STORE = Symbol("IDENTITY_STORE");

export class DenyAllIdentityStore implements IdentityStore {
  async findByEmail(): Promise<undefined> {
    return undefined;
  }
}

export function hashPassword(password: string, salt = randomBytes(16)): string {
  const derived = scryptSync(password, salt, 32);
  return `scrypt$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [algorithm, saltText, hashText, extra] = stored.split("$");
  if (algorithm !== "scrypt" || !saltText || !hashText || extra) return false;
  try {
    const expected = Buffer.from(hashText, "base64url");
    const actual = scryptSync(password, Buffer.from(saltText, "base64url"), expected.length);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

@Injectable()
export class BuiltInAuthService {
  constructor(
    @Inject(AuthSessionService) private readonly sessions: AuthSessionService,
    @Inject(IDENTITY_STORE) private readonly identities: IdentityStore = new DenyAllIdentityStore(),
    @Inject(AuditService) private readonly audit: AuditService = new AuditService(),
  ) {}

  async login(email: string, password: string) {
    const identity = await this.identities.findByEmail(email.trim().toLowerCase());
    if (!identity || identity.disabled || !verifyPassword(password, identity.passwordHash)) {
      this.audit.log({
        timestamp: new Date().toISOString(),
        action: "auth.login_denied",
        actorId: "anonymous",
        tenantId: identity?.tenantId ?? "unknown",
        targetType: "identity_hash",
        targetId: createHash("sha256").update(email.trim().toLowerCase()).digest("hex"),
        metadata: { reason: identity?.disabled ? "disabled" : "invalid_credentials" },
      });
      throw new UnauthorizedException(
        errorResponse("UNAUTHENTICATED", "The email or password is invalid."),
      );
    }
    const session = this.sessions.create({
      userId: identity.userId,
      tenantId: identity.tenantId,
      role: identity.role,
    });
    this.audit.log({
      timestamp: new Date().toISOString(),
      action: "auth.login_succeeded",
      actorId: identity.userId,
      tenantId: identity.tenantId,
      targetType: "session",
      targetId: session.claims.sessionId,
      metadata: {},
    });
    return session;
  }
}
