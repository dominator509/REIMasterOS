import { z } from "zod";
import { ErrorCodeSchema, ErrorDetailSchema } from "../errors/error-codes.schema.js";

export const ApiMetaSchema = z.object({
  requestId: z.string().min(1),
  tenantId: z.string().min(1).optional(),
});

export const ApiResponseEnvelopeSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    meta: ApiMetaSchema,
  });

export const ApiErrorEnvelopeSchema = z.object({
  error: z.object({
    code: ErrorCodeSchema,
    message: z.string().min(1),
    details: z.array(ErrorDetailSchema).optional(),
  }),
  meta: ApiMetaSchema.omit({ tenantId: true }),
});

export const ApiPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  ApiResponseEnvelopeSchema(
    z.object({
      items: z.array(itemSchema),
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      totalPages: z.number().int().nonnegative(),
    }),
  );

export type ApiMeta = z.infer<typeof ApiMetaSchema>;
export type ApiErrorEnvelope = z.infer<typeof ApiErrorEnvelopeSchema>;
export type ApiResponse<T> = { data: T; meta: ApiMeta };
