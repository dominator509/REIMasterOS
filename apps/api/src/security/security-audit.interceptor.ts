import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  type NestInterceptor,
} from "@nestjs/common";
import type { Request } from "express";
import type { Observable } from "rxjs";
import { catchError, throwError } from "rxjs";
import { AuditService } from "../audit/audit.service.js";
import type { AuthenticatedRequest } from "../auth/request-context.js";

@Injectable()
export class SecurityAuditInterceptor implements NestInterceptor {
  constructor(@Inject(AuditService) private readonly audit: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & AuthenticatedRequest>();
    return next.handle().pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpException && [401, 403, 429].includes(error.getStatus())) {
          const auth = request.authContext;
          this.audit.log({
            timestamp: new Date().toISOString(),
            action: error.getStatus() === 429 ? "security.rate_limited" : "security.request_denied",
            actorId: auth?.userId ?? "anonymous",
            tenantId: auth?.tenantId ?? "unknown",
            targetType: "route",
            targetId: request.route?.path ?? request.path,
            metadata: { status: error.getStatus(), method: request.method },
          });
        }
        return throwError(() => error);
      }),
    );
  }
}
