import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import type { AuthContext } from "./auth-context.interface.js";
import { errorResponse } from "../common/response.envelope.js";
import { AuditService } from "../audit/audit.service.js";

function hasRequiredContext(context: AuthContext | undefined): boolean {
  return Boolean(
    context?.isAuthenticated &&
    context.userId.trim() &&
    context.tenantId.trim() &&
    context.sessionId.trim(),
  );
}

export interface RequestWithAuthContext {
  authContext?: AuthContext;
  requestId?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AuditService) private readonly audit: AuditService = new AuditService()) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithAuthContext>();
    if (!hasRequiredContext(request.authContext)) {
      this.audit.log({
        timestamp: new Date().toISOString(),
        action: "auth.denied",
        actorId: request.authContext?.userId ?? "anonymous",
        tenantId: request.authContext?.tenantId ?? "unknown",
        targetType: "session",
        targetId: request.authContext?.sessionId ?? "missing",
        metadata: { reason: "missing_or_invalid_context" },
      });
      throw new UnauthorizedException(
        errorResponse(
          "UNAUTHENTICATED",
          "Authentication is required.",
          undefined,
          request.requestId,
        ),
      );
    }
    return true;
  }
}
