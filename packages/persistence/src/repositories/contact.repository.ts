import type { DbConnection } from "../connection.js";
import type { TenantContext, PaginationParams, PaginatedResult } from "../repository.interface.js";
import { assertTenantContext, paginatedResult } from "../repository.interface.js";

export interface ContactRow {
  id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  contact_type: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export class ContactRepository {
  constructor(private readonly db: DbConnection) {}

  async findById(ctx: TenantContext, id: string): Promise<ContactRow | null> {
    assertTenantContext(ctx);
    const rows = await this.db.query<ContactRow>(
      "SELECT * FROM contacts WHERE id = $1 AND tenant_id = $2",
      [id, ctx.tenantId],
    );
    return rows[0] ?? null;
  }

  async findByTenant(
    ctx: TenantContext,
    params: PaginationParams,
  ): Promise<PaginatedResult<ContactRow>> {
    assertTenantContext(ctx);
    const countRows = await this.db.query<{ count: string }>(
      "SELECT COUNT(*) as count FROM contacts WHERE tenant_id = $1",
      [ctx.tenantId],
    );
    const total = parseInt(countRows[0]?.count ?? "0", 10);
    const data = await this.db.query<ContactRow>(
      "SELECT * FROM contacts WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [ctx.tenantId, params.limit, (params.page - 1) * params.limit],
    );
    return paginatedResult(data, total, params);
  }
}
