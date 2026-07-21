/** A channel-specific contact endpoint. */
export type ContactPointType = "email" | "phone" | "mailing_address" | "telegram" | "other";

export type ContactPointStatus = "active" | "unverified" | "bounced" | "disconnected" | "opted_out";

export interface ContactPoint {
  readonly type: ContactPointType;
  readonly value: string;
  readonly status: ContactPointStatus;
  readonly verifiedAt?: Date;
  readonly optedOutAt?: Date;
}

export interface ConsentState {
  readonly canEmail: boolean;
  readonly canCall: boolean;
  readonly canText: boolean;
  readonly canDirectMail: boolean;
  readonly callRecordingConsent: boolean;
  readonly lastUpdated: Date;
}

export interface SuppressionState {
  readonly internalDnc: boolean;
  readonly nationalDnc: boolean;
  readonly optedOut: boolean;
  readonly unsubscribed: boolean;
  readonly reason?: string;
  readonly suppressedAt?: Date;
}

export function createContactPoint(params: {
  type: ContactPointType;
  value: string;
}): ContactPoint {
  const value = params.value.trim();
  if (!value) throw new Error("Contact point value is required");
  if (params.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value)) {
    throw new Error("Invalid email contact point");
  }
  if (params.type === "phone" && !/^\+?[\d().\s-]{7,20}$/u.test(value)) {
    throw new Error("Invalid phone contact point");
  }
  return {
    type: params.type,
    value,
    status: "unverified",
  };
}

export function createEmptyConsent(now: Date): ConsentState {
  return {
    canEmail: false,
    canCall: false,
    canText: false,
    canDirectMail: false,
    callRecordingConsent: false,
    lastUpdated: now,
  };
}

export function markContactPointOptedOut(cp: ContactPoint, now: Date): ContactPoint {
  return { ...cp, status: "opted_out", optedOutAt: now };
}
