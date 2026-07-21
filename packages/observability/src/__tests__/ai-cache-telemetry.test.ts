import { describe, expect, it } from "vitest";
import { InMemoryAiCacheTelemetry } from "../ai-cache-telemetry.js";

describe("AI cache telemetry", () => {
  it("keeps Hermes and DeepSeek observations separated", () => {
    const prefixHash = "a".repeat(64);
    const telemetry = new InMemoryAiCacheTelemetry();
    telemetry.record({
      provider: "hermes",
      prefixHash,
      prefixVersion: "v1",
      promptCacheHitTokens: 70,
      promptCacheMissTokens: 0,
      requestCacheHit: true,
    });
    telemetry.record({
      provider: "deepseek",
      prefixHash,
      prefixVersion: "v1",
      promptCacheHitTokens: 0,
      promptCacheMissTokens: 70,
      requestCacheHit: false,
    });
    expect(telemetry.snapshot("hermes")).toMatchObject({
      requests: 1,
      requestCacheHits: 1,
      promptCacheHitTokens: 70,
      promptCacheMissTokens: 0,
    });
    expect(telemetry.snapshot("deepseek")).toMatchObject({
      requests: 1,
      requestCacheHits: 0,
      promptCacheHitTokens: 0,
      promptCacheMissTokens: 70,
    });
  });

  it("rejects unhashed prefix identifiers and negative token counts", () => {
    const telemetry = new InMemoryAiCacheTelemetry();
    expect(() =>
      telemetry.record({
        provider: "hermes",
        prefixHash: "raw-prefix-is-forbidden",
        prefixVersion: "v1",
        promptCacheHitTokens: -1,
        promptCacheMissTokens: 0,
        requestCacheHit: false,
      }),
    ).toThrow();
  });
});
