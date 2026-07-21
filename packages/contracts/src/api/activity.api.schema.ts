import { z } from "zod";
import { PaginationParamsSchema } from "../pagination.schema.js";
import { ApiPaginatedResponseSchema } from "./response-envelope.schema.js";

export const ActivityEventResponseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  actorId: z.string().min(1),
  action: z.string().min(1),
  targetType: z.string().min(1),
  targetId: z.string().min(1),
  metadata: z.record(z.unknown()),
  timestamp: z.string().datetime(),
});

export const ActivityListQuerySchema = PaginationParamsSchema.extend({
  targetType: z.string().optional(),
  targetId: z.string().optional(),
});
export const ActivityListResponseSchema = ApiPaginatedResponseSchema(ActivityEventResponseSchema);

export type ActivityEventResponse = z.infer<typeof ActivityEventResponseSchema>;
export type ActivityListQuery = z.infer<typeof ActivityListQuerySchema>;
