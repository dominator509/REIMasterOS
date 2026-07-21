import { Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ActivityModule } from "../activity/activity.module.js";
import { AuthModule } from "../auth/auth.module.js";
import { CsrfMiddleware } from "./csrf.middleware.js";
import { RateLimitMiddleware } from "./rate-limit.middleware.js";
import { SecurityAuditInterceptor } from "./security-audit.interceptor.js";
import { SecurityHeadersMiddleware } from "./security-headers.middleware.js";

@Global()
@Module({
  imports: [ActivityModule, AuthModule],
  providers: [
    SecurityHeadersMiddleware,
    CsrfMiddleware,
    RateLimitMiddleware,
    { provide: APP_INTERCEPTOR, useClass: SecurityAuditInterceptor },
  ],
  exports: [SecurityHeadersMiddleware, CsrfMiddleware, RateLimitMiddleware],
})
export class SecurityModule {}
