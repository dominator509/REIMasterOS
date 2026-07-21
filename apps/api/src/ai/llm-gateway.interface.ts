import type { AiChatRequest, AiChatResponse } from "@rei-os/contracts";
import type { AuthContext } from "../auth/auth-context.interface.js";

export interface LlmGateway {
  chat(context: AuthContext, request: AiChatRequest): Promise<AiChatResponse>;
}

export const LLM_GATEWAY = Symbol("LLM_GATEWAY");

export class DisabledLlmGateway implements LlmGateway {
  async chat(_context: AuthContext, _request: AiChatRequest): Promise<AiChatResponse> {
    return { status: "disabled", message: "AI routing is disabled for this deployment." };
  }
}
