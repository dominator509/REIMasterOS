export interface WebhookVerificationInput {
  readonly provider: string;
  readonly signature?: string;
  readonly tenantId?: string;
  readonly payload: unknown;
}

export interface WebhookSignatureVerifier {
  verify(input: WebhookVerificationInput): Promise<boolean>;
}

export const WEBHOOK_SIGNATURE_VERIFIER = Symbol("WEBHOOK_SIGNATURE_VERIFIER");

export class DenyAllWebhookVerifier implements WebhookSignatureVerifier {
  async verify(_input: WebhookVerificationInput): Promise<boolean> {
    return false;
  }
}
