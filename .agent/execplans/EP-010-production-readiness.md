# EP-010: Production Readiness

## 1. Purpose / Big Picture

Bring the system to production readiness by verifying functional completeness, tests, security, privacy, performance, accessibility, observability, deployment, rollback, backups, documentation, support, and launch gate status.

## 2. Scope

- Full verification.
- Production-readiness check.
- Security/privacy review.
- Performance/accessibility/observability review.
- Backup/restore verification.
- Deployment dry run and rollback drill evidence.
- Documentation review.
- Launch gate report.

## 3. Non-goals

- No production deployment without explicit permission.
- No irreversible migration.
- No live outreach/campaign launch.
- No legal/compliance judgment beyond documented policy.
- No sweeping feature implementation; create follow-up ExecPlans for large gaps.

## 4. Context and Orientation

This is the final readiness gate. It validates the product against `PRODUCTION_READINESS.md` and `SPEC-008`. It may identify blockers but should not hide or bypass them.

## 5. Files to Read First

- `AGENTS.md`
- `COMMANDS.md`
- `.agent/PLANS.md`
- `PRODUCTION_READINESS.md`
- `SPEC-008-production-readiness.md`
- `SECURITY.md`
- `OBSERVABILITY.md`
- `DEPLOYMENT.md`
- `OPERATIONS.md`
- `RELEASE.md`
- `ROLLBACK.md`
- `TESTING.md`

## 6. Files to Change

Expected changed files/directories:

- `PRODUCTION_READINESS.md`
- `SECURITY.md`
- `OBSERVABILITY.md`
- `DEPLOYMENT.md`
- `OPERATIONS.md`
- `RELEASE.md`
- `ROLLBACK.md`
- `TESTING.md`
- `.agent/execplans/EP-010-production-readiness.md`
- `DECISIONS.md`

Do not change files outside this list unless repository evidence requires it. Any extra file must be recorded in the Decision Log with reason and validation.

## 7. Interfaces and Contracts

- Readiness status must be evidence-based.
- Critical issues become launch blockers.
- Accepted risks require owner/date/mitigation.
- Production deploy is not performed by this plan unless separately and explicitly authorized.

## 8. Milestones

### Milestone 1: Run full verification and classify failures

- **Goal:** Establish current release readiness evidence.
- **Files to read:** PRODUCTION_READINESS.md, COMMANDS.md, .agent/checklists/production-readiness.md
- **Files to change:** .agent/execplans/EP-010-production-readiness.md
- **Exact edits expected:** Run required commands; record exact outputs, failures, and owners for unresolved blockers.
- **Validation command:** `sh scripts/verify.sh`
- **Expected result:** Full verification prints `verify: ok` or failures are documented with bounded retry evidence.
- **Recovery instruction:** Apply bounded retry; if failure is outside safe scope, record blocker and continue readiness audit if safe.

### Milestone 2: Complete security and privacy review

- **Goal:** Verify secrets, tenant isolation, DNC, hosted AI, hidden-prefix, retention, and provider credential protections.
- **Files to read:** SECURITY.md, ENVIRONMENT.md, SPEC-008-production-readiness.md
- **Files to change:** SECURITY.md, PRODUCTION_READINESS.md, .agent/execplans/EP-010-production-readiness.md
- **Exact edits expected:** Run scans, review configs/tests, update docs with findings and accepted risks.
- **Validation command:** `sh scripts/security-check.sh && sh scripts/dependency-audit.sh`
- **Expected result:** Security/audit scripts pass or documented accepted findings exist.
- **Recovery instruction:** Critical findings are STOP conditions unless safe fix exists in scope.

### Milestone 3: Complete performance, accessibility, and observability review

- **Goal:** Verify critical SLOs/checks are implemented or documented with blockers.
- **Files to read:** OBSERVABILITY.md, TESTING.md, PRODUCTION_READINESS.md
- **Files to change:** OBSERVABILITY.md, TESTING.md, PRODUCTION_READINESS.md, .agent/execplans/EP-010-production-readiness.md
- **Exact edits expected:** Review metrics/dashboards/alerts, cache SLO evidence, accessibility checks, search/worker/voice performance expectations.
- **Validation command:** `sh scripts/production-readiness-check.sh`
- **Expected result:** Readiness check passes or reports exact missing readiness items.
- **Recovery instruction:** If readiness script lacks a check, add the check only if evidence can be machine-verified; otherwise document manual gate.

### Milestone 4: Verify backup/restore, deployment dry run, and rollback drill

