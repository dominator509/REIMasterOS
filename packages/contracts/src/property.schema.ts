import { z } from "zod";

export const PropertyAddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zip: z.string().min(5).max(10),
  county: z.string().optional(),
});

export const PropertyCharacteristicsSchema = z.object({
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().positive().optional(),
  squareFeet: z.number().positive().optional(),
  lotSize: z.number().positive().optional(),
  yearBuilt: z.number().int().gte(1800).lte(2030).optional(),
  propertyType: z.enum([
    "single_family",
    "multi_family",
    "condo",
    "townhouse",
    "land",
    "commercial",
    "other",
  ]),
});

export const PropertyStatusSchema = z.enum(["active", "inactive", "archived"]);

export const CreatePropertySchema = z.object({
  tenantId: z.string().uuid(),
  address: PropertyAddressSchema,
  characteristics: PropertyCharacteristicsSchema,
});

export const PropertyResponseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  address: PropertyAddressSchema,
  characteristics: PropertyCharacteristicsSchema,
  status: PropertyStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CreateProperty = z.infer<typeof CreatePropertySchema>;
export type PropertyResponse = z.infer<typeof PropertyResponseSchema>;
