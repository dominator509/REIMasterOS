import { Injectable, NotFoundException } from "@nestjs/common";
import type { ContactCreateRequest, ContactListQuery, ContactResponse } from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import { errorResponse, paginatedResponse, successResponse } from "../common/response.envelope.js";
import { TenantMemoryStore } from "../common/tenant-memory-store.js";
import type { AuthContext } from "../auth/auth-context.interface.js";
import { assertPermission } from "../auth/authorization.js";
import { ActivityService } from "../activity/activity.service.js";

@Injectable()
export class ContactsService {
  private readonly store = new TenantMemoryStore<ContactResponse>();

  constructor(private readonly activities: ActivityService) {}

  async list(context: AuthContext, query: ContactListQuery) {
    assertPermission(context, PERMISSIONS.CONTACT_READ);
    const all = this.store.list(context.tenantId);
    const filtered = query.contactType
      ? all.filter((item) => item.contactType === query.contactType)
      : all;
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
    assertPermission(context, PERMISSIONS.CONTACT_READ);
    const item = this.store.get(context.tenantId, id);
    if (!item) throw new NotFoundException(errorResponse("NOT_FOUND", `Contact ${id} not found`));
    return successResponse(item, { tenantId: context.tenantId });
  }

  async create(context: AuthContext, body: ContactCreateRequest) {
    assertPermission(context, PERMISSIONS.CONTACT_WRITE);
    const now = new Date().toISOString();
    const contact: ContactResponse = {
      id: crypto.randomUUID(),
      tenantId: context.tenantId,
      ...body,
      email: body.email ?? null,
      phone: body.phone ?? null,
      contactType: body.contactType ?? "other",
      tags: [],
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(contact);
    this.activities.record(context, {
      action: "contact.created",
      targetType: "contact",
      targetId: contact.id,
    });
    return successResponse(contact, { tenantId: context.tenantId });
  }
}
