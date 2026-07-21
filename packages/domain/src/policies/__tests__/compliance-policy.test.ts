import { describe, it, expect } from "vitest";
import { checkOutreachCompliance, isQuietHours, classifyAction } from "../compliance.js";
import { createEmptyConsent } from "../../value-objects/contact-point.js";
import type { OutreachContext } from "../compliance.js";

const NOW = new Date("2026-07-09T12:00:00.000Z");

function baseContext(overrides?: Partial<OutreachContext>): OutreachContext {
  return {
    channel: "email",
    consent: createEmptyConsent(NOW),
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
      consent: { ...createEmptyConsent(NOW), canEmail: true },
    });
    expect(checkOutreachCompliance(ctx).verdict).toBe("allowed");
  });
  it("blocks AI voice always", () => {
    const ctx = baseContext({
      channel: "voice",
      consent: { ...createEmptyConsent(NOW), canCall: true, callRecordingConsent: true },
      hasCallRecordingSetup: true,
      isAiVoiceEnabled: true,
    });
    expect(checkOutreachCompliance(ctx).verdict).toBe("blocked");
  });
  it("blocks voice/sms during quiet hours", () => {
    const ctx = baseContext({
      channel: "voice",
      isQuietHours: true,
      consent: { ...createEmptyConsent(NOW), canCall: true, callRecordingConsent: true },
      hasCallRecordingSetup: true,
    });
    expect(checkOutreachCompliance(ctx).verdict).toBe("blocked");
  });
  it("does not bypass voice checks through ringless voicemail", () => {
    const ctx = baseContext({ channel: "ringless_voicemail" });
    expect(checkOutreachCompliance(ctx).verdict).toBe("needs_approval");
    expect(checkOutreachCompliance(ctx).reasonCodes).toContain("MISSING_CALL_CONSENT");
  });

  it.each([
    ["internal DNC", { internalDnc: true }, "INTERNAL_DNC"],
    ["national DNC", { nationalDnc: true }, "NATIONAL_DNC"],
    ["global opt-out", { optedOut: true }, "CONTACT_OPTED_OUT"],
    ["email unsubscribe", { unsubscribed: true }, "UNSUBSCRIBED"],
  ])(
    "keeps %s suppression blocked even when consent is otherwise present",
    (_name, flag, reason) => {
      const result = checkOutreachCompliance(
        baseContext({
          consent: { ...createEmptyConsent(NOW), canEmail: true },
          suppression: {
            internalDnc: false,
            nationalDnc: false,
            optedOut: false,
            unsubscribed: false,
            ...flag,
          },
        }),
      );
      expect(result.verdict).toBe("blocked");
      expect(result.reasonCodes).toContain(reason);
      expect(result.requiredApprovals).toEqual([]);
    },
  );

  it("never allows voice when recording consent is missing", () => {
    const result = checkOutreachCompliance(
      baseContext({
        channel: "voice",
        consent: { ...createEmptyConsent(NOW), canCall: true, callRecordingConsent: false },
        hasCallRecordingSetup: true,
      }),
    );
    expect(result.verdict).toBe("needs_approval");
    expect(result.reasonCodes).toContain("MISSING_CALL_RECORDING_CONSENT");
    expect(result.requiredApprovals).toContain("call_recording_consent");
  });

  it.each(["voice", "ringless_voicemail", "sms"] as const)(
    "blocks %s during quiet hours despite channel consent",
    (channel) => {
      const result = checkOutreachCompliance(
        baseContext({
          channel,
          consent: {
            ...createEmptyConsent(NOW),
            canCall: true,
            canText: true,
            callRecordingConsent: true,
          },
          isQuietHours: true,
          hasCallRecordingSetup: true,
          hasSmsSetup: true,
        }),
      );
      expect(result.verdict).toBe("blocked");
      expect(result.reasonCodes).toContain("QUIET_HOURS");
    },
  );
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
