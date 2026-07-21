import { HttpException, Inject, Injectable, type NestMiddleware } from "@nestjs/common";
import type { AuthConfig } from "@rei-os/config";
import type { NextFunction, Request, Response } from "express";
import { AUTH_CONFIG } from "../auth/session/auth-session.service.js";
import type { RequestWithAuthContext } from "../auth/auth.guard.js";
import { errorResponse } from "../common/response.envelope.js";

interface Bucket {
  count: number;
  resetAt: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly buckets = new Map<string, Bucket>();

  constructor(@Inject(AUTH_CONFIG) private readonly config: AuthConfig) {}

  use(request: Request & RequestWithAuthContext, response: Response, next: NextFunction): void {
    const path = request.path;
    const limit = path.startsWith("/auth")
      ? this.config.RATE_LIMIT_AUTH_ATTEMPTS
      : path.startsWith("/webhooks")
        ? this.config.RATE_LIMIT_WEBHOOK_REQUESTS
        : /\/(imports|exports|ai|campaigns)(\/|$)/.test(path)
          ? this.config.RATE_LIMIT_SENSITIVE_REQUESTS
          : undefined;
    if (!limit) return next();

    const now = Date.now();
    const windowMs = this.config.RATE_LIMIT_WINDOW_SECONDS * 1000;
    const principal = request.authContext?.tenantId ?? request.ip ?? "unknown";
    const key = `${principal}:${request.method}:${path}`;
    const current = this.buckets.get(key);
    const bucket =
      !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
    bucket.count += 1;
    this.buckets.set(key, bucket);
    response.setHeader("RateLimit-Limit", String(limit));
    response.setHeader("RateLimit-Remaining", String(Math.max(0, limit - bucket.count)));
    response.setHeader("RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));
    if (bucket.count > limit) {
      throw new HttpException(errorResponse("RATE_LIMITED", "Request rate limit exceeded."), 429);
    }
    next();
  }
}
