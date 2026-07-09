import { z } from "zod";

export const ErrorCodeSchema = z.enum([
  "VALIDATION_ERROR",
  "NOT_FOUND",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "COMPLIANCE_BLOCKED",
  "APPROVAL_REQUIRED",
  "CONFLICT",
  "RATE_LIMITED",
  "PROVIDER_UNAVAILABLE",
  "TENANT_NOT_FOUND",
  "CROSS_TENANT_ACCESS_DENIED",
  "INTERNAL_ERROR",
  "SERVICE_UNAVAILABLE",
  "NOT_IMPLEMENTED",
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export const ErrorDetailSchema = z.object({
  code: ErrorCodeSchema,
  message: z.string(),
  field: z.string().optional(),
  details: z.unknown().optional(),
  timestamp: z.string().datetime(),
});

export type ErrorDetail = z.infer<typeof ErrorDetailSchema>;
