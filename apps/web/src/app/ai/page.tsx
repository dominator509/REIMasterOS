export default function AiAssistantPage() {
  return (
    <div>
      <h1>AI Assistant</h1>
      <p>Local AI chat assistant (Hermes-first, DeepSeek optional).</p>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: "2rem",
          textAlign: "center",
          color: "#999",
        }}
      >
        AI assistant is not yet configured. Set up a local LLM or connect an AI provider to enable
        this feature.
      </div>
    </div>
  );
}
