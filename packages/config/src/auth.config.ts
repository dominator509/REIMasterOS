import { z } from "zod";

export const authConfigSchema = z.object({
  AUTH_PROVIDER: z
    .enum(["built-in", "keycloak", "authentik", "ory", "auth0", "workos", "okta"])
    .default("built-in"),
  SESSION_SECRET: z.string().min(32).default("replace-with-at-least-32-byte-secret-key-here!"),
  ENCRYPTION_KEY: z.string().min(32).default("base64:replace-with-32-byte-encryption-key!!"),
  SESSION_MAX_AGE_SECONDS: z.coerce.number().int().positive().default(86400),
  MFA_ENABLED: z.coerce.boolean().default(false),
  PASSWORD_MIN_LENGTH: z.coerce.number().int().min(8).default(12),
  ACCOUNT_LOCKOUT_ATTEMPTS: z.coerce.number().int().positive().default(5),
  ACCOUNT_LOCKOUT_MINUTES: z.coerce.number().int().positive().default(15),
});

export type AuthConfig = z.infer<typeof authConfigSchema>;
