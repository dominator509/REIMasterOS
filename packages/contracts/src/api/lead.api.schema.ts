import { z } from "zod";
import { LeadResponseSchema, CreateLeadSchema } from "../lead.schema.js";
import { PaginationParamsSchema, PaginatedResponseSchema } from "../pagination.schema.js";

export const LeadListQuerySchema = PaginationParamsSchema.extend({
  status: z
    .enum(["new", "contacted", "negotiating", "under_contract", "closed", "dead", "archived"])
    .optional(),
  source: z.string().optional(),
  minScore: z.coerce.number().optional(),
});

export const LeadCreateRequestSchema = CreateLeadSchema;
export const LeadResponseDataSchema = LeadResponseSchema;
export const LeadListResponseSchema = PaginatedResponseSchema(LeadResponseSchema);

export type LeadListQuery = z.infer<typeof LeadListQuerySchema>;
