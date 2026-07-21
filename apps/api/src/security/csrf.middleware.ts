import { ForbiddenException, Inject, Injectable, type NestMiddleware } from "@nestjs/common";
import type { AuthConfig } from "@rei-os/config";
import type { NextFunction, Request, Response } from "express";
import { AUTH_CONFIG } from "../auth/session/auth-session.service.js";
import { errorResponse } from "../common/response.envelope.js";

function readCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) return part.slice(separator + 1).trim();
  }
  return undefined;
}

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(@Inject(AUTH_CONFIG) private readonly config: AuthConfig) {}

  use(request: Request, _response: Response, next: NextFunction): void {
    if (["GET", "HEAD", "OPTIONS"].includes(request.method.toUpperCase())) return next();
    const session = readCookie(request.headers.cookie, this.config.SESSION_COOKIE_NAME);
    if (!session) return next();
    const csrfCookie = readCookie(request.headers.cookie, this.config.CSRF_COOKIE_NAME);
    const csrfHeader = request.headers["x-csrf-token"];
    if (!csrfCookie || typeof csrfHeader !== "string" || csrfCookie !== csrfHeader) {
      throw new ForbiddenException(errorResponse("FORBIDDEN", "CSRF verification failed."));
    }
    next();
  }
}
