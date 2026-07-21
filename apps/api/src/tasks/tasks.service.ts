import { Injectable, NotFoundException } from "@nestjs/common";
import type { TaskCreateRequest, TaskListQuery, TaskResponse } from "@rei-os/contracts";
import { PERMISSIONS } from "@rei-os/domain";
import { ActivityService } from "../activity/activity.service.js";
import type { AuthContext } from "../auth/auth-context.interface.js";
import { assertPermission } from "../auth/authorization.js";
import { errorResponse, paginatedResponse, successResponse } from "../common/response.envelope.js";
import { TenantMemoryStore } from "../common/tenant-memory-store.js";

@Injectable()
export class TasksService {
  private readonly store = new TenantMemoryStore<TaskResponse>();

  constructor(private readonly activities: ActivityService) {}

  list(context: AuthContext, query: TaskListQuery) {
    assertPermission(context, PERMISSIONS.TASK_READ);
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

  get(context: AuthContext, id: string) {
    assertPermission(context, PERMISSIONS.TASK_READ);
    const record = this.store.get(context.tenantId, id);
    if (!record) throw new NotFoundException(errorResponse("NOT_FOUND", `Task ${id} not found`));
    return successResponse(record, { tenantId: context.tenantId });
  }

  create(context: AuthContext, input: TaskCreateRequest) {
    assertPermission(context, PERMISSIONS.TASK_WRITE);
    const now = new Date().toISOString();
    const record: TaskResponse = {
      id: crypto.randomUUID(),
      tenantId: context.tenantId,
      title: input.title,
      description: input.description ?? "",
      ...(input.assigneeId ? { assigneeId: input.assigneeId } : {}),
      ...(input.dueDate ? { dueDate: input.dueDate } : {}),
      priority: input.priority ?? "medium",
      ...(input.relatedEntityType ? { relatedEntityType: input.relatedEntityType } : {}),
      ...(input.relatedEntityId ? { relatedEntityId: input.relatedEntityId } : {}),
      status: "todo",
      tags: [],
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(record);
    this.activities.record(context, {
      action: "task.created",
      targetType: "task",
      targetId: record.id,
    });
    return successResponse(record, { tenantId: context.tenantId });
  }
}
