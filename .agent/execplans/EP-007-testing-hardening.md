# EP-007: Testing Hardening

## 1. Purpose / Big Picture

Harden test coverage, reliability, regression protection, provider contracts, compliance paths, tenant isolation, AI prompt/cache/sanitizer behavior, and CI validation.

## 2. Scope

- Coverage audit.
- Compliance regression tests.
- Tenant isolation tests.
- AI prompt/cache/sanitizer tests.
- Provider contract tests.
- Worker/API/UI failure-mode tests where applicable.
- CI reliability updates.

## 3. Non-goals

- No new product features outside tests unless required to make critical tests pass.
- No live paid provider tests in default CI.
- No production data.
- No broad rewrites.
- No lowering validation quality to pass.

## 4. Context and Orientation

Testing hardening comes after core layers exist. The goal is to reduce regression risk and make production readiness credible.

## 5. Files to Read First

- `AGENTS.md`
- `COMMANDS.md`
- `.agent/PLANS.md`
- `TESTING.md`
- `SECURITY.md`
- `ARCHITECTURE.md`
- `.agent/specs/SPEC-001-core-domain.md`
- `.agent/specs/SPEC-005-auth-and-permissions.md`
- `.agent/specs/SPEC-007-observability.md`

## 6. Files to Change

Expected changed files/directories:

- `packages/**/__tests__/**`
- `apps/**/test/**`
- `apps/web/tests/**`
- `services/**/tests/**`
- `workers/**/test/**`
- `packages/adapters/tests/**`
- `.github/workflows/ci.yml`
- `TESTING.md`
- `.agent/execplans/EP-007-testing-hardening.md`
- `DECISIONS.md`

Do not change files outside this list unless repository evidence requires it. Any extra file must be recorded in the Decision Log with reason and validation.

## 7. Interfaces and Contracts

- Tests must use synthetic fixtures.
- Provider tests use mocks/local fakes.
- Critical compliance/security tests must not be skipped.
- CI commands must call scripts in `COMMANDS.md`.

## 8. Milestones

### Milestone 1: Audit coverage and classify gaps

- **Goal:** Map existing tests to specs and identify critical gaps.
- **Files to read:** TESTING.md, .agent/specs, packages, apps, services, workers
- **Files to change:** .agent/execplans/EP-007-testing-hardening.md, TESTING.md
- **Exact edits expected:** Record coverage gaps by domain, persistence, API, UI, auth, compliance, AI, providers, observability, deployment.
- **Validation command:** `sh scripts/verify.sh`
- **Expected result:** Verification status and failing/missing areas are documented.
- **Recovery instruction:** If verify cannot run, run each available narrower command and record missing scripts.

### Milestone 2: Add compliance and tenant-isolation regression tests

