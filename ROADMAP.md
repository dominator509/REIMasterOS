# Roadmap

**Do not implement directly from this file. Implementation must happen through an ExecPlan.**

This roadmap sequences work from greenfield discovery to production readiness. It is strategic, not executable. Coding agents must use `.agent/execplans/` for implementation.

## Phase 0: Repository Discovery and Foundation

Purpose:

- Confirm repository state.
- Establish command, package, documentation, and CI baseline.
- Confirm greenfield assumptions or detect deviations.

Dependencies:

- None.

Exit criteria:

- `EP-000-repository-discovery.md` complete if repository contains unknown files.
- `EP-001-foundation.md` complete.
- `COMMANDS.md`, `ARCHITECTURE.md`, and `ASSUMPTIONS.md` match actual repository state.
- Preflight, lint, format check, typecheck, baseline tests, build, and verify commands exist.

Linked specs:

- `SPEC-000-product-scope.md`

Linked ExecPlans:

- `EP-000-repository-discovery.md`
- `EP-001-foundation.md`

## Phase 1: Core Domain

Purpose:

- Implement pure business/domain logic for tenants, users, properties, owners, contacts, lead lists, activities, tasks, offers, negotiations, compliance verdicts, approval rules, provider ports, and cost-aware fallback rules.

Dependencies:

- Phase 0.

Exit criteria:

- Domain package exists and imports no outer layers.
- Unit tests cover core entities, value objects, compliance gates, deal math, approval decisions, and activity timeline events.
- No database, UI, provider SDK, or environment imports in domain.

Linked specs:

- `SPEC-001-core-domain.md`
- `SPEC-005-auth-and-permissions.md`
- `SPEC-006-error-handling.md`

Linked ExecPlans:

- `EP-002-core-domain.md`

## Phase 2: Data and Persistence

Purpose:

- Implement PostgreSQL/PostGIS schema, migrations, repositories, search projections, object-storage metadata, Redis queue/cache foundations, seed fixtures, and backup/restore considerations.

Dependencies:

- Phase 1.

Exit criteria:

- Migrations create tenant-scoped canonical records.
- Repository integration tests pass.
- Search projections are derived, rebuildable, and not authoritative.
- Raw ingestion payloads and object storage keys are tenant-scoped.
- Safe migration and rollback/restore process documented.

Linked specs:

- `SPEC-002-data-model.md`
- `SPEC-006-error-handling.md`

Linked ExecPlans:

- `EP-003-data-and-persistence.md`

## Phase 3: API or Service Layer

Purpose:

- Implement API/BFF boundaries, request validation, response contracts, authorization hooks, activity logging, async job publishing, and contract tests.

Dependencies:

- Phase 1 and Phase 2.

Exit criteria:

- Core CRM/property/list/task/activity endpoints exist.
- Compliance gate endpoint returns `allowed`, `blocked`, or `needs_approval`.
- Campaign launch paths recheck compliance.
- API tests cover validation, authorization hooks, tenant scope, error mapping, and activity audit.

Linked specs:

- `SPEC-003-api-contracts.md`
- `SPEC-006-error-handling.md`
- `SPEC-007-observability.md`

Linked ExecPlans:

- `EP-004-api-or-service-layer.md`

## Phase 4: UI or Client Layer

Purpose:

- Implement dashboard/PWA foundations: CRM/property views, lead lists, activity timeline, tasks/follow-ups, compliance blocks, approval states, AI chat shell, cost optimization center, and accessible UI states.

Dependencies:

- Phase 3.

Exit criteria:

- Primary UI flows pass E2E/acceptance tests.
- Loading, empty, error, blocked, needs-approval, and success states are visible and accessible.
- Map workflows have table/list alternatives.
- AI messages are sanitized before display.

Linked specs:

- `SPEC-004-ui-ux-behavior.md`
- `SPEC-005-auth-and-permissions.md`

Linked ExecPlans:

- `EP-005-user-interface-or-client.md`

## Phase 5: Auth, Permissions, and Security

Purpose:

- Implement built-in auth, tenant/user/team/RBAC model, 2FA gates for high-risk actions, secret handling, session/token policy, security headers, audit logs, and abuse prevention.

Dependencies:

- Phases 1-4.

Exit criteria:

- Users cannot access cross-tenant records.
- High-risk actions require required permissions and 2FA/approval.
- Secrets are not committed or logged.
- Security tests pass.
- Telegram/mobile linking and high-risk approvals are scoped and expiring when implemented.

Linked specs:

- `SPEC-005-auth-and-permissions.md`
- `SPEC-008-production-readiness.md`

Linked ExecPlans:

- `EP-006-auth-security-and-permissions.md`

## Phase 6: Testing Hardening

Purpose:

- Increase unit, integration, E2E, contract, compliance, prompt/cache/sanitizer, security, regression, and failure-mode coverage.

Dependencies:

- Phases 1-5.

Exit criteria:

- Critical workflows have tests.
- Compliance and AI-safety paths have regression tests.
- Test data cleanup is deterministic.
- CI validation is reliable.

Linked specs:

- All specs.

Linked ExecPlans:

- `EP-007-testing-hardening.md`

## Phase 7: Observability and Operations

Purpose:

- Add structured logs, redaction, metrics, traces, health checks, dashboards, alerts, runbooks, queue/provider/LLM/compliance telemetry, and operational smoke tests.

Dependencies:

- Phases 1-6.

Exit criteria:

- Health endpoints and smoke tests pass.
- Logs include required fields and redact secrets.
- Metrics cover API latency, errors, worker queues, provider health/cost, compliance verdicts, campaign throughput, search latency, voice latency, and LLM cache health.
- Runbooks cover common failures.

Linked specs:

- `SPEC-007-observability.md`
- `SPEC-008-production-readiness.md`

Linked ExecPlans:

- `EP-008-observability-and-operations.md`

## Phase 8: Deployment and Release

Purpose:

- Prepare Docker Compose profiles, Helm/Kubernetes profile, CI/CD, image builds, environment validation, release process, rollback path, and post-deploy smoke checks.

Dependencies:

- Phases 1-7.

Exit criteria:

- Solo/budget Compose profile runs locally.
- Production-like deployment manifests validate.
- CI builds/test/scans images.
- Release and rollback procedures are documented and dry-run.

Linked specs:

- `SPEC-008-production-readiness.md`

Linked ExecPlans:

- `EP-009-deployment-and-release.md`

## Phase 9: Production Readiness

Purpose:

- Verify functional, testing, security, privacy, performance, accessibility, observability, deployment, rollback, data, documentation, and support readiness.

Dependencies:

- Phases 1-8.

Exit criteria:

- `sh scripts/verify.sh` passes.
- `sh scripts/production-readiness-check.sh` passes.
- Production-readiness checklist passes or documented launch blockers remain.
- Launch gate has owner/date/risk decision.
- No critical compliance, security, data-loss, tenant-isolation, or hidden-prefix leakage risks remain unresolved.

Linked specs:

- `SPEC-008-production-readiness.md`

Linked ExecPlans:

- `EP-010-production-readiness.md`

## Production Readiness Milestone

Production readiness is reached only after Phase 9 exits successfully. A feature is not production-ready because it is coded; it is production-ready when it is validated, observable, secure, documented, deployable, rollback-ready, and compliant.
