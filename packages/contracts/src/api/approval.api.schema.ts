import { z } from "zod";
import { PaginationParamsSchema } from "../pagination.schema.js";
import { ApiPaginatedResponseSchema } from "./response-envelope.schema.js";

export const ApprovalStatusSchema = z.enum(["pending", "approved", "denied", "expired"]);
export const ApprovalCreateRequestSchema = z.object({
  action: z.string().min(1),
  evidenceRefs: z.array(z.string()).default([]),
  expiresAt: z.string().datetime().optional(),
});
export const ApprovalDecisionRequestSchema = z.object({
  decision: z.enum(["approved", "denied"]),
  mfaVerified: z.literal(true),
});
export const ApprovalResponseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  action: z.string(),
  status: ApprovalStatusSchema,
  requestedBy: z.string().min(1),
  approvedBy: z.string().min(1).optional(),
  evidenceRefs: z.array(z.string()),
  expiresAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export const ApprovalListQuerySchema = PaginationParamsSchema.extend({
  status: ApprovalStatusSchema.optional(),
});
export const ApprovalListResponseSchema = ApiPaginatedResponseSchema(ApprovalResponseSchema);

export type ApprovalCreateRequest = z.infer<typeof ApprovalCreateRequestSchema>;
export type ApprovalDecisionRequest = z.infer<typeof ApprovalDecisionRequestSchema>;
export type ApprovalResponse = z.infer<typeof ApprovalResponseSchema>;
export type ApprovalListQuery = z.infer<typeof ApprovalListQuerySchema>;
