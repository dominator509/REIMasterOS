import type { TenantId, UserId } from "@rei-os/domain";
import type { Permission, Role } from "@rei-os/domain";

/** Auth context for request processing — provided by guards. */
export interface AuthContext {
  readonly userId: UserId;
  readonly tenantId: TenantId;
  readonly role: Role;
  readonly sessionId: string;
  readonly isAuthenticated: boolean;
  readonly isMfaVerified: boolean;
  readonly integrationScopes: readonly string[];
  readonly delegatedPermissions?: readonly Permission[];
}

export function createTestAuthContext(overrides?: Partial<AuthContext>): AuthContext {
  return {
    userId: "00000000-0000-4000-8000-000000000001" as UserId,
    tenantId: "00000000-0000-4000-8000-000000000002" as TenantId,
    role: "admin",
    sessionId: "test-session",
    isAuthenticated: true,
    isMfaVerified: false,
    integrationScopes: [],
    ...overrides,
  };
}
