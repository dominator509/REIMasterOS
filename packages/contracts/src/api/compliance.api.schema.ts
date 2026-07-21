import { z } from "zod";

export const ComplianceCheckRequestSchema = z.object({
  channel: z.enum(["email", "direct_mail", "voice", "ringless_voicemail", "sms"]),
  contactId: z.string().uuid(),
  propertyId: z.string().uuid().optional(),
  facts: z
    .object({
      canEmail: z.boolean(),
      canCall: z.boolean(),
      canText: z.boolean(),
      canDirectMail: z.boolean(),
      callRecordingConsent: z.boolean(),
      consentLastUpdated: z.string().datetime().optional(),
      internalDnc: z.boolean(),
      nationalDnc: z.boolean(),
      optedOut: z.boolean(),
      unsubscribed: z.boolean(),
      isQuietHours: z.boolean(),
      hasCallRecordingSetup: z.boolean(),
      hasSmsSetup: z.boolean(),
      isAiVoiceEnabled: z.boolean(),
    })
    .optional(),
});

export const ComplianceVerdictSchema = z.object({
  verdict: z.enum(["allowed", "blocked", "needs_approval"]),
  reasonCodes: z.array(z.string()),
  evidenceRefs: z.array(z.string()),
  requiredApprovals: z.array(z.string()),
  userMessage: z.string().min(1),
});

export const ComplianceCheckResponseSchema = ComplianceVerdictSchema;

export type ComplianceCheckRequest = z.infer<typeof ComplianceCheckRequestSchema>;
export type ComplianceCheckResponse = z.infer<typeof ComplianceCheckResponseSchema>;
