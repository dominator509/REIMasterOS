# EP-008: Observability and Operations

## 1. Purpose / Big Picture

Add structured logging, redaction, metrics, traces, health checks, dashboards, alerts, runbooks, and operational smoke coverage for the platform.

## 2. Scope

- Logging/redaction package.
- Health endpoints.
- Smoke test expansion.
- Metrics/traces for API/workers/providers/compliance/search/AI/cache/cost.
- Dashboard/alert config skeletons.
- Runbook updates.

## 3. Non-goals

- No paid observability vendor requirement.
- No secrets or raw DNC/prompt logging.
- No production incident simulation against live users.
- No broad feature work.

## 4. Context and Orientation

Observability is Layer 6 but spans runtime layers. It must be self-hostable and must not leak sensitive data.

## 5. Files to Read First

- `AGENTS.md`
- `COMMANDS.md`
- `.agent/PLANS.md`
- `OBSERVABILITY.md`
- `OPERATIONS.md`
- `SECURITY.md`
- `SPEC-007-observability.md`
- `PRODUCTION_READINESS.md`

## 6. Files to Change

Expected changed files/directories:

- `packages/observability/**`
- `apps/api/src/observability/**`
- `apps/api/src/health/**`
- `services/ai-gateway/**`
- `workers/**`
- `scripts/smoke/**`
- `infra/otel/**`
- `infra/grafana/**`
- `infra/prometheus/**`
- `OBSERVABILITY.md`
- `OPERATIONS.md`
- `.agent/execplans/EP-008-observability-and-operations.md`
- `DECISIONS.md`

Do not change files outside this list unless repository evidence requires it. Any extra file must be recorded in the Decision Log with reason and validation.

## 7. Interfaces and Contracts

- Logs use structured redacted fields.
- Metrics names are stable.
- Health checks reveal status without secrets.
- LLM cache metrics for Hermes and DeepSeek are separated.
- Smoke tests do not send live outreach.

## 8. Milestones

### Milestone 1: Add structured logging and redaction

