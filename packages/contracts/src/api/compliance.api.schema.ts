import { z } from "zod";

export const ComplianceCheckRequestSchema = z.object({
  channel: z.enum(["email", "direct_mail", "voice", "sms"]),
  contactId: z.string().uuid(),
  propertyId: z.string().uuid().optional(),
});

export const ComplianceVerdictSchema = z.object({
  verdict: z.enum(["allowed", "blocked", "needs_approval"]),
  reasonCodes: z.array(z.string()),
  evidenceRefs: z.array(z.string()),
  requiredApprovals: z.array(z.string()),
});

export const ComplianceCheckResponseSchema = ComplianceVerdictSchema;

export type ComplianceCheckRequest = z.infer<typeof ComplianceCheckRequestSchema>;
