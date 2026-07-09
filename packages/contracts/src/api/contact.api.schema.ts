import { z } from "zod";
import { ContactResponseSchema, CreateContactSchema } from "../contact.schema.js";
import { PaginationParamsSchema, PaginatedResponseSchema } from "../pagination.schema.js";

export const ContactListQuerySchema = PaginationParamsSchema.extend({
  contactType: z.string().optional(),
  search: z.string().optional(),
});

export const ContactCreateRequestSchema = CreateContactSchema;
export const ContactResponseDataSchema = ContactResponseSchema;
export const ContactListResponseSchema = PaginatedResponseSchema(ContactResponseSchema);
