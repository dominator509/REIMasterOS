import { z } from "zod";

export const LeadSourceSchema = z.enum([
  "csv_import",
  "provider_api",
  "manual",
  "website",
  "referral",
  "other",
]);

export const LeadStatusSchema = z.enum([
  "new",
  "contacted",
  "negotiating",
  "under_contract",
  "closed",
  "dead",
  "archived",
]);

export const CreateLeadSchema = z.object({
  tenantId: z.string().uuid(),
  propertyId: z.string().uuid(),
  ownerId: z.string().uuid(),
  source: LeadSourceSchema.default("manual"),
});

export const LeadResponseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  propertyId: z.string().uuid(),
  ownerId: z.string().uuid(),
  source: LeadSourceSchema,
  score: z.number().min(0).max(100),
  status: LeadStatusSchema,
  notes: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreateLead = z.infer<typeof CreateLeadSchema>;
export type LeadResponse = z.infer<typeof LeadResponseSchema>;
