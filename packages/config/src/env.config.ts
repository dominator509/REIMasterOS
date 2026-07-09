import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.enum(["local", "test", "staging", "production"]).default("local"),
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),
  API_BASE_URL: z.string().url().default("http://localhost:3001"),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  SEARCH_PROVIDER: z.enum(["disabled", "opensearch", "elasticsearch"]).default("disabled"),
  SEARCH_URL: z.string().optional(),
  OBJECT_STORAGE_PROVIDER: z
    .enum(["local", "minio", "s3", "r2", "b2", "s3-compatible"])
    .default("local"),
  OBJECT_STORAGE_BUCKET: z.string().default("rei-os-local"),
  OBJECT_STORAGE_ENDPOINT: z.string().optional(),
  OBJECT_STORAGE_ACCESS_KEY_ID: z.string().optional(),
  OBJECT_STORAGE_SECRET_ACCESS_KEY: z.string().optional(),
  AUTH_PROVIDER: z
    .enum(["built-in", "keycloak", "authentik", "ory", "auth0", "workos", "okta"])
    .default("built-in"),
  SESSION_SECRET: z.string().min(32).optional(),
  ENCRYPTION_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function loadConfig(env: Record<string, string | undefined> = process.env): EnvConfig {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    const errors = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`Invalid environment configuration: ${errors}`);
  }
  return result.data;
}