- **Goal:** Create redacted structured logs for API/workers/AI gateway boundaries.
- **Files to read:** OBSERVABILITY.md, SECURITY.md
- **Files to change:** packages/observability/**, apps/api/src/observability/**, services/ai-gateway/**, workers/**, apps/api/test/**
- **Exact edits expected:** Add logger interface, required fields, redaction helpers, tests preventing secrets/DNC/hidden-prefix logging.
- **Validation command:** `sh scripts/test-unit.sh && sh scripts/test-integration.sh`
- **Expected result:** Logging/redaction tests pass.
- **Recovery instruction:** If observability package absent, create minimal package and record expected changed file.

### Milestone 2: Add health checks and smoke coverage

- **Goal:** Expose liveness/readiness/dependency health and verify smoke tests.
- **Files to read:** OPERATIONS.md, OBSERVABILITY.md, COMMANDS.md
- **Files to change:** apps/api/src/health/**, services/ai-gateway/**, scripts/smoke/**, apps/api/test/**
- **Exact edits expected:** Implement health endpoints for API/dependencies/workers/AI routes with redacted details; update smoke test to verify critical safe paths.
- **Validation command:** `sh scripts/smoke-test.sh`
- **Expected result:** Smoke test prints `smoke test: ok`.
- **Recovery instruction:** If dependency services not running, smoke test must report disabled/not-configured safely rather than requiring paid providers.

### Milestone 3: Add metrics and trace instrumentation

- **Goal:** Measure critical API, worker, provider, compliance, search, and AI cache signals.
- **Files to read:** SPEC-007-observability.md, OBSERVABILITY.md
- **Files to change:** packages/observability/src/metrics/**, apps/api/src/**, workers/**, services/ai-gateway/**, apps/api/test/**
- **Exact edits expected:** Add metric names/helpers, OpenTelemetry setup, cache metrics separated by Hermes/DeepSeek, compliance/provider/cost metrics, and tests for metric emission.
- **Validation command:** `sh scripts/test-integration.sh`
- **Expected result:** Metrics/tracing tests pass or disabled-state tests pass when exporter not configured.
- **Recovery instruction:** If telemetry exporter unavailable, use no-op exporter with same interfaces and record config.

### Milestone 4: Add dashboards, alerts, and runbooks

- **Goal:** Document/provision operational views and alerts.
- **Files to read:** OBSERVABILITY.md, OPERATIONS.md
- **Files to change:** infra/otel/**, infra/grafana/**, infra/prometheus/**, OPERATIONS.md, OBSERVABILITY.md
- **Exact edits expected:** Add dashboard/alert config skeletons for system, campaigns, compliance, providers, AI cache, costs, queues, search, voice; update runbooks.
- **Validation command:** `sh scripts/production-readiness-check.sh`
- **Expected result:** Readiness check validates observability files exist or clearly lists missing implementation.
- **Recovery instruction:** If production readiness script placeholder fails, update it in EP-008 only if enough checks exist; otherwise record blocker for EP-010.

### Milestone 5: Final observability review

- **Goal:** Verify instrumentation and docs.
- **Files to read:** PRODUCTION_READINESS.md, COMMANDS.md
- **Files to change:** .agent/execplans/EP-008-observability-and-operations.md, OBSERVABILITY.md, OPERATIONS.md, DECISIONS.md
- **Exact edits expected:** Update progress, decision log, outcomes, and docs with actual metric names and dashboards.
- **Validation command:** `sh scripts/verify.sh`
- **Expected result:** Full verification passes.
- **Recovery instruction:** If full verify fails outside observability, record out-of-scope failures and run observability-specific tests.

## 9. Concrete Steps

### Milestone 1 Steps: Add structured logging and redaction

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-unit.sh && sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 2 Steps: Add health checks and smoke coverage

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/smoke-test.sh`.
5. Record command output and update Progress before continuing.

### Milestone 3 Steps: Add metrics and trace instrumentation

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 4 Steps: Add dashboards, alerts, and runbooks

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/production-readiness-check.sh`.
5. Record command output and update Progress before continuing.

### Milestone 5 Steps: Final observability review

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/verify.sh`.
5. Record command output and update Progress before continuing.

## 10. Validation and Acceptance

Required final validation:

```sh
sh scripts/verify.sh
```

Acceptance criteria:

- Structured redacted logging exists.
- Health/smoke checks exist.
- Critical metrics/traces exist or no-op safely when disabled.
- Dashboards/alerts/runbooks documented or provisioned.
- Observability validation passes.

If a final validation command cannot run because this greenfield repository has not yet reached the required implementation phase, record the exact failure, complete the narrower milestone validations that are in scope, and stop only if `AGENTS.md` STOP conditions apply.

## 11. Idempotence and Recovery

Instrumentation should be additive. Disabled providers must produce explicit disabled-state health rather than failures unless required by environment.

General recovery:

- Inspect the exact error before editing.
- Apply the bounded retry rule in `AGENTS.md`.
- Prefer additive changes and deterministic fixtures.
- Never patch blindly around the same failure.
- If repository reality differs from this ExecPlan, choose the smallest safe change consistent with specs, record it, and continue.
- Stop only for STOP conditions in `AGENTS.md`.

## 12. Progress

Initial state: Not started. Requires API/workers/services to instrument.

- [x] Milestone 1: Add structured logging and redaction — after fixing the DNC underscore-boundary bypass found by the first run, `sh scripts/test-unit.sh && sh scripts/test-integration.sh` passed on 2026-07-18 with observability 3 files/15 tests, API 12 files/38 tests, persistence 24 passed/1 opt-in live test skipped, and all other workspace suites green.
- [x] Milestone 2: Add health checks and smoke coverage — `/health/live`, `/health/ready`, and `/health/dependencies` now expose redacted state; required database readiness fails closed while optional absent services report `not_configured`. `sh scripts/smoke-test.sh` passed with 8/8 safe checks on 2026-07-18.
- [x] Milestone 3: Add metrics and trace instrumentation — `sh scripts/typecheck.sh` passed across all packages and `sh scripts/test-integration.sh` passed on 2026-07-18 with API 13 files/42 tests, adapters 6 tests, and persistence 24 passed/1 opt-in live test skipped.
- [x] Milestone 4: Add dashboards, alerts, and runbooks — OTel metric/trace pipelines, Prometheus scrape/alert rules, an 11-panel Grafana operations dashboard, and alert triage guidance are structurally provisioned. `sh scripts/production-readiness-check.sh` passed on 2026-07-18 and explicitly reports repository-artifact scope only.
- [x] Milestone 5: Final observability review — after removing one unused health-controller type import reported by the first lint stage, `sh scripts/verify.sh` passed on 2026-07-18 in 195.1s.

## 13. Surprises & Discoveries

- 2026-07-07: Self-hosted observability is default; commercial observability adapters are optional.
- 2026-07-18: The existing logger interface had no implementation and omitted the documented service/environment/version/operation/status fields. A provider-neutral structured logger and API factory now enforce correlation, event-name-only messages, recursive redaction, and exclusion of exception messages.
- 2026-07-18: The first Milestone 1 unit run exposed that `\bdnc\b` does not match keys such as `raw_dnc` because underscore is a JavaScript word character. The detector now uses alphanumeric boundaries, and the same test plus the complete required validation pass.
- 2026-07-18: The prior aggregate `/health` route was hard-coded and could not distinguish process liveness from readiness. The new health service keeps the legacy envelope for compatibility while exposing separate reports for API process, required database readiness, and optional worker/AI/provider/search/storage states.
- 2026-07-18: No OpenTelemetry library or exporter dependency exists. The repository now has redacted tracer/collector ports, an in-memory deterministic test implementation, and no-op implementations for exporter-disabled environments; actual OTLP wiring remains disabled until runtime configuration exists.
- 2026-07-18: Typecheck caught zero-argument concrete signatures on the no-op tracer/collector implementations. Restoring their full interface signatures preserved substitutability and the same typecheck plus integration validation passed.
- 2026-07-18: Existing observability provisioning was internally inconsistent: Grafana used obsolete metric names, Prometheus scraped application ports with no metrics endpoint, OTel had no trace pipeline, and the readiness script never failed on missing files. The skeletons now share stable names and the readiness script tracks failures.
- 2026-07-18: The first final verify stopped on one unused `HealthReport` type import. Removing that import, rerunning `sh scripts/lint.sh`, and restarting the full verifier produced a green result; no behavioral change was required.

## 14. Decision Log

- 2026-07-07: LLM cache and hidden-prefix metrics must not log prompt text.
- 2026-07-18: Raw-DNC context is replaced with `redaction_status=blocked_sensitive_payload` at the logging boundary rather than being emitted or throwing into business logic. Unsafe free-text log messages become `unsafe_log_event`; errors retain only their class name and structured error code.
- 2026-07-18: `apps/api/package.json`, its lockfile entry, and `apps/api/src/__tests__/api-structured-logger.test.ts` are justified framework/test extras required to consume the existing workspace observability package at the API boundary.
- 2026-07-18: The existing root `apps/api/src/health.controller.ts` remains as a compatibility re-export while `AppModule` uses the scoped `apps/api/src/health/**` implementation required by this ExecPlan.
- 2026-07-18: Smoke remains local and side-effect-free. It imports pure health/compliance/sanitizer seams and does not start a server, connect to dependencies, expose environment values, or call any provider.
- 2026-07-18: Metric labels are explicit per definition and reject full URLs, emails, prompt text, and arbitrary keys. The API helper accepts route patterns/event codes rather than raw URLs and emits separate cache labels for `hermes` and `deepseek`.
- 2026-07-18: `apps/api/src/__tests__/runtime-telemetry.test.ts` is a justified test-location extra because this repository uses colocated `src/__tests__` rather than the plan's generic `apps/api/test/**` path.
- 2026-07-18: The readiness command validates repository artifacts, cross-file metric/runbook markers, and Grafana JSON only. It deliberately does not claim a deployed collector, valid target-environment networking, Prometheus rule evaluation, alert delivery, dashboard access controls, retention, SLO calibration, or monitoring ownership.
- 2026-07-18: `scripts/production-readiness-check.sh` is a justified extra explicitly permitted by Milestone 4 recovery. It now exits nonzero on missing required artifacts instead of printing unconditional success.

## 15. Outcomes & Retrospective

- Status: Complete on 2026-07-18.
- Completed milestones: All five milestones completed in order.
- Validation summary: `sh scripts/production-readiness-check.sh` passed its explicitly structural artifact checks. Final `sh scripts/verify.sh` passed in 195.1s: install, lint, format, typecheck, unit/integration, build, 18 E2E tests, local security scan, dependency audit with no known vulnerabilities, and 8/8 smoke checks. Unit evidence included observability 4 files/17 tests, API 13 files/42 tests, domain 14 files/92 tests, and persistence 24 passed/1 explicitly opt-in live PostgreSQL test skipped.
- Changed files summary: Added structured logging/redaction, API logger and runtime telemetry helpers, health liveness/readiness/dependency services, in-memory/no-op metrics and tracing, tests, expanded smoke checks, OTel/Prometheus/alert/Grafana provisioning, ADR-0013, and operator/runbook documentation. Compatibility keeps the legacy health controller export. API package/lock metadata and the readiness script are justified extras recorded above.
- Remaining risks: No runtime OTLP exporter or metrics HTTP endpoint is wired; workers and AI gateway do not exist, so their signals remain contract/dashboard-ready only; health probes report configured/unconfigured state but do not connect to dependencies; Prometheus rule evaluation, collector/container startup, alert routing, Grafana data source/access/retention, monitoring ownership, and threshold calibration have not been proven. The production-readiness script is structural only, live PostgreSQL coverage is opt-in, and production readiness has not passed.
