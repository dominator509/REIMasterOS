import { describe, it, expect } from "vitest";
import { HealthController } from "../health/health.controller.js";
import { HealthService } from "../health/health.service.js";

describe("HealthController", () => {
  it("returns an honest public health envelope", () => {
    const controller = new HealthController();
    const result = controller.check();
    expect(result.data.status).toBe("degraded");
    expect(result.data.timestamp).toBeDefined();
    expect(result.data.services.database).toBe("disconnected");
    expect(result.meta.requestId).toBeDefined();
  });

  it("separates liveness from readiness and redacts probe details", () => {
    const service = new HealthService({
      version: "synthetic-version",
      now: () => new Date("2026-07-18T00:00:00.000Z"),
      uptimeSeconds: () => 12,
      dependencies: {
        database: () => ({ status: "ok", latencyMs: 4, message: "connected" }),
        redis: () => ({ status: "degraded", message: "redis://secret@host" }),
        ai_gateway: () => ({ status: "not_configured" }),
      },
    });

    expect(service.live()).toMatchObject({ status: "ok", services: { api: { status: "ok" } } });
    expect(service.ready()).toMatchObject({ status: "degraded", uptimeSeconds: 12 });
    expect(service.dependencies().services.redis?.message).toBe("redacted");
    expect(JSON.stringify(service.dependencies())).not.toContain("secret@host");
  });

  it("fails readiness closed when the required database probe fails", () => {
    const service = new HealthService({
      version: "synthetic-version",
      dependencies: {
        database: () => {
          throw new Error("postgresql://secret@host/database");
        },
      },
    });
    expect(service.ready()).toMatchObject({
      status: "error",
      services: { database: { status: "error", message: "health_probe_failed" } },
    });
    expect(JSON.stringify(service.ready())).not.toContain("secret@host");
  });
});
