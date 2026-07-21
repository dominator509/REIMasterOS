export interface ProviderCallContext {
  readonly tenantId: string;
  readonly idempotencyKey: string;
}

export type ChannelResultStatus = "accepted" | "manual_required" | "disabled";

export interface ChannelResult {
  readonly provider: string;
  readonly status: ChannelResultStatus;
  readonly referenceId?: string;
  readonly reason?: string;
}

export interface EmailAdapter {
  sendEmail(
    context: ProviderCallContext,
    input: { readonly recipientId: string; readonly templateId: string },
  ): Promise<ChannelResult>;
}

export interface DirectMailAdapter {
  prepareMail(
    context: ProviderCallContext,
    input: { readonly recipientId: string; readonly templateId: string },
  ): Promise<ChannelResult & { readonly artifactKey?: string }>;
}

export interface VoiceAdapter {
  createCallTask(
    context: ProviderCallContext,
    input: { readonly contactId: string; readonly scriptId: string },
  ): Promise<ChannelResult>;
}

export interface SmsAdapter {
  sendSms(
    context: ProviderCallContext,
    input: { readonly recipientId: string; readonly templateId: string },
  ): Promise<ChannelResult>;
}

export interface PropertyCsvPreview {
  readonly rowCount: number;
  readonly normalizedHeaders: readonly string[];
  readonly rejectedRows: readonly { readonly row: number; readonly reason: string }[];
}

export interface PropertyDataCsvAdapter {
  preview(context: ProviderCallContext, csv: string): Promise<PropertyCsvPreview>;
}

export interface DncSuppressionVerdict {
  readonly status: "clear" | "suppressed" | "unavailable";
  readonly reasonCodes: readonly string[];
  readonly evidenceRefs: readonly string[];
}

export interface DncSuppressionAdapter {
  checkHash(context: ProviderCallContext, contactPointHash: string): Promise<DncSuppressionVerdict>;
}

export class DisabledSmsAdapter implements SmsAdapter {
  async sendSms(
    context: ProviderCallContext,
    input: { readonly recipientId: string; readonly templateId: string },
  ): Promise<ChannelResult> {
    assertProviderContext(context);
    if (!input.recipientId.trim() || !input.templateId.trim()) {
      throw new Error("SMS recipient and template identifiers are required");
    }
    return {
      provider: "disabled",
      status: "disabled",
      reason: "SMS is disabled until a tenant-configured adapter passes compliance gates.",
    };
  }
}

export function assertProviderContext(context: ProviderCallContext): void {
  if (!context.tenantId.trim() || !context.idempotencyKey.trim()) {
    throw new Error("Tenant and idempotency context are required for provider calls");
  }
}

export function tenantArtifactKey(tenantId: string, referenceId: string): string {
  if (!tenantId.trim() || !referenceId.trim() || referenceId.includes("..")) {
    throw new Error("Tenant-scoped artifact key inputs are invalid");
  }
  return `tenants/${encodeURIComponent(tenantId)}/exports/${encodeURIComponent(referenceId)}`;
}
