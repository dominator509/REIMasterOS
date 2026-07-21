import type { DbConnection } from "../connection.js";
import type { PaginatedResult, PaginationParams, TenantContext } from "../repository.interface.js";
import { assertTenantContext, paginatedResult } from "../repository.interface.js";

interface TenantRow {
  readonly id: string;
  readonly tenant_id: string;
}

abstract class TenantScopedRepository<Row extends TenantRow> {
  protected constructor(
    protected readonly db: DbConnection,
    private readonly table: string,
    private readonly columns = "*",
  ) {}

  async findById(ctx: TenantContext, id: string): Promise<Row | null> {
    assertTenantContext(ctx);
    const rows = await this.db.query<Row>(
      `SELECT ${this.columns} FROM ${this.table} WHERE id = $1 AND tenant_id = $2`,
      [id, ctx.tenantId],
    );
    return rows[0] ?? null;
  }

  async findByTenant(ctx: TenantContext, params: PaginationParams): Promise<PaginatedResult<Row>> {
    assertTenantContext(ctx);
    const countRows = await this.db.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM ${this.table} WHERE tenant_id = $1`,
      [ctx.tenantId],
    );
    const data = await this.db.query<Row>(
      `SELECT ${this.columns} FROM ${this.table} WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [ctx.tenantId, params.limit, (params.page - 1) * params.limit],
    );
    return paginatedResult(data, Number.parseInt(countRows[0]?.count ?? "0", 10), params);
  }

  protected assertTenant(ctx: TenantContext, row: TenantRow): void {
    assertTenantContext(ctx);
    if (row.tenant_id !== ctx.tenantId) {
      throw new Error(`Cross-tenant ${this.table} write denied`);
    }
  }
}

export interface OwnerRow extends TenantRow {
  readonly name: string;
  readonly entity_type: string;
  readonly mailing_street?: string;
  readonly mailing_city?: string;
  readonly mailing_state?: string;
  readonly mailing_zip?: string;
  readonly properties_owned: number;
  readonly ownership_length_years?: number;
  readonly tags: readonly string[];
  readonly created_at: string;
  readonly updated_at: string;
}

export class OwnerRepository extends TenantScopedRepository<OwnerRow> {
  constructor(db: DbConnection) {
    super(db, "owners");
  }

  async insert(ctx: TenantContext, row: OwnerRow): Promise<OwnerRow> {
    this.assertTenant(ctx, row);
    await this.db.execute(
      `INSERT INTO owners (id, tenant_id, name, entity_type, mailing_street, mailing_city, mailing_state, mailing_zip, properties_owned, ownership_length_years, tags, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        row.id,
        ctx.tenantId,
        row.name,
        row.entity_type,
        row.mailing_street,
        row.mailing_city,
        row.mailing_state,
        row.mailing_zip,
        row.properties_owned,
        row.ownership_length_years,
        JSON.stringify(row.tags),
        row.created_at,
        row.updated_at,
      ],
    );
    return row;
  }
}

export interface LeadListRow extends TenantRow {
  readonly name: string;
  readonly description: string;
  readonly sources: readonly string[];
  readonly tags: readonly string[];
  readonly stage: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export class LeadListRepository extends TenantScopedRepository<LeadListRow> {
  constructor(db: DbConnection) {
    super(db, "lead_lists");
  }

  async insert(ctx: TenantContext, row: LeadListRow): Promise<LeadListRow> {
    this.assertTenant(ctx, row);
    await this.db.execute(
      `INSERT INTO lead_lists (id, tenant_id, name, description, sources, tags, stage, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        row.id,
        ctx.tenantId,
        row.name,
        row.description,
        JSON.stringify(row.sources),
        JSON.stringify(row.tags),
        row.stage,
        row.created_at,
        row.updated_at,
      ],
    );
    return row;
  }
}

