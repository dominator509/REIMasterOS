import { describe, it, expect } from "vitest";
import { createCampaign, canActivateCampaign } from "../campaign/campaign.entity.js";

describe("Campaign", () => {
  it("creates with draft status", () => {
    const c = createCampaign({ id: "c-1", tenantId: "t-1", name: "Test", channel: "email" });
    expect(c.status).toBe("draft");
  });
  it("rejects invalid channel", () => {
    expect(() =>
      createCampaign({ id: "c-1", tenantId: "t-1", name: "Test", channel: "fax" as any }),
    ).toThrow();
  });
  it("can activate from draft", () => {
    const c = createCampaign({ id: "c-1", tenantId: "t-1", name: "Test", channel: "email" });
    expect(canActivateCampaign(c)).toBe(true);
  });
});
