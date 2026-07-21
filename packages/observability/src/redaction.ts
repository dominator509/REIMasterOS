const SENSITIVE_FIELDS = [
  "password",
  "secret",
  "token",
  "apikey",
  "api_key",
  "credential",
  "ssn",
  "credit_card",
  "creditCard",
  "cvv",
  "passport",
  "dni",
  "privateKey",
  "private_key",
  "signingKey",
  "signing_key",
  "encryptionKey",
  "encryption_key",
  "sessionSecret",
  "session_secret",
  "databaseUrl",
  "database_url",
  "redisUrl",
  "redis_url",
  "hiddenPrefix",
  "hidden_prefix",
  "rawPrompt",
  "raw_prompt",
  "compiledPrompt",
  "compiled_prompt",
  "providerPayload",
  "provider_payload",
  "authorization",
  "cookie",
  "mfaCode",
  "mfa_code",
  "email",
  "phone",
  "address",
  "transcript",
  "recording",
  "payment",
];

const REDACTED_VALUE = "[REDACTED]";

function isSensitiveKey(key: string): boolean {
  const lowerKey = key.toLowerCase().replace(/[_-]/g, "");
  return SENSITIVE_FIELDS.some((f) => lowerKey === f.replace(/[_-]/g, ""));
}

export function redact(obj: Record<string, unknown>, depth: number = 0): Record<string, unknown> {
  if (depth > 10) return obj;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (isSensitiveKey(key)) {
      result[key] = REDACTED_VALUE;
    } else if (Array.isArray(value)) {
      result[key] = value.map((v) =>
        typeof v === "object" && v !== null ? redact(v as Record<string, unknown>, depth + 1) : v,
      );
    } else if (typeof value === "object" && value !== null) {
      result[key] = redact(value as Record<string, unknown>, depth + 1);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/** Ensure DNC data never appears in logs. */
export function hasDncData(obj: Record<string, unknown>): boolean {
  const json = JSON.stringify(obj).toLowerCase();
  return /(?:^|[^a-z0-9])dnc(?:$|[^a-z0-9])/u.test(json) || /\bdo.?not.?call\b/iu.test(json);
}

export function sanitizeForLogging(obj: Record<string, unknown>): Record<string, unknown> {
  if (hasDncData(obj)) {
    throw new Error("DNC data must not be logged");
  }
  return redact(obj);
}
