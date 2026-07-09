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

- [ ] Milestone 1: Add structured logging and redaction — validation `sh scripts/test-unit.sh && sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 2: Add health checks and smoke coverage — validation `sh scripts/smoke-test.sh` passed and result recorded.
- [ ] Milestone 3: Add metrics and trace instrumentation — validation `sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 4: Add dashboards, alerts, and runbooks — validation `sh scripts/production-readiness-check.sh` passed and result recorded.
- [ ] Milestone 5: Final observability review — validation `sh scripts/verify.sh` passed and result recorded.

## 13. Surprises & Discoveries

- 2026-07-07: Self-hosted observability is default; commercial observability adapters are optional.

## 14. Decision Log

- 2026-07-07: LLM cache and hidden-prefix metrics must not log prompt text.

## 15. Outcomes & Retrospective

- Status: Not started.
- Completed milestones: None yet.
- Validation summary: Not run yet.
- Changed files summary: Not reviewed yet.
- Remaining risks: Execute milestones and update this section before final response.
