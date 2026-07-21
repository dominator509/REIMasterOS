import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { hasPermission, type Permission } from "@rei-os/domain";
import { errorResponse } from "../common/response.envelope.js";
import type { AuthContext } from "./auth-context.interface.js";

export function assertPermission(context: AuthContext, permission: Permission): void {
  if (!context.isAuthenticated) {
    throw new UnauthorizedException(
      errorResponse("UNAUTHENTICATED", "Authentication is required."),
    );
  }
  const delegated = context.delegatedPermissions;
  const allowed = delegated
    ? delegated.includes(permission)
    : hasPermission(context.role, permission);
  if (!allowed) {
    throw new ForbiddenException(errorResponse("FORBIDDEN", "Permission denied."));
  }
}

export function assertMfa(context: AuthContext): void {
  if (!context.isMfaVerified) {
    throw new ForbiddenException(
      errorResponse("APPROVAL_REQUIRED", "Multi-factor verification is required."),
    );
  }
}

export function assertIntegrationScope(context: AuthContext, scope: string): void {
  if (!context.integrationScopes.includes(scope)) {
    throw new ForbiddenException(errorResponse("FORBIDDEN", "Integration scope denied."));
  }
}
