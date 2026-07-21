import { Module } from "@nestjs/common";
import {
  DenyAllWebhookVerifier,
  WEBHOOK_SIGNATURE_VERIFIER,
} from "./webhook-signature.interface.js";
import { WebhooksController } from "./webhooks.controller.js";

@Module({
  controllers: [WebhooksController],
  providers: [{ provide: WEBHOOK_SIGNATURE_VERIFIER, useClass: DenyAllWebhookVerifier }],
})
export class WebhooksModule {}
