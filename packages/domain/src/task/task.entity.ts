import type { TenantId, EntityId, UserId } from "../value-objects/entity-id.js";

export interface Task {
  readonly id: EntityId;
  readonly tenantId: TenantId;
  readonly title: string;
  readonly description: string;
  readonly assigneeId?: UserId;
  readonly dueDate?: Date;
  readonly priority: TaskPriority;
  readonly status: TaskStatus;
  readonly relatedEntityType?: string;
  readonly relatedEntityId?: EntityId;
  readonly tags: readonly string[];
  readonly completedAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "blocked" | "done" | "cancelled";

export function createTask(params: {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  assigneeId?: string;
}): Task {
  if (!params.title.trim()) throw new Error("Task title is required");
  return {
    id: params.id as EntityId,
    tenantId: params.tenantId as TenantId,
    title: params.title.trim(),
    description: params.description ?? "",
    assigneeId: params.assigneeId as UserId | undefined,
    dueDate: params.dueDate,
    priority: params.priority ?? "medium",
    status: "todo",
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function completeTask(task: Task): Task {
  if (task.status === "done") throw new Error("Task is already done");
  return { ...task, status: "done", completedAt: new Date(), updatedAt: new Date() };
}
