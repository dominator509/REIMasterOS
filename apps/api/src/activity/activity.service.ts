import { Injectable } from "@nestjs/common";
import type { ActivityEventResponse, ActivityListQuery } from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import type { AuthContext } from "../auth/auth-context.interface.js";
import { assertPermission } from "../auth/authorization.js";
import { paginatedResponse, successResponse } from "../common/response.envelope.js";
import { AuditService, redactSensitive } from "../audit/audit.service.js";

export interface ActivityWrite {
  readonly action: string;
  readonly targetType: string;
  readonly targetId: string;
  readonly metadata?: Record<string, unknown>;
}

@Injectable()
export class ActivityService {
  private readonly events: ActivityEventResponse[] = [];

  constructor(private readonly audit: AuditService) {}

  record(
    context: AuthContext,
    input: ActivityWrite,
  ): ReturnType<typeof successResponse<ActivityEventResponse>> {
    const timestamp = new Date().toISOString();
    const metadata = redactSensitive(input.metadata ?? {});
    const event: ActivityEventResponse = {
      id: crypto.randomUUID(),
      tenantId: context.tenantId,
      actorId: context.userId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata,
      timestamp,
    };
    this.events.push(event);
    this.audit.log({
      timestamp,
      action: input.action,
      actorId: context.userId,
      tenantId: context.tenantId,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata,
    });
    return successResponse(event, { tenantId: context.tenantId });
  }

  list(context: AuthContext, query: ActivityListQuery) {
    assertPermission(context, PERMISSIONS.COMPLIANCE_READ);
    const filtered = this.events.filter(
      (event) =>
        event.tenantId === context.tenantId &&
        (!query.targetType || event.targetType === query.targetType) &&
        (!query.targetId || event.targetId === query.targetId),
    );
    const offset = (query.page - 1) * query.limit;
    return paginatedResponse(
      filtered.slice(offset, offset + query.limit),
      filtered.length,
      query.page,
      query.limit,
      { tenantId: context.tenantId },
    );
  }
}
