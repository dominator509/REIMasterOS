import { Injectable, NotFoundException } from "@nestjs/common";
import type { PropertyCreateRequest, PropertyListQuery, PropertyResponse } from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import { successResponse, paginatedResponse, errorResponse } from "../common/response.envelope.js";
import { TenantMemoryStore } from "../common/tenant-memory-store.js";
import type { AuthContext } from "../auth/auth-context.interface.js";
import { assertPermission } from "../auth/authorization.js";
import { ActivityService } from "../activity/activity.service.js";

@Injectable()
export class PropertiesService {
  private readonly store = new TenantMemoryStore<PropertyResponse>();

  constructor(private readonly activities: ActivityService) {}

  async list(context: AuthContext, query: PropertyListQuery) {
    assertPermission(context, PERMISSIONS.PROPERTY_READ);
    const all = this.store.list(context.tenantId);
    const filtered = query.status ? all.filter((item) => item.status === query.status) : all;
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
    assertPermission(context, PERMISSIONS.PROPERTY_READ);
    const item = this.store.get(context.tenantId, id);
    if (!item) throw new NotFoundException(errorResponse("NOT_FOUND", `Property ${id} not found`));
    return successResponse(item, { tenantId: context.tenantId });
  }

  async create(context: AuthContext, body: PropertyCreateRequest) {
    assertPermission(context, PERMISSIONS.PROPERTY_WRITE);
    const now = new Date().toISOString();
    const property: PropertyResponse = {
      id: crypto.randomUUID(),
      tenantId: context.tenantId,
      ...body,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(property);
    this.activities.record(context, {
      action: "property.created",
      targetType: "property",
      targetId: property.id,
    });
    return successResponse(property, { tenantId: context.tenantId });
  }
}
