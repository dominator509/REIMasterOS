/**
 * Offline smoke test by default. When both DEPLOYMENT_SMOKE_API_URL and
 * DEPLOYMENT_SMOKE_WEB_URL are set, it also performs read-only deployment
 * reachability and health checks. It never invokes outreach or provider routes.
 */

function deploymentBaseUrl(name: string): URL | undefined {
  const raw = process.env[name];
  if (!raw) return undefined;

  const url = new URL(raw);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`${name} must use http or https`);
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error(`${name} must not contain credentials, a query, or a fragment`);
  }
  url.pathname = url.pathname.replace(/\/$/, "");
  return url;
}

async function deploymentChecks(results: { name: string; passed: boolean }[]): Promise<void> {
  let apiUrl: URL | undefined;
  let webUrl: URL | undefined;
  try {
    apiUrl = deploymentBaseUrl("DEPLOYMENT_SMOKE_API_URL");
    webUrl = deploymentBaseUrl("DEPLOYMENT_SMOKE_WEB_URL");
  } catch {
    results.push({ name: "deployment smoke URL validation", passed: false });
    return;
  }

  if (!apiUrl && !webUrl) return;
  if (!apiUrl || !webUrl) {
    results.push({ name: "deployment smoke URL pair", passed: false });
    return;
  }

  const checks = [
    {
      name: "deployed API liveness",
      url: new URL("/health/live", apiUrl),
      validate: (response: Response, body: unknown) =>
        response.status === 200 &&
        typeof body === "object" &&
        body !== null &&
        "status" in body &&
        body.status === "ok",
      json: true,
    },
    {
      name: "deployed API readiness",
      url: new URL("/health/ready", apiUrl),
      validate: (response: Response, body: unknown) =>
        response.status === 200 &&
        typeof body === "object" &&
        body !== null &&
        "status" in body &&
        body.status === "ok",
      json: true,
    },
    {
      name: "deployed web reachability",
      url: webUrl,
      validate: (response: Response) => response.status >= 200 && response.status < 400,
      json: false,
    },
  ];

  for (const check of checks) {
    try {
      const response = await fetch(check.url, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(5_000),
      });
      const body = check.json ? await response.json() : undefined;
      results.push({ name: check.name, passed: check.validate(response, body) });
    } catch {
      results.push({ name: check.name, passed: false });
    }
  }
}

async function main(): Promise<void> {
  const results: { name: string; passed: boolean }[] = [];

  // Test 1: Domain package exports are accessible
  try {
    const domain = await import("@rei-os/domain");
    if (domain.createTenant && domain.createProperty && domain.createContact && domain.createLead) {
      results.push({ name: "domain exports", passed: true });
    } else {
      results.push({ name: "domain exports", passed: false });
    }
  } catch {
    results.push({ name: "domain exports", passed: false });
  }

  // Test 2: Contracts package exports are accessible
  try {
    const contracts = await import("@rei-os/contracts");
    if (contracts.CreatePropertySchema && contracts.CreateContactSchema) {
      results.push({ name: "contracts exports", passed: true });
    } else {
      results.push({ name: "contracts exports", passed: false });
    }
  } catch {
    results.push({ name: "contracts exports", passed: false });
  }

  // Test 3: Config package exports are accessible
  try {
    const config = await import("@rei-os/config");
    if (config.envSchema && config.loadConfig) {
      results.push({ name: "config exports", passed: true });
    } else {
      results.push({ name: "config exports", passed: false });
    }
  } catch {
    results.push({ name: "config exports", passed: false });
  }

  // Test 4: Testing package exports are accessible
  try {
    const testing = await import("@rei-os/testing");
    if (testing.createTestTenant && testing.createTestProperty) {
      results.push({ name: "testing exports", passed: true });
    } else {
      results.push({ name: "testing exports", passed: false });
    }
  } catch {
    results.push({ name: "testing exports", passed: false });
  }

  // Test 5: Structured logging redacts secrets without external exporters
  try {
    const observability = await import("@rei-os/observability");
    const entries: unknown[] = [];
    const logger = new observability.StructuredLogger({
      service: "smoke",
      environment: "test",
      version: "synthetic",
      sink: (entry) => entries.push(entry),
    });
    logger.info("smoke.logging", {
      operation: "smoke",
      status: "ok",
      requestId: "request-synthetic",
      token: "must-not-leak",
    });
    const output = JSON.stringify(entries);
    results.push({
      name: "redacted structured logging",
      passed: output.includes("[REDACTED]") && !output.includes("must-not-leak"),
    });
  } catch {
    results.push({ name: "redacted structured logging", passed: false });
  }

  // Test 6: Health stays honest when runtime dependencies are absent
  try {
    const { createDefaultHealthService } =
      await import("../../apps/api/src/health/health.service.js");
    const health = createDefaultHealthService({});
    const output = JSON.stringify(health.dependencies());
    results.push({
      name: "safe dependency health",
      passed:
        health.live().status === "ok" &&
        health.ready().status === "error" &&
        output.includes("not_configured") &&
        !output.includes("://"),
    });
  } catch {
    results.push({ name: "safe dependency health", passed: false });
  }

  // Test 7: Compliance blocks outreach before any provider side effect
  try {
    const domain = await import("@rei-os/domain");
    const verdict = domain.checkOutreachCompliance({
      channel: "voice",
      consent: {
        canCall: false,
        canText: false,
        canEmail: false,
        canDirectMail: false,
        callRecordingConsent: false,
      },
      suppression: {
        internalDnc: false,
        nationalDnc: false,
        optedOut: true,
        unsubscribed: false,
      },
      isQuietHours: false,
      hasCallRecordingSetup: false,
      hasSmsSetup: false,
      isAiVoiceEnabled: false,
    });
    results.push({ name: "compliance fail-closed", passed: verdict.verdict === "blocked" });
  } catch {
    results.push({ name: "compliance fail-closed", passed: false });
  }

  // Test 8: Buffered AI output never releases a hidden-prefix marker
  try {
    const { BufferedHiddenPrefixSanitizer } =
      await import("../../apps/api/src/ai/prompt-safety.js");
    const sanitizer = new BufferedHiddenPrefixSanitizer("private-prefix");
    sanitizer.push("hidden_prefix private-prefix");
    let blocked = false;
    try {
      sanitizer.finish();
    } catch {
      blocked = true;
    }
    results.push({ name: "AI output sanitizer", passed: blocked });
  } catch {
    results.push({ name: "AI output sanitizer", passed: false });
  }

  await deploymentChecks(results);

  // Report
  const passed = results.filter((r) => r.passed);
  const failed = results.filter((r) => !r.passed);

  console.log(`Smoke: ${String(passed.length)} passed, ${String(failed.length)} failed`);
  if (failed.length > 0) {
    for (const f of failed) {
      console.error(`  FAIL: ${f.name}`);
    }
    process.exit(1);
  }
}

void main();
