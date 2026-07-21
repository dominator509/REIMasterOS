import type { HealthReport, HealthStatus, ServiceHealth } from "@rei-os/observability";

export interface HealthServiceOptions {
  readonly version: string;
  readonly now?: () => Date;
  readonly uptimeSeconds?: () => number;
  readonly dependencies: Readonly<Record<string, () => ServiceHealth>>;
  readonly requiredDependencies?: readonly string[];
}

export class HealthService {
  private readonly now: () => Date;
  private readonly uptimeSeconds: () => number;
  private readonly requiredDependencies: ReadonlySet<string>;

  constructor(private readonly options: HealthServiceOptions) {
    this.now = options.now ?? (() => new Date());
    this.uptimeSeconds = options.uptimeSeconds ?? (() => process.uptime());
    this.requiredDependencies = new Set(options.requiredDependencies ?? ["database"]);
  }

  live(): HealthReport {
    return this.report("ok", { api: { status: "ok", message: "process_alive" } });
  }

  dependencies(): HealthReport {
    const services = this.checkDependencies();
    return this.report(this.aggregateStatus(services), services);
  }

  ready(): HealthReport {
    const services = this.checkDependencies();
    const requiredUnavailable = Object.entries(services).some(
      ([name, service]) => this.requiredDependencies.has(name) && service.status !== "ok",
    );
    return this.report(requiredUnavailable ? "error" : this.aggregateStatus(services), services);
  }

  private checkDependencies(): Record<string, ServiceHealth> {
    return Object.fromEntries(
      Object.entries(this.options.dependencies).map(([name, probe]) => {
        try {
          return [name, sanitizeHealth(probe())];
        } catch {
          return [
            name,
            { status: "error", message: "health_probe_failed" } satisfies ServiceHealth,
          ];
        }
      }),
    );
  }

  private aggregateStatus(services: Record<string, ServiceHealth>): HealthStatus {
    const statuses = Object.values(services).map((service) => service.status);
    if (statuses.includes("error")) return "error";
    if (statuses.includes("degraded") || statuses.includes("not_configured")) return "degraded";
    return "ok";
  }

  private report(status: HealthStatus, services: Record<string, ServiceHealth>): HealthReport {
    return {
      status,
      timestamp: this.now().toISOString(),
      version: this.options.version,
      uptimeSeconds: Math.max(0, this.uptimeSeconds()),
      services,
    };
  }
}

function sanitizeHealth(health: ServiceHealth): ServiceHealth {
  return {
    status: health.status,
    ...(health.latencyMs !== undefined ? { latencyMs: Math.max(0, health.latencyMs) } : {}),
    ...(health.message
      ? { message: /^[a-z0-9_.-]+$/u.test(health.message) ? health.message : "redacted" }
      : {}),
  };
}

export function createDefaultHealthService(
  env: Readonly<Record<string, string | undefined>> = process.env,
): HealthService {
  const configured = (value: string | undefined): ServiceHealth =>
    value ? { status: "degraded", message: "probe_not_connected" } : { status: "not_configured" };

  return new HealthService({
    version: "0.0.0",
    dependencies: {
      database: () => configured(env.DATABASE_URL),
      redis: () => configured(env.REDIS_URL),
      search: () =>
        env.SEARCH_PROVIDER && env.SEARCH_PROVIDER !== "disabled"
          ? configured(env.SEARCH_URL)
          : { status: "not_configured" },
      storage: () =>
        env.OBJECT_STORAGE_PROVIDER && env.OBJECT_STORAGE_PROVIDER !== "local"
          ? configured(env.OBJECT_STORAGE_ENDPOINT)
          : { status: "not_configured" },
      workers: () => ({ status: "not_configured" }),
      ai_gateway: () => ({ status: "not_configured" }),
      compliance_provider: () => ({ status: "not_configured" }),
      provider_adapters: () => ({ status: "not_configured" }),
    },
  });
}
