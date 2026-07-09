import { describe, it, expect } from "vitest";
import { getApprovalRequirements, needsApproval, requiresMfa } from "../approval.js";

describe("getApprovalRequirements", () => {
  it("returns requirements for binding offer", () => {
    const req = getApprovalRequirements("binding_offer_submission");
    expect(req.requiresMfa).toBe(true);
    expect(req.requiresAdminApproval).toBe(false);
  });
  it("returns requirements for deed transfer", () => {
    const req = getApprovalRequirements("deed_transfer");
    expect(req.requiresLegalReview).toBe(true);
  });
});

describe("needsApproval", () => {
  it("needs approval for contract execution", () => {
    expect(needsApproval("contract_execution")).toBe(true);
  });
  it("auto-approves small offers", () => {
    expect(needsApproval("binding_offer_submission", 50_000_00)).toBe(false);
  });
  it("needs approval for large offers", () => {
    expect(needsApproval("binding_offer_submission", 200_000_00)).toBe(true);
  });
});

describe("requiresMfa", () => {
  it("all high risk actions require MFA", () => {
    expect(requiresMfa("deed_transfer")).toBe(true);
  });
});
