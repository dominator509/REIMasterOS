import type { DbConnection } from "../connection.js";
import type { TenantContext, PaginationParams, PaginatedResult } from "../repository.interface.js";
import { assertTenantContext, paginatedResult } from "../repository.interface.js";

export interface LeadRow {
  id: string;
  tenant_id: string;
  property_id: string;
  owner_id: string;
  source: string;
  score: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export class LeadRepository {
  constructor(private readonly db: DbConnection) {}

  async findById(ctx: TenantContext, id: string): Promise<LeadRow | null> {
    assertTenantContext(ctx);
    const rows = await this.db.query<LeadRow>(
      "SELECT * FROM leads WHERE id = $1 AND tenant_id = $2",
      [id, ctx.tenantId],
    );
    return rows[0] ?? null;
  }

  async findByTenant(
    ctx: TenantContext,
    params: PaginationParams,
  ): Promise<PaginatedResult<LeadRow>> {
    assertTenantContext(ctx);
    const countRows = await this.db.query<{ count: string }>(
      "SELECT COUNT(*) as count FROM leads WHERE tenant_id = $1",
      [ctx.tenantId],
    );
    const total = parseInt(countRows[0]?.count ?? "0", 10);
    const data = await this.db.query<LeadRow>(
      "SELECT * FROM leads WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [ctx.tenantId, params.limit, (params.page - 1) * params.limit],
    );
    return paginatedResult(data, total, params);
  }
}
