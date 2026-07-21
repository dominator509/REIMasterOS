import { describe, expect, it } from "vitest";
import {
  assertProviderContext,
  DisabledSmsAdapter,
  tenantArtifactKey,
  type DirectMailAdapter,
  type DncSuppressionAdapter,
  type EmailAdapter,
  type PropertyDataCsvAdapter,
  type ProviderCallContext,
  type VoiceAdapter,
} from "../src/provider-contracts.js";

const context: ProviderCallContext = {
  tenantId: "tenant-synthetic",
  idempotencyKey: "synthetic-operation-1",
};

describe("provider-neutral adapter contracts", () => {
  it("supports SMTP/manual email fallback without a live send", async () => {
    const adapter: EmailAdapter = {
      sendEmail: async (callContext) => {
        assertProviderContext(callContext);
        return { provider: "smtp_manual", status: "manual_required", referenceId: "email-1" };
      },
    };
    await expect(
      adapter.sendEmail(context, { recipientId: "contact-synthetic", templateId: "template-1" }),
    ).resolves.toMatchObject({ provider: "smtp_manual", status: "manual_required" });
  });

  it("requires tenant-scoped direct-mail artifact keys", async () => {
    const adapter: DirectMailAdapter = {
      prepareMail: async (callContext) => ({
        provider: "manual_pdf_csv",
        status: "manual_required",
        artifactKey: tenantArtifactKey(callContext.tenantId, "mail-batch-1"),
      }),
    };
    const result = await adapter.prepareMail(context, {
      recipientId: "contact-synthetic",
      templateId: "template-1",
    });
    expect(result.artifactKey).toBe("tenants/tenant-synthetic/exports/mail-batch-1");
    expect(() => tenantArtifactKey(context.tenantId, "../escape")).toThrow();
  });

  it("models voice as a manual task and SMS as disabled by default", async () => {
    const voice: VoiceAdapter = {
      createCallTask: async () => ({ provider: "manual_dial", status: "manual_required" }),
    };
    await expect(
      voice.createCallTask(context, { contactId: "contact-synthetic", scriptId: "script-1" }),
    ).resolves.toMatchObject({ status: "manual_required" });
    await expect(
      new DisabledSmsAdapter().sendSms(context, {
        recipientId: "contact-synthetic",
        templateId: "template-1",
      }),
    ).resolves.toMatchObject({ provider: "disabled", status: "disabled" });
  });

  it("previews synthetic property CSV without committing rows", async () => {
    const adapter: PropertyDataCsvAdapter = {
      preview: async (callContext, csv) => {
        assertProviderContext(callContext);
        const [header = "", ...rows] = csv.trim().split("\n");
        return {
          rowCount: rows.length,
          normalizedHeaders: header.split(",").map((value) => value.trim().toLowerCase()),
          rejectedRows: rows.flatMap((row, index) =>
            /^[=+@-]/u.test(row) ? [{ row: index + 2, reason: "formula-like cell" }] : [],
          ),
        };
      },
    };
    const preview = await adapter.preview(
      context,
      "Address,City,State,Zip\n123 Synthetic Ave,Testville,TX,00000\n=CMD(),Testville,TX,00000",
    );
    expect(preview).toMatchObject({ rowCount: 2, rejectedRows: [{ row: 3 }] });
  });

  it("returns suppression-only DNC verdicts with evidence references", async () => {
    const adapter: DncSuppressionAdapter = {
      checkHash: async (callContext, contactPointHash) => {
        assertProviderContext(callContext);
        expect(contactPointHash).toMatch(/^[a-f0-9]{64}$/u);
        return {
          status: "suppressed",
          reasonCodes: ["EXTERNAL_DNC_MATCH"],
          evidenceRefs: ["synthetic:dnc-verdict-hash"],
        };
      },
    };
    const result = await adapter.checkHash(context, "a".repeat(64));
    expect(result).toEqual({
      status: "suppressed",
      reasonCodes: ["EXTERNAL_DNC_MATCH"],
      evidenceRefs: ["synthetic:dnc-verdict-hash"],
    });
    expect(JSON.stringify(result)).not.toContain("phone");
  });

  it("rejects missing tenant or idempotency context before adapter work", () => {
    expect(() => assertProviderContext({ tenantId: "", idempotencyKey: "operation" })).toThrow();
    expect(() => assertProviderContext({ tenantId: "tenant", idempotencyKey: "" })).toThrow();
  });
});
