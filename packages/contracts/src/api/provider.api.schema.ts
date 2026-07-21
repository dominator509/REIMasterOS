import { z } from "zod";
import { ApiResponseEnvelopeSchema } from "./response-envelope.schema.js";

export const ProviderHealthStatusSchema = z.enum([
  "healthy",
  "degraded",
  "unavailable",
  "not_configured",
  "disabled",
]);
export const ProviderHealthResponseSchema = z.object({
  provider: z.string().min(1),
  category: z.string().min(1),
  status: ProviderHealthStatusSchema,
  fallback: z.string().optional(),
  checkedAt: z.string().datetime(),
});
export const ProviderHealthListResponseSchema = ApiResponseEnvelopeSchema(
  z.array(ProviderHealthResponseSchema),
);

export type ProviderHealthResponse = z.infer<typeof ProviderHealthResponseSchema>;