- **Goal:** Ensure operational safety before launch.
- **Files to read:** DEPLOYMENT.md, OPERATIONS.md, ROLLBACK.md, RELEASE.md
- **Files to change:** DEPLOYMENT.md, OPERATIONS.md, ROLLBACK.md, RELEASE.md, .agent/execplans/EP-010-production-readiness.md
- **Exact edits expected:** Record staging/local dry-run evidence, backup/restore evidence, rollback drill results, and any blockers.
- **Validation command:** `sh scripts/smoke-test.sh`
- **Expected result:** Smoke test passes against target environment without live outreach.
- **Recovery instruction:** Production deployment/migration requires explicit permission; if absent, record as launch gate blocker, not failure.

### Milestone 5: Final launch gate and retrospective

- **Goal:** Produce go/no-go readiness status.
- **Files to read:** PRODUCTION_READINESS.md, .agent/checklists/final-review.md
- **Files to change:** PRODUCTION_READINESS.md, .agent/execplans/EP-010-production-readiness.md, DECISIONS.md
- **Exact edits expected:** Update checklist status, accepted risks, launch blockers, final diff, and outcomes; do not deploy production.
- **Validation command:** `git diff --name-only`
- **Expected result:** Diff contains readiness docs/plan updates and no secrets or production data.
- **Recovery instruction:** If unexpected files changed, justify or revert before final report.


## 9. Concrete Steps

### Milestone 1 Steps: Run full verification and classify failures

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/verify.sh`.
5. Record command output and update Progress before continuing.

### Milestone 2 Steps: Complete security and privacy review

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/security-check.sh && sh scripts/dependency-audit.sh`.
5. Record command output and update Progress before continuing.

### Milestone 3 Steps: Complete performance, accessibility, and observability review

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/production-readiness-check.sh`.
5. Record command output and update Progress before continuing.

### Milestone 4 Steps: Verify backup/restore, deployment dry run, and rollback drill

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/smoke-test.sh`.
5. Record command output and update Progress before continuing.

### Milestone 5 Steps: Final launch gate and retrospective

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `git diff --name-only`.
5. Record command output and update Progress before continuing.


## 10. Validation and Acceptance

Required final validation:

```sh
sh scripts/verify.sh
```

Acceptance criteria:

- Full verification status recorded.
- Security/privacy review complete.
- Performance/accessibility/observability review complete.
- Backup/restore/deployment/rollback evidence recorded.
- Launch gate status is clear.
- No production deployment or irreversible migration performed without permission.

If a final validation command cannot run because this greenfield repository has not yet reached the required implementation phase, record the exact failure, complete the narrower milestone validations that are in scope, and stop only if `AGENTS.md` STOP conditions apply.

## 11. Idempotence and Recovery

Readiness review is repeatable. Re-run checks after fixes. Do not mark readiness complete without evidence.

General recovery:

- Inspect the exact error before editing.
- Apply the bounded retry rule in `AGENTS.md`.
- Prefer additive changes and deterministic fixtures.
- Never patch blindly around the same failure.
- If repository reality differs from this ExecPlan, choose the smallest safe change consistent with specs, record it, and continue.
- Stop only for STOP conditions in `AGENTS.md`.

## 12. Progress

Initial state: Not started. Execute after release-scope implementation plans are complete.

- [ ] Milestone 1: Run full verification and classify failures — validation `sh scripts/verify.sh` passed and result recorded.
- [ ] Milestone 2: Complete security and privacy review — validation `sh scripts/security-check.sh && sh scripts/dependency-audit.sh` passed and result recorded.
- [ ] Milestone 3: Complete performance, accessibility, and observability review — validation `sh scripts/production-readiness-check.sh` passed and result recorded.
- [ ] Milestone 4: Verify backup/restore, deployment dry run, and rollback drill — validation `sh scripts/smoke-test.sh` passed and result recorded.
- [ ] Milestone 5: Final launch gate and retrospective — validation `git diff --name-only` passed and result recorded.

## 13. Surprises & Discoveries

- 2026-07-07: In a greenfield blueprint-only repository, this plan will identify many blockers; create follow-up ExecPlans rather than guessing.

## 14. Decision Log

- 2026-07-07: Production deployment requires explicit permission and is not included by default.

## 15. Outcomes & Retrospective

- Status: Not started.
- Completed milestones: None yet.
- Validation summary: Not run yet.
- Changed files summary: Not reviewed yet.
- Remaining risks: Execute milestones and update this section before final response.
