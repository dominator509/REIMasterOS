import type { TenantId } from "@rei-os/domain";

/** Every repository method must accept tenant context for isolation. */
export interface TenantContext {
  readonly tenantId: TenantId;
}

export function assertTenantContext(ctx: TenantContext): void {
  if (typeof ctx.tenantId !== "string" || ctx.tenantId.trim().length === 0) {
    throw new Error("Tenant context is required");
  }
}

export interface PaginationParams {
  readonly page: number;
  readonly limit: number;
}

export interface PaginatedResult<T> {
  readonly data: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

export function paginatedResult<T>(
  data: readonly T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> {
  if (!Number.isInteger(params.page) || params.page < 1) throw new Error("Page must be >= 1");
  if (!Number.isInteger(params.limit) || params.limit < 1 || params.limit > 500) {
    throw new Error("Limit must be between 1 and 500");
  }
  return {
    data,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  };
}
