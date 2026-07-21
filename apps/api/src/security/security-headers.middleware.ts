import { Inject, Injectable, type NestMiddleware } from "@nestjs/common";
import type { AuthConfig } from "@rei-os/config";
import type { Request, Response, NextFunction } from "express";
import { AUTH_CONFIG } from "../auth/session/auth-session.service.js";

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  constructor(@Inject(AUTH_CONFIG) private readonly config: AuthConfig) {}

  use(_req: Request, res: Response, next: NextFunction) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "0");
    res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    res.setHeader("Cache-Control", "no-store");
    if (this.config.APP_ENV === "staging" || this.config.APP_ENV === "production") {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
  }
}
