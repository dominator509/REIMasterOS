import { UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { errorResponse, type ResponseMetaInput } from "../common/response.envelope.js";
import type { AuthContext } from "./auth-context.interface.js";

export interface AuthenticatedRequest extends Request {
  authContext?: AuthContext;
  requestId?: string;
}

export function requireAuthContext(request: AuthenticatedRequest): AuthContext {
  if (
    !request.authContext?.isAuthenticated ||
    !request.authContext.userId.trim() ||
    !request.authContext.tenantId.trim() ||
    !request.authContext.sessionId.trim()
  ) {
    throw new UnauthorizedException(
      errorResponse("UNAUTHENTICATED", "Authentication is required.", undefined, request.requestId),
    );
  }
  return request.authContext;
}

export function responseMetaFor(
  request: Pick<AuthenticatedRequest, "requestId">,
  context: AuthContext,
): ResponseMetaInput {
  return { requestId: request.requestId, tenantId: context.tenantId };
}
