import type { Property } from "../property/property.entity.js";
import type { Contact } from "../contact/contact.entity.js";

/** A property+owner pair with acquisition potential. */
export interface Lead {
  readonly id: string;
  readonly tenantId: string;
  readonly propertyId: string;
  readonly ownerId: string;
  readonly source: LeadSource;
  readonly score: number;
  readonly status: LeadStatus;
  readonly notes: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type LeadSource =
  "csv_import" | "provider_api" | "manual" | "website" | "referral" | "other";
export type LeadStatus =
  "new" | "contacted" | "negotiating" | "under_contract" | "closed" | "dead" | "archived";

export function createLead(params: {
  id: string;
  tenantId: string;
  propertyId: string;
  ownerId: string;
  source?: LeadSource;
}): Lead {
  return {
    id: params.id,
    tenantId: params.tenantId,
    propertyId: params.propertyId,
    ownerId: params.ownerId,
    source: params.source ?? "manual",
    score: 0,
    status: "new",
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/** Calculate a lead score from property and owner data. */
export function calculateLeadScore(property: Property, owner: Contact): number {
  let score = 50; // baseline
  if (property.characteristics.squareFeet && property.characteristics.squareFeet > 1500)
    score += 10;
  if (property.characteristics.yearBuilt && property.characteristics.yearBuilt < 1980) score += 5;
  if (owner.email) score += 5;
  if (owner.phone) score += 10;
  return Math.min(100, score);
}
