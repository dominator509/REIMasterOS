import type { DbConnection } from "../connection.js";
import type { TenantContext, PaginationParams, PaginatedResult } from "../repository.interface.js";
import { paginatedResult } from "../repository.interface.js";

export interface PropertyRow {
  id: string;
  tenant_id: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  county?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  lot_size?: number;
  year_built?: number;
  property_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export class PropertyRepository {
  constructor(private readonly db: DbConnection) {}

  async findById(ctx: TenantContext, id: string): Promise<PropertyRow | null> {
    const rows = await this.db.query<PropertyRow>(
      "SELECT * FROM properties WHERE id = $1 AND tenant_id = $2",
      [id, ctx.tenantId],
    );
    return rows[0] ?? null;
  }

  async findByTenant(
    ctx: TenantContext,
    params: PaginationParams,
  ): Promise<PaginatedResult<PropertyRow>> {
    const countRows = await this.db.query<{ count: string }>(
      "SELECT COUNT(*) as count FROM properties WHERE tenant_id = $1",
      [ctx.tenantId],
    );
    const total = parseInt(countRows[0]?.count ?? "0", 10);
    const data = await this.db.query<PropertyRow>(
      "SELECT * FROM properties WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [ctx.tenantId, params.limit, (params.page - 1) * params.limit],
    );
    return paginatedResult(data, total, params);
  }

  async insert(ctx: TenantContext, row: PropertyRow): Promise<PropertyRow> {
    await this.db.execute(
      `INSERT INTO properties (id, tenant_id, street, street2, city, state, zip, county, bedrooms, bathrooms, square_feet, lot_size, year_built, property_type, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
      [
        row.id,
        ctx.tenantId,
        row.street,
        row.street2,
        row.city,
        row.state,
        row.zip,
        row.county,
        row.bedrooms,
        row.bathrooms,
        row.square_feet,
        row.lot_size,
        row.year_built,
        row.property_type,
        row.status,
        row.created_at,
        row.updated_at,
      ],
    );
    return row;
  }
}
