import { randomUUID } from "node:crypto";
import type {
  ApiErrorEnvelope,
  ApiMeta,
  ApiResponse,
  ErrorCode,
  ErrorDetail,
} from "@rei-os/contracts";

export interface ResponseMetaInput {
  readonly requestId?: string;
  readonly tenantId?: string;
}

function responseMeta(input: ResponseMetaInput = {}): ApiMeta {
  return {
    requestId: input.requestId ?? randomUUID(),
    ...(input.tenantId ? { tenantId: input.tenantId } : {}),
  };
}

export function successResponse<T>(data: T, meta: ResponseMetaInput = {}): ApiResponse<T> {
  return { data, meta: responseMeta(meta) };
}

export function errorResponse(
  code: ErrorCode,
  message: string,
  details?: readonly ErrorDetail[],
  requestId?: string,
): ApiErrorEnvelope {
  return {
    error: { code, message, ...(details ? { details: [...details] } : {}) },
    meta: { requestId: requestId ?? randomUUID() },
  };
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  meta: ResponseMetaInput = {},
): ApiResponse<{ items: T[]; total: number; page: number; limit: number; totalPages: number }> {
  return successResponse({ items, total, page, limit, totalPages: Math.ceil(total / limit) }, meta);
}
