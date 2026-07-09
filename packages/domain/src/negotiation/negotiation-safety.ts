export type NegotiationSafetyVerdict = "allowed" | "warned" | "blocked";

export interface NegotiationSafetyResult {
  readonly verdict: NegotiationSafetyVerdict;
  readonly warnings: readonly string[];
  readonly blockedReasons: readonly string[];
}

export interface NegotiationMessage {
  readonly text: string;
  readonly intent?: string;
}

/**
 * Check a negotiation message for unsafe patterns.
 * Allowed: tactical empathy (acknowledging the other party's perspective).
 * Blocked: misrepresentation, invented offers, false funds claims,
 *   protected-class targeting, confidential motivation misuse,
 *   unauthorized commitments, impersonation.
 */
export function checkNegotiationSafety(message: NegotiationMessage): NegotiationSafetyResult {
  const warnings: string[] = [];
  const blocked: string[] = [];

  const lower = message.text.toLowerCase();

  // Blocked: misrepresentation
  if (
    /\b(guarantee|guaranteed|promise|assure)\b.*\b(appreciate|profit|return)\b.*\b\d+\s*%/i.test(
      lower,
    )
  ) {
    blocked.push("MISREPRESENTATION: guaranteed return claims prohibited");
  }

  // Blocked: invented offers
  if (
    /\b(another buyer|other offer|competing bid)\b.*\b(has offered|is offering|bid)\b/i.test(
      lower,
    ) &&
    !message.intent?.includes("factual_disclosure")
  ) {
    blocked.push("INVENTED_OFFER: false competing offer claims prohibited");
  }

  // Blocked: false funds
  if (
    /\b(have the funds|cash in hand|money ready)\b/i.test(lower) &&
    /\b(pre-approved|verified|confirmed)\b/i.test(lower) &&
    message.intent !== "factual_funds_disclosure"
  ) {
    blocked.push("FALSE_FUNDS: unverified funds claims prohibited");
  }

  // Blocked: protected class targeting
  if (
    /\b(elderly|senior citizen|old(er)? (person|people|owner)s?)\b/i.test(lower) &&
    /\b(sell|pressure|must act|limited time|distressed)\b/i.test(lower)
  ) {
    blocked.push("PROTECTED_CLASS: exploitative targeting of protected persons prohibited");
  }

  // Blocked: unauthorized commitments
  if (
    /\b(I (can|will) (close|guarantee|promise))\b/i.test(lower) &&
    !message.intent?.includes("authorized_agent")
  ) {
    blocked.push("UNAUTHORIZED_COMMITMENT: binding commitments require authorization");
  }

  // Blocked: impersonation
  if (
    /\b(speaking on behalf of|representing the owner|power of attorney)\b/i.test(lower) &&
    !message.intent?.includes("verified_representation")
  ) {
    blocked.push("IMPERSONATION: representation claims require verification");
  }

  // Warned: tactical empathy (allowed but flagged)
  if (/\b(I understand|I hear you|I see where|that makes sense)\b/i.test(lower)) {
    warnings.push("TACTICAL_EMPATHY: communication style allowed, ensure authenticity");
  }

  if (blocked.length > 0) {
    return { verdict: "blocked", warnings, blockedReasons: blocked };
  }
  if (warnings.length > 0) {
    return { verdict: "warned", warnings, blockedReasons: [] };
  }
  return { verdict: "allowed", warnings: [], blockedReasons: [] };
}
