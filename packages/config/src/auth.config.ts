import { z } from "zod";

const localSessionSecret = "local-only-replace-before-shared-use-32-bytes";
const localEncryptionKey = "local-only-replace-before-shared-use-encryption-key";
const localCorsOrigins = "http://localhost:3000";

const envBoolean = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean());

export const authConfigSchema = z
  .object({
    APP_ENV: z.enum(["local", "test", "staging", "production"]).default("local"),
    AUTH_PROVIDER: z
      .enum(["built-in", "keycloak", "authentik", "ory", "auth0", "workos", "okta"])
      .default("built-in"),
    SESSION_SECRET: z.string().min(32).default(localSessionSecret),
    ENCRYPTION_KEY: z.string().min(32).default(localEncryptionKey),
    SESSION_COOKIE_NAME: z
      .string()
      .regex(/^[a-zA-Z0-9_-]+$/)
      .default("rei_os_session"),
    CSRF_COOKIE_NAME: z
      .string()
      .regex(/^[a-zA-Z0-9_-]+$/)
      .default("rei_os_csrf"),
    CORS_ALLOWED_ORIGINS: z
      .string()
      .default(localCorsOrigins)
      .transform((value) =>
        value
          .split(",")
          .map((origin) => origin.trim())
          .filter(Boolean),
      ),
    RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().min(10).max(3_600).default(60),
    RATE_LIMIT_AUTH_ATTEMPTS: z.coerce.number().int().min(1).max(1_000).default(10),
    RATE_LIMIT_SENSITIVE_REQUESTS: z.coerce.number().int().min(1).max(10_000).default(60),
    RATE_LIMIT_WEBHOOK_REQUESTS: z.coerce.number().int().min(1).max(100_000).default(300),
    SESSION_MAX_AGE_SECONDS: z.coerce.number().int().min(300).max(2_592_000).default(28_800),
    SESSION_IDLE_TIMEOUT_SECONDS: z.coerce.number().int().min(60).max(86_400).default(1_800),
    MFA_ENABLED: envBoolean.default(false),
    PASSWORD_MIN_LENGTH: z.coerce.number().int().min(12).max(128).default(12),
    ACCOUNT_LOCKOUT_ATTEMPTS: z.coerce.number().int().min(3).max(20).default(5),
    ACCOUNT_LOCKOUT_MINUTES: z.coerce.number().int().min(1).max(1_440).default(15),
  })
  .superRefine((config, context) => {
    if (config.APP_ENV !== "staging" && config.APP_ENV !== "production") return;
    if (config.SESSION_SECRET === localSessionSecret || /replace/i.test(config.SESSION_SECRET)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["SESSION_SECRET"],
        message: "Staging and production require an owner-provided session secret.",
      });
    }
    if (config.ENCRYPTION_KEY === localEncryptionKey || /replace/i.test(config.ENCRYPTION_KEY)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ENCRYPTION_KEY"],
        message: "Staging and production require an owner-provided encryption key.",
      });
    }
    if (
      config.CORS_ALLOWED_ORIGINS.length === 0 ||
      config.CORS_ALLOWED_ORIGINS.includes("*") ||
      config.CORS_ALLOWED_ORIGINS.includes(localCorsOrigins)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["CORS_ALLOWED_ORIGINS"],
        message: "Staging and production require an explicit non-wildcard CORS allowlist.",
      });
    }
  });

export type AuthConfig = z.infer<typeof authConfigSchema>;

export function loadAuthConfig(env: Record<string, string | undefined> = process.env): AuthConfig {
  const result = authConfigSchema.safeParse(env);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    throw new Error(`Invalid auth configuration: ${errors.join(", ")}`);
  }
  return result.data;
}
