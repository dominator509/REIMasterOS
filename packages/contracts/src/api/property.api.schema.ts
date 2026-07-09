import { z } from "zod";
import { PropertyResponseSchema, CreatePropertySchema } from "../property.schema.js";
import { PaginationParamsSchema, PaginatedResponseSchema } from "../pagination.schema.js";

export const PropertyListQuerySchema = PaginationParamsSchema.extend({
  status: z.enum(["active", "inactive", "archived"]).optional(),
  search: z.string().optional(),
  propertyType: z.string().optional(),
});

export const PropertyCreateRequestSchema = CreatePropertySchema;
export const PropertyResponseDataSchema = PropertyResponseSchema;
export const PropertyListResponseSchema = PaginatedResponseSchema(PropertyResponseSchema);

export type PropertyListQuery = z.infer<typeof PropertyListQuerySchema>;