export interface TaskRow extends TenantRow {
  readonly title: string;
  readonly description: string;
  readonly assignee_id?: string;
  readonly due_date?: string;
  readonly priority: string;
  readonly status: string;
  readonly related_entity_type?: string;
  readonly related_entity_id?: string;
  readonly tags: readonly string[];
  readonly completed_at?: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export class TaskRepository extends TenantScopedRepository<TaskRow> {
  constructor(db: DbConnection) {
    super(db, "tasks");
  }

  async insert(ctx: TenantContext, row: TaskRow): Promise<TaskRow> {
    this.assertTenant(ctx, row);
    await this.db.execute(
      `INSERT INTO tasks (id, tenant_id, title, description, assignee_id, due_date, priority, status, related_entity_type, related_entity_id, tags, completed_at, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        row.id,
        ctx.tenantId,
        row.title,
        row.description,
        row.assignee_id,
        row.due_date,
        row.priority,
        row.status,
        row.related_entity_type,
        row.related_entity_id,
        JSON.stringify(row.tags),
        row.completed_at,
        row.created_at,
        row.updated_at,
      ],
    );
    return row;
  }
}

export interface ActivityEventRow extends TenantRow {
  readonly actor_type: string;
  readonly actor_id: string;
  readonly action: string;
  readonly target_type: string;
  readonly target_id: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly created_at: string;
}

export class ActivityEventRepository extends TenantScopedRepository<ActivityEventRow> {
  constructor(db: DbConnection) {
    super(db, "activity_events");
  }

  async append(ctx: TenantContext, row: ActivityEventRow): Promise<ActivityEventRow> {
    this.assertTenant(ctx, row);
    await this.db.execute(
      `INSERT INTO activity_events (id, tenant_id, actor_type, actor_id, action, target_type, target_id, metadata, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        row.id,
        ctx.tenantId,
        row.actor_type,
        row.actor_id,
        row.action,
        row.target_type,
        row.target_id,
        JSON.stringify(row.metadata),
        row.created_at,
      ],
    );
    return row;
  }
}

export interface ComplianceVerdictRow extends TenantRow {
  readonly contact_id: string;
  readonly channel: string;
  readonly verdict: string;
  readonly reason_codes: readonly string[];
  readonly evidence_refs: readonly string[];
  readonly required_approvals: readonly string[];
  readonly created_at: string;
}

export class ComplianceVerdictRepository extends TenantScopedRepository<ComplianceVerdictRow> {
  constructor(db: DbConnection) {
    super(db, "compliance_verdicts");
  }

  async append(ctx: TenantContext, row: ComplianceVerdictRow): Promise<ComplianceVerdictRow> {
    this.assertTenant(ctx, row);
    await this.db.execute(
      `INSERT INTO compliance_verdicts (id, tenant_id, contact_id, channel, verdict, reason_codes, evidence_refs, required_approvals, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        row.id,
        ctx.tenantId,
        row.contact_id,
        row.channel,
        row.verdict,
        JSON.stringify(row.reason_codes),
        JSON.stringify(row.evidence_refs),
        JSON.stringify(row.required_approvals),
        row.created_at,
      ],
    );
    return row;
  }
}

export interface ApprovalRequestRow extends TenantRow {
  readonly action: string;
  readonly status: string;
  readonly requested_by?: string;
  readonly approved_by?: string;
  readonly evidence_refs: readonly string[];
  readonly expires_at?: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export class ApprovalRequestRepository extends TenantScopedRepository<ApprovalRequestRow> {
  constructor(db: DbConnection) {
    super(db, "approval_requests");
  }

  async insert(ctx: TenantContext, row: ApprovalRequestRow): Promise<ApprovalRequestRow> {
    this.assertTenant(ctx, row);
    await this.db.execute(
      `INSERT INTO approval_requests (id, tenant_id, action, status, requested_by, approved_by, evidence_refs, expires_at, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        row.id,
        ctx.tenantId,
        row.action,
        row.status,
        row.requested_by,
        row.approved_by,
        JSON.stringify(row.evidence_refs),
        row.expires_at,
        row.created_at,
        row.updated_at,
      ],
    );
    return row;
  }
}

export interface ProviderCredentialMetadataRow extends TenantRow {
  readonly provider: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly is_enabled: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface EncryptedProviderCredentialWrite extends ProviderCredentialMetadataRow {
  readonly encrypted_payload: Uint8Array;
}

export class ProviderCredentialMetadataRepository extends TenantScopedRepository<ProviderCredentialMetadataRow> {
  constructor(db: DbConnection) {
    super(
      db,
      "provider_credentials",
      "id, tenant_id, provider, metadata, is_enabled, created_at, updated_at",
    );
  }

  async findByProvider(
    ctx: TenantContext,
    provider: string,
  ): Promise<ProviderCredentialMetadataRow | null> {
    assertTenantContext(ctx);
    const rows = await this.db.query<ProviderCredentialMetadataRow>(
      "SELECT id, tenant_id, provider, metadata, is_enabled, created_at, updated_at FROM provider_credentials WHERE provider = $1 AND tenant_id = $2",
      [provider, ctx.tenantId],
    );
    return rows[0] ?? null;
  }

  async upsertEncrypted(
    ctx: TenantContext,
    row: EncryptedProviderCredentialWrite,
  ): Promise<ProviderCredentialMetadataRow> {
    this.assertTenant(ctx, row);
    if (row.encrypted_payload.byteLength === 0) {
      throw new Error("Encrypted provider credential payload is required");
    }
    await this.db.execute(
      `INSERT INTO provider_credentials (id, tenant_id, provider, metadata, encrypted_payload, is_enabled, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (tenant_id, provider) DO UPDATE SET metadata = EXCLUDED.metadata, encrypted_payload = EXCLUDED.encrypted_payload, is_enabled = EXCLUDED.is_enabled, updated_at = EXCLUDED.updated_at`,
      [
        row.id,
        ctx.tenantId,
        row.provider,
        JSON.stringify(row.metadata),
        row.encrypted_payload,
        row.is_enabled,
        row.created_at,
        row.updated_at,
      ],
    );
    return {
      id: row.id,
      tenant_id: row.tenant_id,
      provider: row.provider,
      metadata: row.metadata,
      is_enabled: row.is_enabled,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
