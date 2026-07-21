import { createHash } from "node:crypto";

export interface StablePrefixInput {
  readonly hiddenPrefix: string;
  readonly version: string;
  readonly cacheEligible: boolean;
}

export interface CompiledStablePrefix {
  /** Internal gateway value. Never log or return through an API. */
  readonly hiddenPrefix: string;
  readonly prefixHash: string;
  readonly prefixVersion: string;
  readonly estimatedTokens: number;
  readonly cacheEligible: boolean;
}

export const MINIMUM_CACHE_ELIGIBLE_PREFIX_TOKENS = 64;

function normalizePrefix(prefix: string): string {
  return prefix.replaceAll("\r\n", "\n").trimEnd();
}

function estimateTokens(prefix: string): number {
  const words = prefix.trim().split(/\s+/u).filter(Boolean).length;
  return words;
}

export function compileStablePrefix(input: StablePrefixInput): CompiledStablePrefix {
  const hiddenPrefix = normalizePrefix(input.hiddenPrefix);
  const prefixVersion = input.version.trim();
  if (!hiddenPrefix || !prefixVersion) throw new Error("Prefix text and version are required");
  const estimatedTokens = estimateTokens(hiddenPrefix);
  if (input.cacheEligible && estimatedTokens < MINIMUM_CACHE_ELIGIBLE_PREFIX_TOKENS) {
    throw new Error("Cache-eligible stable prefixes require at least 64 estimated tokens");
  }
  return {
    hiddenPrefix,
    prefixHash: createHash("sha256").update(hiddenPrefix).digest("hex"),
    prefixVersion,
    estimatedTokens,
    cacheEligible: input.cacheEligible,
  };
}

/** Buffers the entire stream so no partial hidden prefix can reach a user. */
export class BufferedHiddenPrefixSanitizer {
  private buffer = "";

  constructor(
    private readonly hiddenPrefix: string,
    private readonly maximumCharacters = 1_000_000,
  ) {
    if (!hiddenPrefix) throw new Error("Hidden prefix is required");
  }

  push(chunk: string): undefined {
    if (this.buffer.length + chunk.length > this.maximumCharacters) {
      this.buffer = "";
      throw new Error("Buffered AI output exceeded the sanitizer limit");
    }
    this.buffer += chunk;
    return undefined;
  }

  finish(): string {
    const sanitized = this.buffer.replaceAll(this.hiddenPrefix, "[REDACTED]");
    this.buffer = "";
    if (/(hidden[_ -]?prefix|system[_ -]?prefix|<system>)/iu.test(sanitized)) {
      throw new Error("AI sanitizer blocked possible hidden-prefix leakage");
    }
    return sanitized;
  }
}
