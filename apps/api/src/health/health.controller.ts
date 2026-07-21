import { Controller, Get } from "@nestjs/common";
import type { HealthResponse } from "@rei-os/contracts";
import type { ServiceHealth } from "@rei-os/observability";
import { successResponse } from "../common/response.envelope.js";
import { createDefaultHealthService } from "./health.service.js";

const healthService = createDefaultHealthService();

@Controller("health")
export class HealthController {
  @Get()
  check() {
    const report = healthService.dependencies();
    const health: HealthResponse = {
      status: report.status === "not_configured" ? "degraded" : report.status,
      timestamp: report.timestamp,
      version: report.version,
      services: {
        database: databaseState(report.services.database),
        redis: optionalState(report.services.redis),
        search: optionalState(report.services.search),
        storage: optionalState(report.services.storage),
      },
    };
    return successResponse(health);
  }

  @Get("live")
  live() {
    return successResponse(healthService.live());
  }

  @Get("ready")
  ready() {
    return successResponse(healthService.ready());
  }

  @Get("dependencies")
  dependencies() {
    return successResponse(healthService.dependencies());
  }
}

function databaseState(service: ServiceHealth | undefined): "connected" | "disconnected" | "error" {
  if (service?.status === "ok") return "connected";
  if (service?.status === "error") return "error";
  return "disconnected";
}

function optionalState(
  service: ServiceHealth | undefined,
): "connected" | "disconnected" | "not_configured" {
  if (service?.status === "ok") return "connected";
  if (service?.status === "not_configured" || !service) return "not_configured";
  return "disconnected";
}
