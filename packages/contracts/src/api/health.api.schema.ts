import { z } from "zod";

export const HealthResponseSchema = z.object({
  status: z.enum(["ok", "degraded", "error"]),
  timestamp: z.string().datetime(),
  version: z.string(),
  services: z.object({
    database: z.enum(["connected", "disconnected", "error"]),
    redis: z.enum(["connected", "disconnected", "not_configured"]),
    search: z.enum(["connected", "disconnected", "not_configured"]),
    storage: z.enum(["connected", "disconnected", "not_configured"]),
  }),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
