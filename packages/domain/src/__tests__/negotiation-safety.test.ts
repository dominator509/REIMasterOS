import { describe, it, expect } from "vitest";
import { checkNegotiationSafety } from "../negotiation/negotiation-safety.js";

describe("checkNegotiationSafety", () => {
  it("allows normal messages", () => {
    const result = checkNegotiationSafety({
      text: "Hi, I'd like to discuss your property at 123 Main St.",
    });
    expect(result.verdict).toBe("allowed");
  });

  it("blocks guaranteed return claims", () => {
    const result = checkNegotiationSafety({
      text: "I can guarantee this property will appreciate 20% in one year.",
    });
    expect(result.verdict).toBe("blocked");
    expect(result.blockedReasons).toContain(
      "MISREPRESENTATION: guaranteed return claims prohibited",
    );
  });

  it("blocks invented competing offers", () => {
    const result = checkNegotiationSafety({
      text: "Another buyer has offered $250k so you should accept mine.",
    });
    expect(result.verdict).toBe("blocked");
  });

  it("warns on tactical empathy patterns", () => {
    const result = checkNegotiationSafety({
      text: "I understand your position and I hear you on the price concerns.",
    });
    expect(result.verdict).toBe("warned");
  });

  it("blocks false funds claims", () => {
    const result = checkNegotiationSafety({
      text: "I have the funds ready, pre-approved and verified for $300k.",
    });
    expect(result.verdict).toBe("blocked");
  });

  it("blocks unauthorized commitments", () => {
    const result = checkNegotiationSafety({ text: "I can guarantee we will close in 30 days." });
    expect(result.verdict).toBe("blocked");
  });
});
