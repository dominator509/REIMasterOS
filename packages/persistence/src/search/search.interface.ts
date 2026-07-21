import type { TenantContext } from "../repository.interface.js";

export interface SearchDocument {
  readonly id: string;
  readonly type: string;
  readonly tenantId: string;
  readonly body: Record<string, unknown>;
}

export interface SearchService {
  index(ctx: TenantContext, doc: SearchDocument): Promise<void>;
  search(ctx: TenantContext, query: SearchQuery): Promise<SearchResult>;
  delete(ctx: TenantContext, type: string, id: string): Promise<void>;
}

export interface SearchQuery {
  readonly type: string;
  readonly query: string;
  readonly filters?: Record<string, unknown>;
  readonly page: number;
  readonly limit: number;
}

export interface SearchResult {
  readonly hits: readonly SearchDocument[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
}

/** Test stub — search is derived, not authoritative. */
export function createTestSearchService(): SearchService {
  const docs = new Map<string, SearchDocument>();
  return {
    async index(ctx, doc) {
      if (doc.tenantId !== ctx.tenantId) throw new Error("Cross-tenant search write denied");
      docs.set(`${ctx.tenantId}:${doc.type}:${doc.id}`, doc);
    },
    async search(ctx, query) {
      const matches = [...docs.values()].filter(
        (d) => d.tenantId === ctx.tenantId && d.type === query.type,
      );
      return {
        hits: matches.slice((query.page - 1) * query.limit, query.page * query.limit),
        total: matches.length,
        page: query.page,
        limit: query.limit,
      };
    },
    async delete(ctx, type, id) {
      docs.delete(`${ctx.tenantId}:${type}:${id}`);
    },
  };
}
