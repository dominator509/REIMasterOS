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
- **Files to change:** packages/domain/src/**tests**/**, apps/api/test/**, packages/persistence/src/**tests**/**
- **Exact edits expected:** Add tests for DNC suppression-only, opt-out/unsubscribe/consent/quiet hours, high-risk approvals, worker recheck, and cross-tenant denial.
- **Validation command:** `sh scripts/test-unit.sh && sh scripts/test-integration.sh`
- **Expected result:** Regression tests pass.
- **Recovery instruction:** If a missing implementation blocks a test, add pending/failing test only if plan permits or implement smallest in-scope fix.

### Milestone 3: Add AI prompt/cache/sanitizer regression tests

- **Goal:** Protect hidden prefixes, deterministic prompt compilation, and cache telemetry.
- **Files to read:** OBSERVABILITY.md, SECURITY.md, ARCHITECTURE.md
- **Files to change:** services/ai-gateway/tests/**, packages/domain/src/**tests**/**, packages/contracts/src/**
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

- [x] Milestone 1: Audit coverage and classify gaps — source-to-spec matrix recorded in `TESTING.md`; after fixing the single reported Markdown formatting issue, `sh scripts/verify.sh` passed on 2026-07-18 in 165.1s.
- [x] Milestone 2: Add compliance and tenant-isolation regression tests — `sh scripts/test-unit.sh` passed with domain 92 tests and API 33 tests; `sh scripts/test-integration.sh` passed with API 10 files/33 tests and persistence 24 passed/1 explicit opt-in live test skipped on 2026-07-18.
- [x] Milestone 3: Add AI prompt/cache/sanitizer regression tests — `sh scripts/test-unit.sh` passed with API 11 files/37 tests and observability 2 files/11 tests; `sh scripts/test-integration.sh` passed with API 11 files/37 tests and persistence 24 passed/1 opt-in live test skipped on 2026-07-18.
- [x] Milestone 4: Add provider contract and failure-mode tests — `sh scripts/test-integration.sh` passed on 2026-07-18 with adapters 1 file/6 synthetic contract tests, API 11 files/37 tests, and persistence 24 passed/1 opt-in live test skipped.
- [x] Milestone 5: Stabilize CI validation and final review — CI now calls the documented full verifier for `main` and `master`; E2E, security, dependency audit, and smoke are blocking; unit/integration/E2E tests execute uncached. After a type-safe adapter-fixture correction, `sh scripts/verify.sh` passed twice on 2026-07-18, with the final independent no-cache run completing in 101.3s.

## 13. Surprises & Discoveries

- 2026-07-07: Default CI must not call live providers.
- 2026-07-18: The repository has no `services/`, `workers/`, or `packages/adapters` implementation. AI, worker, and provider hardening must therefore use contract-level package/API seams until later ExecPlans create those runtimes.
- 2026-07-18: CI runs package scripts directly, omits E2E and the local security scan, and makes dependency audit and smoke failures non-blocking. This conflicts with `COMMANDS.md` and is routed to Milestone 5.
- 2026-07-18: The first Milestone 1 verify stopped only because the new `TESTING.md` table needed Prettier formatting; formatting that file and rerunning the same command produced a full green result.
- 2026-07-18: Coverage hardening exposed that voice with call consent and recording setup could be marked `allowed` even when recording consent itself was false. Adding the missing `call_recording_consent` approval requirement closes that bypass.
- 2026-07-18: No worker runtime exists, and queued campaign jobs intentionally contain identifiers rather than stale policy truth. A small future-worker policy seam now requires current permission and reloads current compliance facts immediately before a side effect.
- 2026-07-18: The AI gateway is still disabled, so regression protection is implemented as pure contract seams: cache-eligible prefixes require an estimated 64 tokens, hash/version drift is deterministic, streaming output remains fully buffered until sanitization, and telemetry rejects raw prefix identifiers while separating Hermes from DeepSeek.
- 2026-07-18: `packages/adapters` was absent. The minimal workspace package now defines provider-neutral ports and synthetic contract tests for email/manual fallback, tenant-scoped direct mail, manual voice, disabled SMS, property CSV preview, suppression-only DNC verdicts, and webhook validation without any SDK or network dependency.
- 2026-07-18: Adding type checking to the same blocking path exposed a concrete test-contract defect that Vitest transpilation had not: `DisabledSmsAdapter.sendSms` implemented a zero-argument concrete signature even though the port accepts context and input. The implementation now validates both without enabling SMS.
- 2026-07-18: Turbo declared `coverage/**` and `test-results/**` outputs that the current unit and E2E suites never produce. This emitted warnings and allowed those verification tasks to be cached; all test tiers now execute uncached so the full verifier cannot replay stale test success.

## 14. Decision Log

- 2026-07-07: Hidden-prefix leakage and compliance bypass tests are production-readiness blockers.
- 2026-07-18: Treat the coverage inventory as a source-to-spec map, not a numeric coverage claim; no coverage reporter is configured.
- 2026-07-18: `apps/api/src/campaigns/campaign-worker-policy.ts` and the one-line domain compliance fix are justified production-file extras because critical regression tests exposed missing policy behavior; the seam performs no provider call or live side effect.
- 2026-07-18: `apps/api/src/ai/prompt-safety.ts` and `packages/observability/src/ai-cache-telemetry.ts` are justified contract-stub extras because the planned `services/ai-gateway` does not exist. They remain provider-independent and do not enable AI routing.
- 2026-07-18: Creating `packages/adapters` required the standard workspace manifest, TypeScript config, Vitest config, source index/contracts, and lockfile importer. These framework-convention extras are justified by the ExecPlan's explicit adapter-contract recovery path.
- 2026-07-18: `scripts/verify.sh` and `turbo.json` are justified extras because the documented full verifier omitted E2E and the test tasks could replay cached results. CI now has one authoritative blocking wrapper path, while build/static-analysis caching remains enabled.
- 2026-07-18: `packages/observability/src/__tests__/redaction.test.ts` is a justified test-file edit that removes the last two explicit `any` assertions without weakening recursive-redaction checks.

## 15. Outcomes & Retrospective

- Status: Complete on 2026-07-18.
- Completed milestones: All five milestones completed in order.
- Validation summary: Final `sh scripts/verify.sh` passed in 101.3s with frozen install; lint and formatting; type checking across nine packages; domain 92, API 37, adapters 6, observability 11, contracts 13, config 11, persistence 24, and web unit tests green; one live PostgreSQL test remained explicitly opt-in; 18 E2E acceptance tests passed; build, local security scan, dependency audit with no known vulnerabilities, and 4/4 smoke checks passed. A preceding full run also passed in 324.1s after fixing the adapter signature exposed by the first full attempt.
- Changed files summary: Test and contract changes cover domain compliance, persistence isolation, API worker/AI/security/provider failures, UI acceptance, observability cache telemetry, and the new provider-neutral adapters package. CI, testing policy, verifier sequencing, Turbo cache policy, lockfile/workspace metadata, and this ExecPlan were updated. Production-file extras are limited to the compliance bug fix and contract-only seams documented above.
- Remaining risks: The live PostgreSQL isolation test is opt-in; E2E is server-rendered acceptance rather than browser automation; AI, worker, and live provider runtimes remain disabled/absent; built-in auth remains non-durable and not wired through a browser login; hosted GitHub Actions has not run because this local checkout has no configured remote. Next ExecPlans own runtime observability, deployment, performance, and release readiness.
