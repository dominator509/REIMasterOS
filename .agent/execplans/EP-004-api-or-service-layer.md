# EP-004: API or Service Layer

## 1. Purpose / Big Picture

Implement the API/BFF/service boundary for core platform interaction: shared contracts, validated endpoints, error envelopes, authorization hooks, compliance checks, approval states, activity logging, webhooks, and async job boundaries.

## 2. Scope

- Shared API contracts.
- NestJS API modules/controllers/services by default.
- Request validation and response envelopes.
- Error mapping.
- Authorization/compliance/approval hooks.
- Activity/audit logging.
- Webhook and async job interfaces.
- Contract/integration tests.

## 3. Non-goals

- No full UI implementation.
- No live provider sends.
- No production auth secrets.
- No direct AI provider calls outside AI gateway interface.
- No arbitrary MCP tool exposure.
- No production deployment.

## 4. Context and Orientation

The API is Layer 2. It orchestrates domain, persistence, providers, and workers through interfaces. It must not hide compliance decisions or let model output determine compliance.

## 5. Files to Read First

- `AGENTS.md`
- `COMMANDS.md`
- `.agent/PLANS.md`
- `ARCHITECTURE.md`
- `SPEC-003-api-contracts.md`
- `SPEC-005-auth-and-permissions.md`
- `SPEC-006-error-handling.md`
- `TESTING.md`

## 6. Files to Change

Expected changed files/directories:

- `packages/contracts/src/**`
- `packages/contracts/package.json`
- `apps/api/src/**`
- `apps/api/test/**`
- `package.json`
- `.agent/execplans/EP-004-api-or-service-layer.md`
- `COMMANDS.md`
- `DECISIONS.md`

Do not change files outside this list unless repository evidence requires it. Any extra file must be recorded in the Decision Log with reason and validation.

## 7. Interfaces and Contracts

- API responses use standard envelope.
- Errors use taxonomy from SPEC-006.
- High-risk endpoints return compliance/approval states.
- Provider webhooks use signature verification interfaces.
- AI chat uses LLM gateway interface, not direct hosted calls.

## 8. Milestones

### Milestone 1: Define shared API contracts

