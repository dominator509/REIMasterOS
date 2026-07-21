import { z } from "zod";
import { PaginationParamsSchema } from "../pagination.schema.js";
import { ApiPaginatedResponseSchema } from "./response-envelope.schema.js";

export const LeadListStageSchema = z.enum([
  "importing",
  "scrubbing",
  "ready",
  "in_campaign",
  "archived",
]);

export const LeadListCreateRequestSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().max(2000).default(""),
});

export const LeadListRecordResponseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  name: z.string(),
  description: z.string(),
  sources: z.array(z.string()),
  tags: z.array(z.string()),
  stage: LeadListStageSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const LeadListCollectionQuerySchema = PaginationParamsSchema.extend({
  stage: LeadListStageSchema.optional(),
});
export const LeadListCollectionResponseSchema = ApiPaginatedResponseSchema(
  LeadListRecordResponseSchema,
);

export type LeadListCreateRequest = z.infer<typeof LeadListCreateRequestSchema>;
export type LeadListRecordResponse = z.infer<typeof LeadListRecordResponseSchema>;
export type LeadListCollectionQuery = z.infer<typeof LeadListCollectionQuerySchema>;
