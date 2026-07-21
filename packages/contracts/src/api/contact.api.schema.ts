import { z } from "zod";
import { ContactResponseSchema, CreateContactSchema } from "../contact.schema.js";
import { PaginationParamsSchema } from "../pagination.schema.js";
import { ApiPaginatedResponseSchema } from "./response-envelope.schema.js";

export const ContactListQuerySchema = PaginationParamsSchema.extend({
  contactType: z.string().optional(),
  search: z.string().optional(),
});

export const ContactCreateRequestSchema = CreateContactSchema.omit({ tenantId: true }).strict();
export const ContactResponseDataSchema = ContactResponseSchema;
export const ContactListResponseSchema = ApiPaginatedResponseSchema(ContactResponseSchema);

export type ContactListQuery = z.infer<typeof ContactListQuerySchema>;
export type ContactCreateRequest = z.infer<typeof ContactCreateRequestSchema>;
