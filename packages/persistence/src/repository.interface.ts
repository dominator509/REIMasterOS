import type { TenantId } from "@rei-os/domain";

/** Every repository method must accept tenant context for isolation. */
export interface TenantContext {
  readonly tenantId: TenantId;
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
  return {
    data,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  };
}
