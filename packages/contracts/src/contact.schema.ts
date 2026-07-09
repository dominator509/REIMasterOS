import { z } from "zod";

export const ContactTypeSchema = z.enum([
  "owner",
  "agent",
  "buyer",
  "vendor",
  "team_member",
  "other",
]);

export const CreateContactSchema = z.object({
  tenantId: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  contactType: ContactTypeSchema.default("other"),
});

export const ContactResponseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  contactType: ContactTypeSchema,
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreateContact = z.infer<typeof CreateContactSchema>;
export type ContactResponse = z.infer<typeof ContactResponseSchema>;
