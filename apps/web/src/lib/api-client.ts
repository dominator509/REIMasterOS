import { ApiErrorEnvelopeSchema } from "@rei-os/contracts";

type RuntimeSchema<T> = {
  safeParse(value: unknown): { success: true; data: T } | { success: false };
};

export type ResourceState<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; code: string; message: string };

export async function loadApiResource<T>(
  path: `/${string}`,
  schema: RuntimeSchema<T>,
): Promise<ResourceState<T>> {
  const apiBaseUrl = process.env["API_BASE_URL"] ?? "http://localhost:3001";

  try {
    const response = await fetch(new URL(path, apiBaseUrl), {
      headers: { accept: "application/json" },
    });
    const payload: unknown = await response.json();
    if (!response.ok) {
      const error = ApiErrorEnvelopeSchema.safeParse(payload);
      return error.success
        ? { status: "error", code: error.data.error.code, message: error.data.error.message }
        : { status: "error", code: "INTERNAL_ERROR", message: "The API request failed." };
    }
    const parsed = schema.safeParse(payload);
    return parsed.success
      ? { status: "ready", data: parsed.data }
      : {
          status: "error",
          code: "INTERNAL_ERROR",
          message: "The API returned an unexpected response shape.",
        };
  } catch {
    return {
      status: "error",
      code: "DEPENDENCY_UNAVAILABLE",
      message: "The local API is unavailable. Start it and retry.",
    };
  }
}
