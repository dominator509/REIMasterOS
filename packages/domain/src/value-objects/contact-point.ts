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
  return {
    type: params.type,
    value: params.value,
    status: "unverified",
  };
}

export function createEmptyConsent(): ConsentState {
  return {
    canEmail: false,
    canCall: false,
    canText: false,
    canDirectMail: false,
    callRecordingConsent: false,
    lastUpdated: new Date(),
  };
}

export function markContactPointOptedOut(cp: ContactPoint): ContactPoint {
  return { ...cp, status: "opted_out", optedOutAt: new Date() };
}
