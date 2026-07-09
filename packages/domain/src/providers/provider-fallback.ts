/** Provider capability snapshot — supplied by application layer. */
export interface ProviderCapabilities {
  readonly email: ProviderCapabilityState;
  readonly directMail: ProviderCapabilityState;
  readonly voice: ProviderCapabilityState;
  readonly sms: ProviderCapabilityState;
  readonly maps: ProviderCapabilityState;
  readonly propertyData: ProviderCapabilityState;
  readonly skipTrace: ProviderCapabilityState;
  readonly aiHosted: ProviderCapabilityState;
}

export type ProviderCapabilityState = "available" | "degraded" | "unavailable" | "not_configured";

export interface FallbackDecision {
  readonly channel: string;
  readonly preferredProvider: string;
  readonly fallbackProvider?: string;
  readonly canOperate: boolean;
  readonly reason: string;
}

/**
 * Determine if a channel can operate given provider states.
 * Manual/local fallbacks are always allowed if configured.
 */
export function decideProviderFallback(
  channel: keyof ProviderCapabilities,
  capabilities: ProviderCapabilities,
  preferredProvider: string = "default",
): FallbackDecision {
  const state = capabilities[channel];

  if (state === "available" || state === "degraded") {
    return { channel, preferredProvider, canOperate: true, reason: `${channel}: ${state}` };
  }

  if (state === "not_configured") {
    return { channel, preferredProvider, canOperate: false, reason: `${channel}: not configured` };
  }

  // unavailable — check manual fallback
  const manualFallbacks: Record<string, string> = {
    email: "smtp_manual",
    directMail: "csv_export",
    voice: "manual_dial",
    sms: "disabled_unless_configured",
    maps: "static_map",
    propertyData: "csv_import",
    skipTrace: "manual_lookup",
    aiHosted: "local_hermes",
  };

  const fallback = manualFallbacks[channel];
  if (fallback && fallback !== "disabled_unless_configured") {
    return {
      channel,
      preferredProvider,
      fallbackProvider: fallback,
      canOperate: true,
      reason: `${channel}: fallback to ${fallback}`,
    };
  }

  return {
    channel,
    preferredProvider,
    canOperate: false,
    reason: `${channel}: unavailable with no fallback`,
  };
}

/**
 * Apply cost-aware fallback: premium provider → budget alternative.
 * Returns the cheapest viable provider.
 */
export type ProviderTier = "premium" | "standard" | "budget" | "manual";

export interface CostAwareProvider {
  readonly name: string;
  readonly tier: ProviderTier;
  readonly costPerUnitCents: number;
  readonly isAvailable: boolean;
}

export function selectCostAwareProvider(
  providers: readonly CostAwareProvider[],
): CostAwareProvider | null {
  const available = providers.filter((p) => p.isAvailable);
  if (available.length === 0) return null;
  // Prefer cheapest available
  return available.reduce((best, current) =>
    current.costPerUnitCents < best.costPerUnitCents ? current : best,
  );
}

export function tierPreference(tiers: readonly ProviderTier[]): ProviderTier[] {
  const order: Record<ProviderTier, number> = { manual: 0, budget: 1, standard: 2, premium: 3 };
  return [...tiers].sort((a, b) => order[a] - order[b]);
}
