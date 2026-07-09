import type { Tenant } from "@rei-os/domain";
import type { Property } from "@rei-os/domain";
import type { Contact } from "@rei-os/domain";
import type { Lead } from "@rei-os/domain";

let counter = 0;
function nextId(prefix: string): string {
  return `${prefix}-${String(++counter).padStart(4, "0")}-${Date.now()}`;
}

export function createTestTenant(overrides?: Partial<Tenant>): Tenant {
  return {
    id: nextId("tenant"),
    name: "Test Tenant",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createTestProperty(overrides?: Partial<Property>): Property {
  return {
    id: nextId("prop"),
    tenantId: nextId("tenant"),
    address: {
      street: "123 Test Street",
      city: "Austin",
      state: "TX",
      zip: "78701",
    },
    characteristics: {
      propertyType: "single_family",
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1800,
      yearBuilt: 1995,
    },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createTestContact(overrides?: Partial<Contact>): Contact {
  return {
    id: nextId("contact"),
    tenantId: nextId("tenant"),
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "555-0100",
    contactType: "owner",
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createTestLead(overrides?: Partial<Lead>): Lead {
  return {
    id: nextId("lead"),
    tenantId: nextId("tenant"),
    propertyId: nextId("prop"),
    ownerId: nextId("contact"),
    source: "manual",
    score: 50,
    status: "new",
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
