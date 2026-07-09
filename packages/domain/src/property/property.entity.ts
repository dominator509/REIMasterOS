/** A real estate property. */
export interface Property {
  readonly id: string;
  readonly tenantId: string;
  readonly address: PropertyAddress;
  readonly characteristics: PropertyCharacteristics;
  readonly status: PropertyStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  county?: string;
}

export interface PropertyCharacteristics {
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  lotSize?: number;
  yearBuilt?: number;
  propertyType: PropertyType;
}

export type PropertyStatus = "active" | "inactive" | "archived";
export type PropertyType =
  "single_family" | "multi_family" | "condo" | "townhouse" | "land" | "commercial" | "other";

export function createProperty(params: {
  id: string;
  tenantId: string;
  address: PropertyAddress;
  characteristics: PropertyCharacteristics;
}): Property {
  return {
    id: params.id,
    tenantId: params.tenantId,
    address: params.address,
    characteristics: params.characteristics,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
