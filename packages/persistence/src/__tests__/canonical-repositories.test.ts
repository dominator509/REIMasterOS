import { describe, expect, it } from "vitest";
import { toTenantId } from "@rei-os/domain";
import { createTestConnection } from "../connection.js";
import type { TenantContext } from "../repository.interface.js";
import {
  ActivityEventRepository,
  ApprovalRequestRepository,
  ComplianceVerdictRepository,
  LeadListRepository,
  OwnerRepository,
  ProviderCredentialMetadataRepository,
  TaskRepository,
} from "../repositories/canonical.repository.js";

const ctx: TenantContext = { tenantId: toTenantId("tenant-a") };
const NOW = "2026-07-18T12:00:00.000Z";

describe("canonical tenant-scoped repositories", () => {
  it("fails closed before SQL when tenant context is missing", async () => {
    const db = createTestConnection();
    const missing = { tenantId: " " as typeof ctx.tenantId };

    await expect(new OwnerRepository(db).findById(missing, "record-id")).rejects.toThrow(
      "Tenant context is required",
    );
    await expect(
      new ProviderCredentialMetadataRepository(db).findByProvider(missing, "smtp"),
    ).rejects.toThrow("Tenant context is required");
    expect(db.statements).toHaveLength(0);
  });

  it("includes tenant context in reads for every canonical repository", async () => {
    const db = createTestConnection();
    const repositories = [
      new OwnerRepository(db),
      new LeadListRepository(db),
      new TaskRepository(db),
      new ActivityEventRepository(db),
      new ComplianceVerdictRepository(db),
      new ApprovalRequestRepository(db),
      new ProviderCredentialMetadataRepository(db),
    ];

    for (const repository of repositories) {
      await repository.findById(ctx, "record-id");
      const statement = db.statements.at(-1);
      expect(statement?.sql).toContain("tenant_id = $2");
      expect(statement?.params).toEqual(["record-id", ctx.tenantId]);
    }
  });

  it("rejects cross-tenant writes before issuing SQL", async () => {
    const db = createTestConnection();
    const otherTenant = "tenant-b";

    await expect(
      new OwnerRepository(db).insert(ctx, {
        id: "owner-id",
        tenant_id: otherTenant,
        name: "Synthetic Owner",
        entity_type: "individual",
        properties_owned: 0,
        tags: [],
        created_at: NOW,
        updated_at: NOW,
      }),
    ).rejects.toThrow("Cross-tenant owners write denied");

    await expect(
      new LeadListRepository(db).insert(ctx, {
        id: "list-id",
        tenant_id: otherTenant,
        name: "Synthetic List",
        description: "",
        sources: [],
        tags: [],
        stage: "ready",
        created_at: NOW,
        updated_at: NOW,
      }),
    ).rejects.toThrow("Cross-tenant lead_lists write denied");

    await expect(
      new TaskRepository(db).insert(ctx, {
        id: "task-id",
        tenant_id: otherTenant,
        title: "Synthetic Task",
        description: "",
        priority: "medium",
        status: "todo",
        tags: [],
        created_at: NOW,
        updated_at: NOW,
      }),
    ).rejects.toThrow("Cross-tenant tasks write denied");

    await expect(
      new ActivityEventRepository(db).append(ctx, {
        id: "activity-id",
        tenant_id: otherTenant,
        actor_type: "user",
        actor_id: "synthetic-user",
        action: "synthetic.action",
        target_type: "property",
        target_id: "synthetic-property",
        metadata: {},
        created_at: NOW,
      }),
    ).rejects.toThrow("Cross-tenant activity_events write denied");

    await expect(
      new ComplianceVerdictRepository(db).append(ctx, {
        id: "verdict-id",
        tenant_id: otherTenant,
        contact_id: "synthetic-contact",
        channel: "email",
        verdict: "blocked",
        reason_codes: ["CONTACT_OPTED_OUT"],
        evidence_refs: ["synthetic:evidence"],
        required_approvals: [],
        created_at: NOW,
      }),
    ).rejects.toThrow("Cross-tenant compliance_verdicts write denied");

    await expect(
      new ApprovalRequestRepository(db).insert(ctx, {
        id: "approval-id",
        tenant_id: otherTenant,
        action: "campaign.launch",
        status: "pending",
        evidence_refs: ["synthetic:evidence"],
        created_at: NOW,
        updated_at: NOW,
      }),
    ).rejects.toThrow("Cross-tenant approval_requests write denied");

    await expect(
      new ProviderCredentialMetadataRepository(db).upsertEncrypted(ctx, {
        id: "credential-id",
        tenant_id: otherTenant,
        provider: "smtp",
        metadata: {},
        encrypted_payload: new Uint8Array([1]),
        is_enabled: false,
        created_at: NOW,
        updated_at: NOW,
      }),
    ).rejects.toThrow("Cross-tenant provider_credentials write denied");

    expect(db.statements).toHaveLength(0);
  });

  it("keeps encrypted credential payloads out of metadata reads and return values", async () => {
    const db = createTestConnection();
    const repository = new ProviderCredentialMetadataRepository(db);

    await repository.findByProvider(ctx, "smtp");
    expect(db.statements[0]?.sql).not.toContain("encrypted_payload");

    const result = await repository.upsertEncrypted(ctx, {
      id: "credential-id",
      tenant_id: ctx.tenantId,
      provider: "smtp",
      metadata: { label: "local" },
      encrypted_payload: new Uint8Array([1, 2, 3]),
      is_enabled: false,
      created_at: NOW,
      updated_at: NOW,
    });

    expect(result).not.toHaveProperty("encrypted_payload");
    expect(db.statements[1]?.params).toContain(ctx.tenantId);
  });

  it("requires a non-empty encrypted credential payload", async () => {
    const db = createTestConnection();
    const repository = new ProviderCredentialMetadataRepository(db);

    await expect(
      repository.upsertEncrypted(ctx, {
        id: "credential-id",
        tenant_id: ctx.tenantId,
        provider: "smtp",
        metadata: {},
        encrypted_payload: new Uint8Array(),
        is_enabled: false,
        created_at: NOW,
        updated_at: NOW,
      }),
    ).rejects.toThrow("Encrypted provider credential payload is required");
    expect(db.statements).toHaveLength(0);
  });
});
