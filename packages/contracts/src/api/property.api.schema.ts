import { z } from "zod";
import { PropertyResponseSchema, CreatePropertySchema } from "../property.schema.js";
import { PaginationParamsSchema } from "../pagination.schema.js";
import { ApiPaginatedResponseSchema } from "./response-envelope.schema.js";

export const PropertyListQuerySchema = PaginationParamsSchema.extend({
  status: z.enum(["active", "inactive", "archived"]).optional(),
  search: z.string().optional(),
  propertyType: z.string().optional(),
});

export const PropertyCreateRequestSchema = CreatePropertySchema.omit({ tenantId: true }).strict();
export const PropertyResponseDataSchema = PropertyResponseSchema;
export const PropertyListResponseSchema = ApiPaginatedResponseSchema(PropertyResponseSchema);

export type PropertyListQuery = z.infer<typeof PropertyListQuerySchema>;
export type PropertyCreateRequest = z.infer<typeof PropertyCreateRequestSchema>;
