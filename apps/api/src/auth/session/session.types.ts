import type { Role } from "@rei-os/domain";

export interface SessionClaims {
  readonly sessionId: string;
  readonly userId: string;
  readonly tenantId: string;
  readonly role: Role;
  readonly issuedAt: number;
  readonly expiresAt: number;
  readonly idleExpiresAt: number;
  readonly isMfaVerified: boolean;
  readonly integrationScopes: readonly string[];
}

export interface NewSessionInput {
  readonly userId: string;
  readonly tenantId: string;
  readonly role: Role;
  readonly isMfaVerified?: boolean;
  readonly integrationScopes?: readonly string[];
}
