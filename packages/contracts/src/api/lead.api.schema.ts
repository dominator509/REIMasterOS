import { z } from "zod";
import { LeadResponseSchema, CreateLeadSchema } from "../lead.schema.js";
import { PaginationParamsSchema } from "../pagination.schema.js";
import { ApiPaginatedResponseSchema } from "./response-envelope.schema.js";

export const LeadListQuerySchema = PaginationParamsSchema.extend({
  status: z
    .enum(["new", "contacted", "negotiating", "under_contract", "closed", "dead", "archived"])
    .optional(),
  source: z.string().optional(),
  minScore: z.coerce.number().optional(),
});

export const LeadCreateRequestSchema = CreateLeadSchema.omit({ tenantId: true }).strict();
export const LeadResponseDataSchema = LeadResponseSchema;
export const LeadListResponseSchema = ApiPaginatedResponseSchema(LeadResponseSchema);

export type LeadListQuery = z.infer<typeof LeadListQuerySchema>;
export type LeadCreateRequest = z.infer<typeof LeadCreateRequestSchema>;
