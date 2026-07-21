import { Inject, Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import type { RequestWithAuthContext } from "../auth.guard.js";
import { AuthSessionService } from "./auth-session.service.js";

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
export class SessionMiddleware implements NestMiddleware {
  constructor(@Inject(AuthSessionService) private readonly sessions: AuthSessionService) {}

  use(request: Request & RequestWithAuthContext, _response: Response, next: NextFunction): void {
    const token = readCookie(request.headers.cookie, this.sessions.cookieName);
    if (token) request.authContext = this.sessions.verify(token);
    next();
  }
}
