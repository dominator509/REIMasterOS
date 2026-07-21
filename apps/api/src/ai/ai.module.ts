import { Module } from "@nestjs/common";
import { AiChatController } from "./ai-chat.controller.js";
import { DisabledLlmGateway, LLM_GATEWAY } from "./llm-gateway.interface.js";

@Module({
  controllers: [AiChatController],
  providers: [{ provide: LLM_GATEWAY, useClass: DisabledLlmGateway }],
})
export class AiModule {}
