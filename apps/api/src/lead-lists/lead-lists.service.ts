import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  LeadListCollectionQuery,
  LeadListCreateRequest,
  LeadListRecordResponse,
} from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import type { AuthContext } from "../auth/auth-context.interface.js";
import { assertPermission } from "../auth/authorization.js";
import { ActivityService } from "../activity/activity.service.js";
import { errorResponse, paginatedResponse, successResponse } from "../common/response.envelope.js";
import { TenantMemoryStore } from "../common/tenant-memory-store.js";

@Injectable()
export class LeadListsService {
  private readonly store = new TenantMemoryStore<LeadListRecordResponse>();

  constructor(private readonly activities: ActivityService) {}

  list(context: AuthContext, query: LeadListCollectionQuery) {
    assertPermission(context, PERMISSIONS.LEAD_READ);
    const all = this.store.list(context.tenantId);
    const filtered = query.stage ? all.filter((item) => item.stage === query.stage) : all;
    const offset = (query.page - 1) * query.limit;
    return paginatedResponse(
      filtered.slice(offset, offset + query.limit),
      filtered.length,
      query.page,
      query.limit,
      { tenantId: context.tenantId },
    );
  }

  get(context: AuthContext, id: string) {
    assertPermission(context, PERMISSIONS.LEAD_READ);
    const record = this.store.get(context.tenantId, id);
    if (!record)
      throw new NotFoundException(errorResponse("NOT_FOUND", `Lead list ${id} not found`));
    return successResponse(record, { tenantId: context.tenantId });
  }

  create(context: AuthContext, input: LeadListCreateRequest) {
    assertPermission(context, PERMISSIONS.LEAD_WRITE);
    const now = new Date().toISOString();
    const record: LeadListRecordResponse = {
      id: crypto.randomUUID(),
      tenantId: context.tenantId,
      name: input.name,
      description: input.description ?? "",
      sources: [],
      tags: [],
      stage: "importing",
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(record);
    this.activities.record(context, {
      action: "lead_list.created",
      targetType: "lead_list",
      targetId: record.id,
    });
    return successResponse(record, { tenantId: context.tenantId });
  }
}
