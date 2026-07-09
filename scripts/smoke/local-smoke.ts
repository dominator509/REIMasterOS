/**
 * Local smoke test — confirms the monorepo builds and basic
 * package imports work without live services.
 */

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