- **Goal:** Prevent critical compliance/security regressions.
- **Files to read:** SECURITY.md, SPEC-005-auth-and-permissions.md, SPEC-001-core-domain.md
- **Files to change:** packages/domain/src/__tests__/**, apps/api/test/**, packages/persistence/src/__tests__/**
- **Exact edits expected:** Add tests for DNC suppression-only, opt-out/unsubscribe/consent/quiet hours, high-risk approvals, worker recheck, and cross-tenant denial.
- **Validation command:** `sh scripts/test-unit.sh && sh scripts/test-integration.sh`
- **Expected result:** Regression tests pass.
- **Recovery instruction:** If a missing implementation blocks a test, add pending/failing test only if plan permits or implement smallest in-scope fix.

### Milestone 3: Add AI prompt/cache/sanitizer regression tests

- **Goal:** Protect hidden prefixes, deterministic prompt compilation, and cache telemetry.
- **Files to read:** OBSERVABILITY.md, SECURITY.md, ARCHITECTURE.md
- **Files to change:** services/ai-gateway/tests/**, packages/domain/src/__tests__/**, packages/contracts/src/**
- **Exact edits expected:** Add tests for stable prefix >=64 tokens where eligible, prefix hash/version, hidden-prefix stripping, streaming sanitizer, DeepSeek/Hermes metric separation, and cache drift fixtures.
- **Validation command:** `sh scripts/test-unit.sh && sh scripts/test-integration.sh`
- **Expected result:** AI safety/cache tests pass or clear disabled-state tests pass if gateway not implemented.
- **Recovery instruction:** If AI gateway absent, create contract-level tests/stubs in packages and record gateway dependency.

### Milestone 4: Add provider contract and failure-mode tests

- **Goal:** Ensure adapters are swappable and safe.
- **Files to read:** ARCHITECTURE.md, SPEC-003-api-contracts.md, TESTING.md
- **Files to change:** packages/adapters/tests/**, apps/api/test/**, workers/**/test/**
- **Exact edits expected:** Add mocked contract tests for email, direct mail, voice, SMS disabled mode, property data CSV, DNC vendor interface, and webhook errors.
- **Validation command:** `sh scripts/test-integration.sh`
- **Expected result:** Provider contract tests pass without live providers.
- **Recovery instruction:** If adapter package absent, create tests for provider interfaces or document dependency on later adapter implementation.

### Milestone 5: Stabilize CI validation and final review

- **Goal:** Make test suite reliable and update docs.
- **Files to read:** .github/workflows/ci.yml, COMMANDS.md
- **Files to change:** .github/workflows/ci.yml, TESTING.md, .agent/execplans/EP-007-testing-hardening.md
- **Exact edits expected:** Ensure CI runs required commands; document flaky test policy and final validation results.
- **Validation command:** `sh scripts/verify.sh`
- **Expected result:** Full verification passes reliably.
- **Recovery instruction:** If a test is flaky, isolate, fix determinism, or quarantine only with Decision Log entry and risk.


## 9. Concrete Steps

### Milestone 1 Steps: Audit coverage and classify gaps

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/verify.sh`.
5. Record command output and update Progress before continuing.

### Milestone 2 Steps: Add compliance and tenant-isolation regression tests

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-unit.sh && sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 3 Steps: Add AI prompt/cache/sanitizer regression tests

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-unit.sh && sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 4 Steps: Add provider contract and failure-mode tests

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 5 Steps: Stabilize CI validation and final review

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

- Critical specs have test coverage.
- Compliance and tenant isolation regressions covered.
- AI hidden-prefix/cache behavior covered.
- Provider contracts/failure modes covered without live services.
- CI validation is reliable.
- Full verification passes or documented blockers remain with STOP condition.

If a final validation command cannot run because this greenfield repository has not yet reached the required implementation phase, record the exact failure, complete the narrower milestone validations that are in scope, and stop only if `AGENTS.md` STOP conditions apply.

## 11. Idempotence and Recovery

Tests should be deterministic and safe to rerun. Clean up test data. Avoid brittle snapshots for user-visible text except where intentional.

General recovery:

- Inspect the exact error before editing.
- Apply the bounded retry rule in `AGENTS.md`.
- Prefer additive changes and deterministic fixtures.
- Never patch blindly around the same failure.
- If repository reality differs from this ExecPlan, choose the smallest safe change consistent with specs, record it, and continue.
- Stop only for STOP conditions in `AGENTS.md`.

## 12. Progress

Initial state: Not started. Requires implemented layers to test; can add contract/stub tests for planned boundaries.

- [ ] Milestone 1: Audit coverage and classify gaps — validation `sh scripts/verify.sh` passed and result recorded.
- [ ] Milestone 2: Add compliance and tenant-isolation regression tests — validation `sh scripts/test-unit.sh && sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 3: Add AI prompt/cache/sanitizer regression tests — validation `sh scripts/test-unit.sh && sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 4: Add provider contract and failure-mode tests — validation `sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 5: Stabilize CI validation and final review — validation `sh scripts/verify.sh` passed and result recorded.

## 13. Surprises & Discoveries

- 2026-07-07: Default CI must not call live providers.

## 14. Decision Log

- 2026-07-07: Hidden-prefix leakage and compliance bypass tests are production-readiness blockers.

## 15. Outcomes & Retrospective

- Status: Not started.
- Completed milestones: None yet.
- Validation summary: Not run yet.
- Changed files summary: Not reviewed yet.
- Remaining risks: Execute milestones and update this section before final response.
