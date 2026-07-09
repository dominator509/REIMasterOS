import { describe, it, expect } from "vitest";
import {
  decideProviderFallback,
  selectCostAwareProvider,
  tierPreference,
} from "../providers/provider-fallback.js";
import type { ProviderCapabilities } from "../providers/provider-fallback.js";

const baseCapabilities: ProviderCapabilities = {
  email: "available",
  directMail: "available",
  voice: "available",
  sms: "available",
  maps: "available",
  propertyData: "available",
  skipTrace: "available",
  aiHosted: "available",
};

describe("decideProviderFallback", () => {
  it("allows when available", () => {
    const result = decideProviderFallback("email", baseCapabilities);
    expect(result.canOperate).toBe(true);
  });
  it("falls back when unavailable", () => {
    const caps = { ...baseCapabilities, email: "unavailable" as const };
    const result = decideProviderFallback("email", caps);
    expect(result.canOperate).toBe(true);
    expect(result.fallbackProvider).toBe("smtp_manual");
  });
  it("blocks SMS when unavailable", () => {
    const caps = { ...baseCapabilities, sms: "unavailable" as const };
    const result = decideProviderFallback("sms", caps);
    expect(result.canOperate).toBe(false);
  });
  it("falls back to local AI", () => {
    const caps = { ...baseCapabilities, aiHosted: "unavailable" as const };
    const result = decideProviderFallback("aiHosted", caps);
    expect(result.canOperate).toBe(true);
    expect(result.fallbackProvider).toBe("local_hermes");
  });
});

describe("selectCostAwareProvider", () => {
  it("selects cheapest available", () => {
    const providers = [
      { name: "premium_api", tier: "premium" as const, costPerUnitCents: 100, isAvailable: true },
      { name: "budget_api", tier: "budget" as const, costPerUnitCents: 10, isAvailable: true },
      { name: "standard_api", tier: "standard" as const, costPerUnitCents: 50, isAvailable: false },
    ];
    const selected = selectCostAwareProvider(providers);
    expect(selected?.name).toBe("budget_api");
  });
  it("returns null if none available", () => {
    const providers = [
      { name: "premium_api", tier: "premium" as const, costPerUnitCents: 100, isAvailable: false },
    ];
    expect(selectCostAwareProvider(providers)).toBeNull();
  });
});

describe("tierPreference", () => {
  it("orders manual before premium", () => {
    const result = tierPreference(["premium", "manual", "standard"]);
    expect(result[0]).toBe("manual");
    expect(result[2]).toBe("premium");
  });
});
