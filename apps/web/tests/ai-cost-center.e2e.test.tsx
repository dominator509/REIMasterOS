import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AiChatView } from "../src/features/ai/ai-chat-view";
import {
  CostCenterView,
  type ProviderHealthEnvelope,
} from "../src/features/cost-center/cost-center-view";

describe("AI and cost-center acceptance", () => {
  it("shows sanitizer blocks without displaying partial model output", () => {
    const html = renderToStaticMarkup(
      <AiChatView
        response={{
          status: "error",
          code: "AI_SANITIZER_BLOCKED",
          message: "The response was withheld by the sanitizer.",
        }}
      />,
    );
    expect(html).toContain("AI SANITIZER BLOCKED");
    expect(html).toContain("No partial model output was displayed");
    expect(html).toContain('role="alert"');
    expect(html).toContain("disabled");
  });

  it("renders only the supplied sanitized API message", () => {
    const html = renderToStaticMarkup(
      <AiChatView
        response={{
          status: "ready",
          data: {
            data: { status: "queued", message: "Sanitized synthetic response." },
            meta: { requestId: "request-test", tenantId: "tenant-test" },
          },
        }}
      />,
    );
    expect(html).toContain("Sanitized synthetic response");
    expect(html).toContain("Sanitized assistant response");
  });

  it("shows provider health, local/manual fallbacks, and honest unavailable cost telemetry", () => {
    const providers: ProviderHealthEnvelope = {
      data: [
        {
          provider: "smtp",
          category: "email",
          status: "not_configured",
          fallback: "manual_export",
          checkedAt: "2026-07-18T12:00:00.000Z",
        },
        {
          provider: "local_ai",
          category: "ai",
          status: "disabled",
          checkedAt: "2026-07-18T12:00:00.000Z",
        },
      ],
      meta: { requestId: "request-test", tenantId: "tenant-test" },
    };
    const html = renderToStaticMarkup(
      <CostCenterView state={{ status: "ready", data: providers }} />,
    );
    expect(html).toContain("manual export");
    expect(html).toContain("local ai");
    expect(html).toContain("Telemetry unavailable");
    expect(html).not.toContain("$0");
    expect(html).toContain("not reported as achieved");
  });
});
