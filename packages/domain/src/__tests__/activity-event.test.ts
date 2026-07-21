import { describe, expect, it } from "vitest";
import { createActivityEvent } from "../activity/activity-event.entity.js";

describe("ActivityEvent", () => {
  it("creates a deterministic append-only event descriptor", () => {
    const timestamp = new Date("2026-07-09T12:00:00.000Z");
    const event = createActivityEvent({
      id: "activity-1",
      tenantId: "tenant-1",
      actorId: "system",
      action: "lead.created",
      targetType: "lead",
      targetId: "lead-1",
      metadata: { source: "csv_import" },
      timestamp,
    });

    expect(event.timestamp).toBe(timestamp);
    expect(event.metadata).toEqual({ source: "csv_import" });
  });

  it("rejects invalid identifiers", () => {
    expect(() =>
      createActivityEvent({
        id: "",
        tenantId: "tenant-1",
        actorId: "system",
        action: "lead.created",
        targetType: "lead",
        targetId: "lead-1",
        timestamp: new Date("2026-07-09T12:00:00.000Z"),
      }),
    ).toThrow("Invalid entity ID");
  });
});
