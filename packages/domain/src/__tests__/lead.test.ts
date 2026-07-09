import { describe, it, expect } from "vitest";
import { createLead, calculateLeadScore } from "../lead/lead.entity.js";
import { createProperty } from "../property/property.entity.js";
import { createContact } from "../contact/contact.entity.js";

describe("Lead", () => {
  it("creates a lead with default values", () => {
    const lead = createLead({
      id: "lead-1",
      tenantId: "tenant-1",
      propertyId: "property-1",
      ownerId: "owner-1",
    });
    expect(lead.status).toBe("new");
    expect(lead.score).toBe(0);
    expect(lead.source).toBe("manual");
  });

  it("creates a lead with custom source", () => {
    const lead = createLead({
      id: "lead-2",
      tenantId: "tenant-1",
      propertyId: "property-2",
      ownerId: "owner-2",
      source: "csv_import",
    });
    expect(lead.source).toBe("csv_import");
  });
});

describe("calculateLeadScore", () => {
  it("returns baseline score for minimal property/owner", () => {
    const property = createProperty({
      id: "p-1",
      tenantId: "t-1",
      address: { street: "123 Main", city: "Test", state: "TS", zip: "12345" },
      characteristics: { propertyType: "single_family" },
    });
    const owner = createContact({
      id: "c-1",
      tenantId: "t-1",
      firstName: "John",
      lastName: "Doe",
    });
    expect(calculateLeadScore(property, owner)).toBe(50);
  });

  it("scores higher for properties >1500 sqft with contact info", () => {
    const property = createProperty({
      id: "p-2",
      tenantId: "t-1",
      address: { street: "456 Oak", city: "Test", state: "TS", zip: "12345" },
      characteristics: { propertyType: "single_family", squareFeet: 2000 },
    });
    const owner = createContact({
      id: "c-2",
      tenantId: "t-1",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "555-0100",
    });
    expect(calculateLeadScore(property, owner)).toBe(75);
  });
});
