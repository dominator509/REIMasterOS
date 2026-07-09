import { describe, it, expect } from "vitest";
import { toTenantId, toEntityId } from "../value-objects/entity-id.js";
import { createAddress, isValidState } from "../value-objects/address.js";
import {
  usd,
  moneyFromDollars,
  addMoney,
  multiplyMoney,
  formatMoney,
} from "../value-objects/money.js";
import { createContactPoint } from "../value-objects/contact-point.js";

describe("EntityId", () => {
  it("creates branded ids", () => {
    expect(toTenantId("t-1")).toBe("t-1");
    expect(toEntityId("e-1")).toBe("e-1");
  });
  it("rejects empty ids", () => {
    expect(() => toTenantId("")).toThrow();
    expect(() => toEntityId("")).toThrow();
  });
});

describe("Address", () => {
  it("validates state codes", () => {
    expect(isValidState("TX")).toBe(true);
    expect(isValidState("tx")).toBe(true);
    expect(isValidState("XX")).toBe(false);
  });
  it("validates ZIP", () => {
    expect(() =>
      createAddress({ street: "123 Main", city: "Austin", state: "TX", zip: "abc" }),
    ).toThrow();
    expect(
      createAddress({ street: "123 Main", city: "Austin", state: "TX", zip: "78701" }),
    ).toBeDefined();
  });
});

describe("Money", () => {
  it("formats correctly", () => {
    expect(formatMoney(usd(0))).toBe("$0.00");
    expect(formatMoney(usd(15000000))).toBe("$150000.00");
    expect(formatMoney(usd(-500))).toBe("-$5.00");
  });
  it("adds money", () => {
    expect(addMoney(usd(100), usd(200)).amountCents).toBe(300);
  });
  it("multiplies money", () => {
    expect(multiplyMoney(usd(1000), 0.7).amountCents).toBe(700);
  });
  it("creates from dollars", () => {
    expect(moneyFromDollars(1500.5).amountCents).toBe(150050);
  });
});

describe("ContactPoint", () => {
  it("creates with unverified status", () => {
    const cp = createContactPoint({ type: "email", value: "test@example.com" });
    expect(cp.status).toBe("unverified");
  });
});
