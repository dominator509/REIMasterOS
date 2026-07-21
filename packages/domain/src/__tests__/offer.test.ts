import { describe, it, expect } from "vitest";
import { createOffer, submitOffer } from "../offer/offer.entity.js";
import { usd } from "../value-objects/money.js";

describe("Offer", () => {
  const now = new Date("2026-07-09T12:00:00.000Z");
  const terms = {
    dueDiligenceDays: 7,
    closingDays: 30,
    contingencies: [],
    assignmentRight: false,
    inspectionPeriod: true,
  };
  it("creates a draft offer", () => {
    const o = createOffer({
      id: "o-1",
      tenantId: "t-1",
      propertyId: "p-1",
      leadId: "l-1",
      amount: usd(20000000),
      offerType: "cash",
      terms,
      submittedBy: "u-1",
      now,
    });
    expect(o.status).toBe("draft");
  });
  it("rejects non-positive amount", () => {
    expect(() =>
      createOffer({
        id: "o-1",
        tenantId: "t-1",
        propertyId: "p-1",
        leadId: "l-1",
        amount: usd(0),
        offerType: "cash",
        terms,
        submittedBy: "u-1",
        now,
      }),
    ).toThrow();
  });
  it("submits a draft", () => {
    const o = createOffer({
      id: "o-1",
      tenantId: "t-1",
      propertyId: "p-1",
      leadId: "l-1",
      amount: usd(20000000),
      offerType: "cash",
      terms,
      submittedBy: "u-1",
      now,
    });
    const submitted = submitOffer(o, now);
    expect(submitted.status).toBe("submitted");
  });
});