- **Goal:** Create request/response schemas for core API workflows.
- **Files to read:** SPEC-003-api-contracts.md, SPEC-006-error-handling.md, packages/contracts
- **Files to change:** packages/contracts/src/api/**, packages/contracts/src/errors/**, packages/contracts/src/index.ts, packages/contracts/src/__tests__/**
- **Exact edits expected:** Add schemas for response envelope, errors, properties, lead lists, tasks, activities, compliance verdicts, approvals, provider health, AI chat shell, and imports.
- **Validation command:** `sh scripts/test-unit.sh`
- **Expected result:** Contract schema tests pass.
- **Recovery instruction:** If schema library differs, use existing validation library and update COMMANDS/DECISIONS if dependency changes.

### Milestone 2: Implement API module skeleton and validation

- **Goal:** Expose typed endpoints with request validation and standard errors.
- **Files to read:** apps/api, SPEC-003-api-contracts.md, SECURITY.md
- **Files to change:** apps/api/src/**, apps/api/test/**
- **Exact edits expected:** Create NestJS modules/controllers/services for health, properties, lead lists, tasks, activities, compliance check, approvals, imports, exports, provider health, and AI chat shell using contracts.
- **Validation command:** `sh scripts/test-integration.sh`
- **Expected result:** API integration tests pass with synthetic in-memory/test persistence where appropriate.
- **Recovery instruction:** If NestJS skeleton differs, adapt to actual framework but keep contracts stable.

### Milestone 3: Add authorization and compliance hooks

- **Goal:** Ensure API paths call RBAC/compliance/approval boundaries even before full auth is implemented.
- **Files to read:** SPEC-005-auth-and-permissions.md, SPEC-001-core-domain.md
- **Files to change:** apps/api/src/auth/**, apps/api/src/compliance/**, apps/api/src/campaigns/**, apps/api/test/**
- **Exact edits expected:** Add placeholder auth context for tests, RBAC guard interfaces, compliance gate invocation, approval-required response handling, and tests proving high-risk launch is blocked without prerequisites.
- **Validation command:** `sh scripts/test-integration.sh`
- **Expected result:** High-risk endpoint tests return `COMPLIANCE_BLOCKED` or `APPROVAL_REQUIRED`.
- **Recovery instruction:** If auth not implemented, use explicit test-only auth context and mark production guard TODO in Decision Log.

### Milestone 4: Add activity, webhooks, and async boundary

- **Goal:** Ensure side-effecting actions write activity/audit events and long work goes async.
- **Files to read:** ARCHITECTURE.md, OBSERVABILITY.md, SPEC-003-api-contracts.md
- **Files to change:** apps/api/src/activity/**, apps/api/src/webhooks/**, apps/api/src/jobs/**, apps/api/test/**
- **Exact edits expected:** Create activity event service, provider webhook router skeleton with signature-verification interface, job enqueue interface, and tests for activity creation.
- **Validation command:** `sh scripts/test-integration.sh`
- **Expected result:** Activity/audit and webhook contract tests pass without live providers.
- **Recovery instruction:** If queue service unavailable, implement interface plus in-memory test adapter and record later worker dependency.

### Milestone 5: Final API verification

- **Goal:** Confirm API contracts and service layer are stable and documented.
- **Files to read:** COMMANDS.md, TESTING.md
- **Files to change:** .agent/execplans/EP-004-api-or-service-layer.md, COMMANDS.md, DECISIONS.md
- **Exact edits expected:** Update progress/outcomes; update commands only if actual API scripts differ.
- **Validation command:** `sh scripts/verify.sh`
- **Expected result:** Full verification passes.
- **Recovery instruction:** If E2E/UI not implemented, run API relevant commands and record remaining out-of-scope validations.


## 9. Concrete Steps

### Milestone 1 Steps: Define shared API contracts

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-unit.sh`.
5. Record command output and update Progress before continuing.

### Milestone 2 Steps: Implement API module skeleton and validation

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 3 Steps: Add authorization and compliance hooks

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 4 Steps: Add activity, webhooks, and async boundary

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 5 Steps: Final API verification

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

- Shared contracts exist and are tested.
- API endpoints validate requests and return stable envelopes.
- High-risk actions are blocked/approval-gated.
- Activity/audit events are emitted for side effects.
- Webhooks and async job boundaries are test-backed.
- Contract/integration tests pass.

If a final validation command cannot run because this greenfield repository has not yet reached the required implementation phase, record the exact failure, complete the narrower milestone validations that are in scope, and stop only if `AGENTS.md` STOP conditions apply.

## 11. Idempotence and Recovery

API changes should be additive. If routes already exist, preserve stable contracts and add missing tests. Use in-memory adapters only for tests when persistence/workers are not fully ready.

General recovery:

- Inspect the exact error before editing.
- Apply the bounded retry rule in `AGENTS.md`.
- Prefer additive changes and deterministic fixtures.
- Never patch blindly around the same failure.
- If repository reality differs from this ExecPlan, choose the smallest safe change consistent with specs, record it, and continue.
- Stop only for STOP conditions in `AGENTS.md`.

## 12. Progress

Initial state: Not started. Requires EP-001 and benefits from EP-002/EP-003.

- [ ] Milestone 1: Define shared API contracts — validation `sh scripts/test-unit.sh` passed and result recorded.
- [ ] Milestone 2: Implement API module skeleton and validation — validation `sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 3: Add authorization and compliance hooks — validation `sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 4: Add activity, webhooks, and async boundary — validation `sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 5: Final API verification — validation `sh scripts/verify.sh` passed and result recorded.

## 13. Surprises & Discoveries

- 2026-07-07: API must use contract schemas; if a schema library is not yet selected, choose the smallest common TypeScript validation library and record it.

## 14. Decision Log

- 2026-07-07: Auth hooks may begin with test-safe placeholder context before EP-006 completes full auth.

## 15. Outcomes & Retrospective

- Status: Not started.
- Completed milestones: None yet.
- Validation summary: Not run yet.
- Changed files summary: Not reviewed yet.
- Remaining risks: Execute milestones and update this section before final response.
