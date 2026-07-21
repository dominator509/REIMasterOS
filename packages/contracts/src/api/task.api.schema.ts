import { z } from "zod";
import { PaginationParamsSchema } from "../pagination.schema.js";
import { ApiPaginatedResponseSchema } from "./response-envelope.schema.js";

export const TaskPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
export const TaskStatusSchema = z.enum(["todo", "in_progress", "blocked", "done", "cancelled"]);

export const TaskCreateRequestSchema = z.object({
  title: z.string().trim().min(1).max(300),
  description: z.string().max(5000).default(""),
  assigneeId: z.string().min(1).optional(),
  dueDate: z.string().datetime().optional(),
  priority: TaskPrioritySchema.default("medium"),
  relatedEntityType: z.string().max(100).optional(),
  relatedEntityId: z.string().uuid().optional(),
});

export const TaskResponseSchema = TaskCreateRequestSchema.extend({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  status: TaskStatusSchema,
  tags: z.array(z.string()),
  completedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const TaskListQuerySchema = PaginationParamsSchema.extend({
  status: TaskStatusSchema.optional(),
});
export const TaskListResponseSchema = ApiPaginatedResponseSchema(TaskResponseSchema);

export type TaskCreateRequest = z.infer<typeof TaskCreateRequestSchema>;
export type TaskResponse = z.infer<typeof TaskResponseSchema>;
export type TaskListQuery = z.infer<typeof TaskListQuerySchema>;
