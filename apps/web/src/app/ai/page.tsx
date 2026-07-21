import { AiChatView } from "../../features/ai/ai-chat-view";

export default function AiAssistantPage() {
  return (
    <AiChatView
      mode="local_only"
      response={{
        status: "error",
        code: "AI_ROUTE_DISABLED",
        message: "The local AI route is not configured.",
      }}
    />
  );
}
