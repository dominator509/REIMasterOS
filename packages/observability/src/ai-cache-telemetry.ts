export type AiCacheProvider = "hermes" | "deepseek";

export interface AiCacheObservation {
  readonly provider: AiCacheProvider;
  readonly prefixHash: string;
  readonly prefixVersion: string;
  readonly promptCacheHitTokens: number;
  readonly promptCacheMissTokens: number;
  readonly requestCacheHit: boolean;
}

export interface AiCacheSnapshot {
  readonly provider: AiCacheProvider;
  readonly requests: number;
  readonly requestCacheHits: number;
  readonly promptCacheHitTokens: number;
  readonly promptCacheMissTokens: number;
}

export class InMemoryAiCacheTelemetry {
  private readonly observations: AiCacheObservation[] = [];

  record(observation: AiCacheObservation): void {
    if (
      !/^[a-f0-9]{64}$/u.test(observation.prefixHash) ||
      !observation.prefixVersion.trim() ||
      !Number.isSafeInteger(observation.promptCacheHitTokens) ||
      observation.promptCacheHitTokens < 0 ||
      !Number.isSafeInteger(observation.promptCacheMissTokens) ||
      observation.promptCacheMissTokens < 0
    ) {
      throw new Error("Invalid AI cache telemetry observation");
    }
    this.observations.push({ ...observation });
  }

  snapshot(provider: AiCacheProvider): AiCacheSnapshot {
    const observations = this.observations.filter((item) => item.provider === provider);
    return {
      provider,
      requests: observations.length,
      requestCacheHits: observations.filter((item) => item.requestCacheHit).length,
      promptCacheHitTokens: observations.reduce(
        (total, item) => total + item.promptCacheHitTokens,
        0,
      ),
      promptCacheMissTokens: observations.reduce(
        (total, item) => total + item.promptCacheMissTokens,
        0,
      ),
    };
  }
}
