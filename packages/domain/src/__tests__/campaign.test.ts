import { describe, it, expect } from "vitest";
import { createCampaign, canActivateCampaign } from "../campaign/campaign.entity.js";

const NOW = new Date("2026-07-09T12:00:00.000Z");

describe("Campaign", () => {
  it("creates with draft status", () => {
    const c = createCampaign({
      id: "c-1",
      tenantId: "t-1",
      name: "Test",
      channel: "email",
      now: NOW,
    });
    expect(c.status).toBe("draft");
  });
  it("rejects invalid channel", () => {
    expect(() =>
      createCampaign({
        id: "c-1",
        tenantId: "t-1",
        name: "Test",
        channel: "fax" as never,
        now: NOW,
      }),
    ).toThrow();
  });
  it("can activate from draft", () => {
    const c = createCampaign({
      id: "c-1",
      tenantId: "t-1",
      name: "Test",
      channel: "email",
      now: NOW,
    });
    expect(canActivateCampaign(c)).toBe(true);
  });
});
