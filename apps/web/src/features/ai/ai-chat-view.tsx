import type { AiChatEnvelopeResponseSchema } from "@rei-os/contracts";
import type { ResourceState } from "../../lib/api-client";

export type AiChatEnvelope = ReturnType<typeof AiChatEnvelopeResponseSchema.parse>;

export function AiChatView({
  response,
  mode = "local_only",
}: {
  response: ResourceState<AiChatEnvelope>;
  mode?: "disabled" | "local_only" | "hybrid";
}) {
  return (
    <section aria-labelledby="ai-title">
      <p className="eyebrow">Buffered and sanitized</p>
      <h1 id="ai-title">AI assistant</h1>
      <p>
        Route: <strong>{mode.replaceAll("_", " ")}</strong>. Local Hermes is preferred; hosted
        overflow is never assumed.
      </p>
      <div className="chat-shell" aria-label="AI conversation">
        {response.status === "loading" ? (
          <p role="status" aria-live="polite">
            Waiting for the sanitized API response…
          </p>
        ) : response.status === "error" ? (
          <div className="state-panel state-panel--error" role="alert">
            <strong>{response.code.replaceAll("_", " ")}</strong>
            <span>{response.message}</span>
            <span>No partial model output was displayed.</span>
          </div>
        ) : (
          <article className="chat-message" aria-label="Sanitized assistant response">
            {response.data.data.message}
          </article>
        )}
      </div>
      <form className="chat-composer">
        <label htmlFor="ai-message">Message the acquisitions assistant</label>
        <textarea id="ai-message" name="message" rows={4} disabled />
        <button type="button" disabled>
          Send for sanitized response
        </button>
        <p className="field-note">
          Chat unlocks only after an authenticated, policy-enabled AI route is configured.
        </p>
      </form>
    </section>
  );
}
