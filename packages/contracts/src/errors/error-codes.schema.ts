import { z } from "zod";

export const ErrorCodeSchema = z.enum([
  "VALIDATION_FAILED",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "TENANT_NOT_FOUND",
  "NOT_FOUND",
  "CONFLICT",
  "COMPLIANCE_BLOCKED",
  "APPROVAL_REQUIRED",
  "PROVIDER_NOT_CONFIGURED",
  "PROVIDER_UNAVAILABLE",
  "RATE_LIMITED",
  "IMPORT_FAILED",
  "EXPORT_FAILED",
  "AI_ROUTE_DISABLED",
  "AI_SANITIZER_BLOCKED",
  "AI_POLICY_BLOCKED",
  "MIGRATION_FAILED",
  "DEPENDENCY_UNAVAILABLE",
  "INTERNAL_ERROR",
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export const ErrorDetailSchema = z.object({
  message: z.string(),
  field: z.string().optional(),
  code: z.string().optional(),
});

export type ErrorDetail = z.infer<typeof ErrorDetailSchema>;
