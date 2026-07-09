# EP-003: Data and Persistence

## 1. Purpose / Big Picture

Implement the persistence layer for tenant-scoped authoritative records, migrations, repositories, search/storage/cache boundaries, integration tests, and backup/restore considerations.

## 2. Scope

- PostgreSQL/PostGIS migration foundation.
- Core canonical schema.
- Tenant-scoped repositories.
- Search projection, object storage, Redis cache/queue boundaries.
- Synthetic integration tests.
- Backup/restore documentation.

## 3. Non-goals

- No UI.
- No external paid provider calls.
- No raw DNC dashboard data.
- No production migrations.
- No search engine as source of truth.
- No graph database requirement in initial release.

## 4. Context and Orientation

Persistence is Layer 4. It implements storage for domain/application use but must not invent business policy. PostgreSQL/PostGIS is authoritative; search and token-compressed data are derived.

## 5. Files to Read First

- `AGENTS.md`
- `COMMANDS.md`
- `.agent/PLANS.md`
- `ARCHITECTURE.md`
- `SPEC-002-data-model.md`
- `SECURITY.md`
- `ENVIRONMENT.md`
- `OPERATIONS.md`

## 6. Files to Change

Expected changed files/directories:

- `packages/persistence/**`
- `db/migrations/**`
- `infra/compose/solo-budget.yml`
- `package.json`
- `ENVIRONMENT.md`
- `OPERATIONS.md`
- `DEPLOYMENT.md`
- `.agent/execplans/EP-003-data-and-persistence.md`
- `DECISIONS.md`

Do not change files outside this list unless repository evidence requires it. Any extra file must be recorded in the Decision Log with reason and validation.

## 7. Interfaces and Contracts

- Repository methods must accept tenant context.
- Migrations must be versioned under `db/migrations/`.
- Search/storage/cache implementations must be behind interfaces.
- Raw sensitive data must not appear in fixtures/logs.

## 8. Milestones

### Milestone 1: Create persistence package and migration tooling

