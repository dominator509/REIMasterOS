import { Module } from "@nestjs/common";
import { ProviderHealthController } from "./provider-health.controller.js";

@Module({ controllers: [ProviderHealthController] })
export class ProvidersModule {}
