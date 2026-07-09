import { describe, it, expect } from "vitest";
import { checkOutreachCompliance, isQuietHours, classifyAction } from "../compliance.js";
import { createEmptyConsent } from "../../value-objects/contact-point.js";
import type { OutreachContext } from "../compliance.js";

function baseContext(overrides?: Partial<OutreachContext>): OutreachContext {
  return {
    channel: "email",
    consent: createEmptyConsent(),
    suppression: { internalDnc: false, nationalDnc: false, optedOut: false, unsubscribed: false },
    isQuietHours: false,
    hasCallRecordingSetup: false,
    hasSmsSetup: false,
    isAiVoiceEnabled: false,
    ...overrides,
  };
}

describe("checkOutreachCompliance", () => {
  it("blocks on internal DNC", () => {
    const ctx = baseContext({
      suppression: { internalDnc: true, nationalDnc: false, optedOut: false, unsubscribed: false },
    });
    expect(checkOutreachCompliance(ctx).verdict).toBe("blocked");
  });
  it("blocks on national DNC", () => {
    const ctx = baseContext({
      suppression: { internalDnc: false, nationalDnc: true, optedOut: false, unsubscribed: false },
    });
    expect(checkOutreachCompliance(ctx).verdict).toBe("blocked");
  });
  it("blocks on opt-out", () => {
    const ctx = baseContext({
      suppression: { internalDnc: false, nationalDnc: false, optedOut: true, unsubscribed: false },
    });
    expect(checkOutreachCompliance(ctx).verdict).toBe("blocked");
  });
  it("blocks email on unsubscribe", () => {
    const ctx = baseContext({
      channel: "email",
      suppression: { internalDnc: false, nationalDnc: false, optedOut: false, unsubscribed: true },
    });
    expect(checkOutreachCompliance(ctx).verdict).toBe("blocked");
  });
  it("needs approval without email consent", () => {
    const ctx = baseContext({ channel: "email" });
    expect(checkOutreachCompliance(ctx).verdict).toBe("needs_approval");
  });
  it("allows when consent is present", () => {
    const ctx = baseContext({
      channel: "email",
      consent: { ...createEmptyConsent(), canEmail: true },
    });
    expect(checkOutreachCompliance(ctx).verdict).toBe("allowed");
  });
  it("blocks AI voice always", () => {
    const ctx = baseContext({
      channel: "voice",
      consent: { ...createEmptyConsent(), canCall: true, callRecordingConsent: true },
      hasCallRecordingSetup: true,
      isAiVoiceEnabled: true,
    });
    expect(checkOutreachCompliance(ctx).verdict).toBe("blocked");
  });
  it("blocks voice/sms during quiet hours", () => {
    const ctx = baseContext({
      channel: "voice",
      isQuietHours: true,
      consent: { ...createEmptyConsent(), canCall: true, callRecordingConsent: true },
      hasCallRecordingSetup: true,
    });
    expect(checkOutreachCompliance(ctx).verdict).toBe("blocked");
  });
});

describe("isQuietHours", () => {
  it("detects quiet hours at 10 PM", () => expect(isQuietHours(22)).toBe(true));
  it("detects quiet hours at 3 AM", () => expect(isQuietHours(3)).toBe(true));
  it("allows at 10 AM", () => expect(isQuietHours(10)).toBe(false));
  it("allows at 2 PM", () => expect(isQuietHours(14)).toBe(false));
});

describe("classifyAction", () => {
  it("classifies known high-risk actions", () => {
    expect(classifyAction("submit_binding_offer")).toBe("binding_offer_submission");
    expect(classifyAction("execute_contract")).toBe("contract_execution");
  });
  it("returns null for unknown actions", () => {
    expect(classifyAction("read_property")).toBeNull();
  });
});