- **Goal:** Add database/migration foundation for PostgreSQL/PostGIS authoritative data.
- **Files to read:** SPEC-002-data-model.md, ARCHITECTURE.md, ENVIRONMENT.md
- **Files to change:** packages/persistence/**, db/migrations/**, infra/compose/solo-budget.yml, package.json
- **Exact edits expected:** Create persistence package, migration command integration, local Postgres/PostGIS Compose service, and first migration skeleton.
- **Validation command:** `sh scripts/test-integration.sh`
- **Expected result:** Integration harness can connect to local/test database or clearly skip only when DB profile is not started per docs.
- **Recovery instruction:** If DB tooling is missing, add the smallest supported migration tool and document dependency decision.

### Milestone 2: Implement initial canonical schema

- **Goal:** Create tenant-scoped tables for core CRM/property/activity/compliance records.
- **Files to read:** SPEC-002-data-model.md, packages/domain/src/index.ts
- **Files to change:** db/migrations/**, packages/persistence/src/schema/**
- **Exact edits expected:** Add migrations for tenants, users, properties, owners, contacts, contact_points, lead_lists, tasks, activity_events, compliance_verdicts, approval_requests, offers, provider_credentials, object_artifacts with constraints/indexes.
- **Validation command:** `sh scripts/test-integration.sh`
- **Expected result:** Migration test applies schema from empty DB and constraints exist.
- **Recovery instruction:** If full schema is too large for one migration, split by milestone but keep table names consistent.

### Milestone 3: Implement repositories with tenant isolation

- **Goal:** Provide repository implementations for initial canonical records.
- **Files to read:** SPEC-002-data-model.md, SECURITY.md, packages/domain/src
- **Files to change:** packages/persistence/src/repositories/**, packages/persistence/src/__tests__/**
- **Exact edits expected:** Implement tenant-scoped repository methods for properties, owners, contacts, lead lists, tasks, activity events, compliance verdicts, approvals, and provider credential metadata; add cross-tenant denial tests.
- **Validation command:** `sh scripts/test-integration.sh`
- **Expected result:** Repository integration tests pass and prove cross-tenant access denied.
- **Recovery instruction:** If ORM/query builder differs, adapt to actual tool and record decision.

### Milestone 4: Add search/storage/cache projection boundaries

- **Goal:** Create interfaces and minimal test-backed stubs for OpenSearch, object storage, and Redis as projections/ephemeral state.
- **Files to read:** ARCHITECTURE.md, OBSERVABILITY.md, SPEC-002-data-model.md
- **Files to change:** packages/persistence/src/search/**, packages/persistence/src/storage/**, packages/persistence/src/cache/**, infra/compose/solo-budget.yml, packages/persistence/src/__tests__/**
- **Exact edits expected:** Add projection interfaces, tenant-scoped object artifact key builder, Redis cache/queue placeholders, and tests proving search is derived/non-authoritative.
- **Validation command:** `sh scripts/test-integration.sh`
- **Expected result:** Projection/storage/cache tests pass without live paid services.
- **Recovery instruction:** If OpenSearch unavailable, keep interface and local disabled adapter but document start command requirements.

### Milestone 5: Document backup/restore and final persistence review

- **Goal:** Ensure data safety and docs are updated.
- **Files to read:** OPERATIONS.md, PRODUCTION_READINESS.md
- **Files to change:** OPERATIONS.md, DEPLOYMENT.md, .agent/execplans/EP-003-data-and-persistence.md, DECISIONS.md
- **Exact edits expected:** Document migration, backup, restore, projection rebuild assumptions; update ExecPlan progress/outcomes.
- **Validation command:** `sh scripts/verify.sh`
- **Expected result:** Full verification passes.
- **Recovery instruction:** If full verify fails due UI/auth not implemented yet, run integration validation and record out-of-scope gaps.


## 9. Concrete Steps

### Milestone 1 Steps: Create persistence package and migration tooling

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 2 Steps: Implement initial canonical schema

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 3 Steps: Implement repositories with tenant isolation

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 4 Steps: Add search/storage/cache projection boundaries

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 5 Steps: Document backup/restore and final persistence review

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

- Migrations apply on empty local/test DB.
- Core tenant-scoped schema exists.
- Repositories enforce tenant isolation.
- Search/storage/cache boundaries exist and are test-backed.
- Backup/restore considerations documented.
- Integration tests pass.

If a final validation command cannot run because this greenfield repository has not yet reached the required implementation phase, record the exact failure, complete the narrower milestone validations that are in scope, and stop only if `AGENTS.md` STOP conditions apply.

## 11. Idempotence and Recovery

Migrations should be additive and deterministic. Repositories should use synthetic fixtures. If rerun, migrations should report already-applied state according to tooling.

General recovery:

- Inspect the exact error before editing.
- Apply the bounded retry rule in `AGENTS.md`.
- Prefer additive changes and deterministic fixtures.
- Never patch blindly around the same failure.
- If repository reality differs from this ExecPlan, choose the smallest safe change consistent with specs, record it, and continue.
- Stop only for STOP conditions in `AGENTS.md`.

## 12. Progress

Initial state: Not started. Requires EP-001 foundation and EP-002 domain or equivalent existing packages.

- [ ] Milestone 1: Create persistence package and migration tooling — validation `sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 2: Implement initial canonical schema — validation `sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 3: Implement repositories with tenant isolation — validation `sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 4: Add search/storage/cache projection boundaries — validation `sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 5: Document backup/restore and final persistence review — validation `sh scripts/verify.sh` passed and result recorded.

## 13. Surprises & Discoveries

- 2026-07-07: Initial schema may implement a core subset but must not use names that conflict with full SPEC-002 path.

## 14. Decision Log

- 2026-07-07: Production migration remains STOP condition without explicit permission.

## 15. Outcomes & Retrospective

- Status: Not started.
- Completed milestones: None yet.
- Validation summary: Not run yet.
- Changed files summary: Not reviewed yet.
- Remaining risks: Execute milestones and update this section before final response.
