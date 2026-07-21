import { z } from "zod";
import { ApiResponseEnvelopeSchema } from "./response-envelope.schema.js";

export const AiChatRequestSchema = z.object({
  message: z.string().trim().min(1).max(20_000),
  conversationId: z.string().uuid().optional(),
});
export const AiChatResponseSchema = z.object({
  status: z.enum(["disabled", "queued"]),
  jobId: z.string().uuid().optional(),
  message: z.string(),
});
export const AiChatEnvelopeResponseSchema = ApiResponseEnvelopeSchema(AiChatResponseSchema);

export type AiChatRequest = z.infer<typeof AiChatRequestSchema>;
export type AiChatResponse = z.infer<typeof AiChatResponseSchema>;
