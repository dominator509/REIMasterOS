import type { TenantId, EntityId, UserId } from "../value-objects/entity-id.js";
import type { Money } from "../value-objects/money.js";

export interface Offer {
  readonly id: EntityId;
  readonly tenantId: TenantId;
  readonly propertyId: EntityId;
  readonly leadId: EntityId;
  readonly amount: Money;
  readonly offerType: OfferType;
  readonly terms: OfferTerms;
  readonly status: OfferStatus;
  readonly submittedBy: UserId;
  readonly submittedAt: Date;
  readonly expiresAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type OfferType =
  | "cash"
  | "financed"
  | "hard_money"
  | "private_money"
  | "subject_to"
  | "lease_option"
  | "wholesale";
export type OfferStatus =
  "draft" | "submitted" | "countered" | "accepted" | "rejected" | "expired" | "withdrawn";

export interface OfferTerms {
  earnestMoney?: Money;
  dueDiligenceDays: number;
  closingDays: number;
  contingencies: readonly string[];
  assignmentRight: boolean;
  inspectionPeriod: boolean;
}

export function createOffer(params: {
  id: string;
  tenantId: string;
  propertyId: string;
  leadId: string;
  amount: Money;
  offerType: OfferType;
  terms: OfferTerms;
  submittedBy: string;
  now: Date;
}): Offer {
  if (params.amount.amountCents <= 0) throw new Error("Offer amount must be positive");
  if (params.terms.closingDays < 1) throw new Error("Closing days must be at least 1");
  return {
    id: params.id as EntityId,
    tenantId: params.tenantId as TenantId,
    propertyId: params.propertyId as EntityId,
    leadId: params.leadId as EntityId,
    amount: params.amount,
    offerType: params.offerType,
    terms: params.terms,
    status: "draft",
    submittedBy: params.submittedBy as UserId,
    submittedAt: params.now,
    createdAt: params.now,
    updatedAt: params.now,
  };
}

export function submitOffer(offer: Offer, now: Date): Offer {
  if (offer.status !== "draft") throw new Error("Only draft offers can be submitted");
  return { ...offer, status: "submitted", submittedAt: now, updatedAt: now };
}
