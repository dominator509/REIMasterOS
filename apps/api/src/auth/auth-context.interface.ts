import type { TenantId, UserId } from "@rei-os/domain";
import type { Role } from "@rei-os/domain";

/** Auth context for request processing — provided by guards. */
export interface AuthContext {
  readonly userId: UserId;
  readonly tenantId: TenantId;
  readonly role: Role;
  readonly sessionId: string;
  readonly isAuthenticated: boolean;
  readonly isMfaVerified: boolean;
}

export function createTestAuthContext(overrides?: Partial<AuthContext>): AuthContext {
  return {
    userId: "u-test" as UserId,
    tenantId: "t-test" as TenantId,
    role: "admin",
    sessionId: "test-session",
    isAuthenticated: true,
    isMfaVerified: false,
    ...overrides,
  };
}
