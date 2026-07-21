import { Injectable, NotFoundException } from "@nestjs/common";
import type { LeadCreateRequest, LeadListQuery, LeadResponse } from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import { successResponse, paginatedResponse, errorResponse } from "../common/response.envelope.js";
import { TenantMemoryStore } from "../common/tenant-memory-store.js";
import type { AuthContext } from "../auth/auth-context.interface.js";
import { assertPermission } from "../auth/authorization.js";
import { ActivityService } from "../activity/activity.service.js";

@Injectable()
export class LeadsService {
  private readonly store = new TenantMemoryStore<LeadResponse>();

  constructor(private readonly activities: ActivityService) {}

  async list(context: AuthContext, query: LeadListQuery) {
    assertPermission(context, PERMISSIONS.LEAD_READ);
    const items = this.store.list(context.tenantId);
    const filtered = query.status ? items.filter((item) => item.status === query.status) : items;
    const offset = (query.page - 1) * query.limit;
    return paginatedResponse(
      filtered.slice(offset, offset + query.limit),
      filtered.length,
      query.page,
      query.limit,
      { tenantId: context.tenantId },
    );
  }

  async getById(context: AuthContext, id: string) {
    assertPermission(context, PERMISSIONS.LEAD_READ);
    const item = this.store.get(context.tenantId, id);
    if (!item) throw new NotFoundException(errorResponse("NOT_FOUND", `Lead ${id} not found`));
    return successResponse(item, { tenantId: context.tenantId });
  }

  async create(context: AuthContext, body: LeadCreateRequest) {
    assertPermission(context, PERMISSIONS.LEAD_WRITE);
    const now = new Date().toISOString();
    const lead: LeadResponse = {
      id: crypto.randomUUID(),
      tenantId: context.tenantId,
      ...body,
      source: body.source ?? "manual",
      score: 0,
      status: "new",
      notes: "",
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(lead);
    this.activities.record(context, {
      action: "lead.created",
      targetType: "lead",
      targetId: lead.id,
    });
    return successResponse(lead, { tenantId: context.tenantId });
  }
}
