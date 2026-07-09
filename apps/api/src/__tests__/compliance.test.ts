import { describe, it, expect } from "vitest";
import { ComplianceController } from "../compliance/compliance.controller.js";

describe("ComplianceController", () => {
  it("returns needs_approval for safety by default", async () => {
    const controller = new ComplianceController();
    const result = await controller.check({
      channel: "email",
      contactId: "00000000-0000-0000-0000-000000000001",
    });
    expect(result.success).toBe(true);
    expect(result.data?.verdict).toBe("needs_approval");
  });
});
