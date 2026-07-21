# EP-006: Auth, Security, and Permissions

## 1. Purpose / Big Picture

Implement authentication, authorization, permissions, tenant isolation, high-risk approval/2FA gates, secure configuration, security headers, redaction, audit logging, and abuse-prevention baseline.

## 2. Scope

- Built-in auth/session foundation.
- Typed auth/security environment validation.
- RBAC and tenant isolation.
- Approval/2FA step-up for high-risk actions.
- Telegram/mobile linking security interface where applicable.
- Security headers/rate-limit interfaces.
- Audit/redaction tests.
- Security docs updates.

## 3. Non-goals

- No mandatory Auth0/Okta/WorkOS dependency.
- No live external SSO setup.
- No live Telegram linking unless safe test adapter exists.
- No production secrets.
- No bypass of compliance gates.
- No raw DNC access.

## 4. Context and Orientation

Security spans all layers. Auth/RBAC must be enforced at API, worker, MCP, Telegram/mobile, and provider boundaries. AI tools cannot exceed user/session permissions.

## 5. Files to Read First

- `AGENTS.md`
- `COMMANDS.md`
- `.agent/PLANS.md`
- `SECURITY.md`
- `SPEC-005-auth-and-permissions.md`
- `ENVIRONMENT.md`
- `ARCHITECTURE.md`
- `OBSERVABILITY.md`

## 6. Files to Change

Expected changed files/directories:

- `packages/config/src/**`
- `packages/domain/src/permissions/**`
- `apps/api/src/auth/**`
- `apps/api/src/security/**`
- `apps/api/src/audit/**`
- `apps/api/src/approvals/**`
- `apps/web/src/auth/**`
- `apps/web/src/features/approvals/**`
- `apps/api/test/**`
- `apps/web/tests/**`
- `.env.example`
- `SECURITY.md`
- `ENVIRONMENT.md`
- `OBSERVABILITY.md`
- `.agent/execplans/EP-006-auth-security-and-permissions.md`
- `DECISIONS.md`

Do not change files outside this list unless repository evidence requires it. Any extra file must be recorded in the Decision Log with reason and validation.

## 7. Interfaces and Contracts

- Permissions use constants shared by contracts/domain.
- API guards enforce tenant context and permission.
- High-risk actions call approval/2FA policy.
- Secrets come from typed config only.
- Logs/audits redact sensitive data.

## 8. Milestones

### Milestone 1: Implement auth configuration and session foundation

- **Goal:** Add built-in auth baseline with secure config validation.
- **Files to read:** SPEC-005-auth-and-permissions.md, SECURITY.md, ENVIRONMENT.md
- **Files to change:** packages/config/src/**, apps/api/src/auth/**, apps/web/src/auth/**, .env.example
- **Exact edits expected:** Add typed env validation for auth/session/encryption; implement built-in session skeleton and secure cookie/header settings.
- **Validation command:** `sh scripts/test-integration.sh`
- **Expected result:** Auth config/session tests pass.
- **Recovery instruction:** If auth library selection is required, choose smallest reversible built-in-compatible option and record ADR.

### Milestone 2: Implement RBAC and tenant isolation enforcement

- **Goal:** Enforce deny-by-default permissions across API and repositories.
- **Files to read:** SPEC-005-auth-and-permissions.md, SPEC-002-data-model.md
- **Files to change:** packages/domain/src/permissions/**, apps/api/src/auth/**, packages/persistence/src/repositories/**, apps/api/test/**
- **Exact edits expected:** Create permission constants, role model, guard/middleware, tenant context propagation, cross-tenant denial tests.
- **Validation command:** `sh scripts/test-integration.sh`
- **Expected result:** RBAC and tenant isolation tests pass.
- **Recovery instruction:** If persistence lacks required hooks, add minimal tenant context wrapper and record decision.

### Milestone 3: Implement approval and 2FA step-up gates

- **Goal:** Require approval/2FA for high-risk actions.
- **Files to read:** SECURITY.md, SPEC-005-auth-and-permissions.md, SPEC-001-core-domain.md
- **Files to change:** apps/api/src/approvals/**, apps/api/src/auth/step-up/**, apps/web/src/features/approvals/**, apps/api/test/**, apps/web/tests/**
- **Exact edits expected:** Add approval request lifecycle, expiring approvals, 2FA step-up interface, tests for offer/campaign/provider/DNC/Telegram high-risk actions.
- **Validation command:** `sh scripts/test-integration.sh && sh scripts/test-e2e.sh`
- **Expected result:** High-risk API/UI tests pass.
- **Recovery instruction:** If 2FA provider is not selected, implement interface plus local development TOTP/test adapter and default disabled production until configured.

### Milestone 4: Add security headers, rate limits, redaction, and audit logs

- **Goal:** Strengthen baseline security posture.
- **Files to read:** SECURITY.md, OBSERVABILITY.md, SPEC-006-error-handling.md
- **Files to change:** apps/api/src/security/**, apps/api/src/audit/**, apps/api/test/**, SECURITY.md, OBSERVABILITY.md
- **Exact edits expected:** Add header config, CORS/CSRF/session rules as applicable, rate limiting interfaces, audit logging for auth/permissions/approvals, and redaction tests.
- **Validation command:** `sh scripts/security-check.sh && sh scripts/test-integration.sh`
- **Expected result:** Security checks and tests pass.
- **Recovery instruction:** If security tool unavailable, update scripts to run available safe checks or fail clearly; do not silently skip.

### Milestone 5: Final security/auth review

- **Goal:** Confirm security docs and final validation.
- **Files to read:** PRODUCTION_READINESS.md, COMMANDS.md
- **Files to change:** .agent/execplans/EP-006-auth-security-and-permissions.md, SECURITY.md, ENVIRONMENT.md, DECISIONS.md
- **Exact edits expected:** Update docs with actual auth/env decisions and ExecPlan outcomes.
- **Validation command:** `sh scripts/verify.sh`
- **Expected result:** Full verification passes.
- **Recovery instruction:** If full verify fails outside auth/security, record evidence and run all auth/security relevant validations.

## 9. Concrete Steps

### Milestone 1 Steps: Implement auth configuration and session foundation

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 2 Steps: Implement RBAC and tenant isolation enforcement

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 3 Steps: Implement approval and 2FA step-up gates

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-integration.sh && sh scripts/test-e2e.sh`.
5. Record command output and update Progress before continuing.

### Milestone 4 Steps: Add security headers, rate limits, redaction, and audit logs

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/security-check.sh && sh scripts/test-integration.sh`.
5. Record command output and update Progress before continuing.

### Milestone 5 Steps: Final security/auth review

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

- Auth/session foundation works in built-in mode.
- RBAC denial and tenant isolation tests pass.
- High-risk action approval/2FA tests pass.
- Security headers/rate limiting/redaction/audit baseline exists.
- No secrets or raw DNC data exposed.
- Security docs updated.

If a final validation command cannot run because this greenfield repository has not yet reached the required implementation phase, record the exact failure, complete the narrower milestone validations that are in scope, and stop only if `AGENTS.md` STOP conditions apply.

## 11. Idempotence and Recovery

Auth/security changes should be additive and fail closed. If a feature is incomplete, default to deny/disabled and document remaining work.

General recovery:

- Inspect the exact error before editing.
- Apply the bounded retry rule in `AGENTS.md`.
- Prefer additive changes and deterministic fixtures.
- Never patch blindly around the same failure.
- If repository reality differs from this ExecPlan, choose the smallest safe change consistent with specs, record it, and continue.
- Stop only for STOP conditions in `AGENTS.md`.

## 12. Progress

Initial state: Not started. Requires EP-001 and benefits from EP-003/EP-004/EP-005.

- [x] Milestone 1: Implement auth configuration and session foundation — `sh scripts/typecheck.sh` and `sh scripts/test-integration.sh` passed on 2026-07-18; API integration reported 7 files/22 tests passed and persistence reported 22 passed/1 live-Postgres test skipped by its explicit opt-in gate.
- [x] Milestone 2: Implement RBAC and tenant isolation enforcement — `sh scripts/test-integration.sh` passed on 2026-07-18; API reported 7 files/23 tests passed and persistence reported 24 passed/1 live-Postgres test skipped by its explicit opt-in gate.
- [x] Milestone 3: Implement approval and 2FA step-up gates — `sh scripts/test-integration.sh` passed on 2026-07-18 with API 8 files/26 tests and persistence 24 passed/1 opt-in live test skipped; prescribed `sh scripts/test-e2e.sh` passed with 5 files/18 tests after a clean Next production build.
- [x] Milestone 4: Add security headers, rate limits, redaction, and audit logs — `sh scripts/security-check.sh` passed on 2026-07-18; `sh scripts/test-integration.sh` passed with API 9 files/31 tests and persistence 24 passed/1 opt-in live test skipped.
- [x] Milestone 5: Final security/auth review — `sh scripts/verify.sh` passed on 2026-07-18 in 225.4s, including install, lint, format, typecheck, unit/integration, build, security scan, dependency audit, and 4/4 smoke checks.

## 13. Surprises & Discoveries

- 2026-07-07: Built-in auth is default; external IdPs are adapters.
- 2026-07-18: Nest could not infer the new auth service dependency from emitted metadata; explicit injection at both auth consumers restored the full application graph without changing provider scope.
- 2026-07-18: The first session role allowlist drifted from the canonical domain roles. Importing `ROLES` from `@rei-os/domain` removed the duplicated security vocabulary and made typechecking catch future drift.
- 2026-07-18: The first missing-tenant negative fixtures called `toTenantId` and failed during fixture construction, before reaching the repository boundary. Branded test-only empty values isolate and prove the repository's own fail-closed behavior.
- 2026-07-18: The first prescribed E2E attempt exceeded its 180-second wrapper timeout while Turbo completed a clean Next build without streaming output. The narrow web suite passed 18/18, the exact orphaned process tree was cleared, and the prescribed script then passed in 1m37s with a larger validation budget.
- 2026-07-18: The first Milestone 4 integration run correctly rejected the pre-existing production-cookie fixture because its new production CORS allowlist was absent. Supplying an explicit synthetic HTTPS origin made the fixture represent a valid production configuration.

## 14. Decision Log

- 2026-07-07: High-risk actions require approval/2FA interfaces even if full UX is phased.
- 2026-07-18: Use standard-library HMAC-signed, absolute/idle-expiring sessions and scrypt password verification for the reversible built-in foundation; do not add a commercial identity dependency.
- 2026-07-18: Runtime identity lookup defaults to deny-all until a tenant-scoped store is wired. Production and staging reject placeholder session/encryption secrets, while local development retains explicit non-secret defaults.
- 2026-07-18: Treat absent/blank user, tenant, or session identifiers as unauthenticated at guards and repository entry points. Delegated permission lists restrict the base role, including an empty deny-all delegation.
- 2026-07-18: Every approval receives a 15-minute expiry unless a future expiry is supplied; expired records transition once and remain unusable. A shared deterministic high-risk policy requires both session MFA and a current tenant/action-matched approval.
- 2026-07-18: Production step-up defaults to a deny-all verifier. The only enabled adapter is deterministic and synthetic for test/local development; no TOTP secret or external provider is invented or stored.
- 2026-07-18: Use credentialed allowlisted CORS, double-submit CSRF, modern deny-by-default API headers, recursive redaction, and a central denial-audit interceptor. HSTS is emitted only for staging/production.
- 2026-07-18: Use a bounded in-process rate limiter as the single-instance baseline. Distributed multi-instance quota enforcement remains an operations concern and is documented rather than falsely claimed complete.
- 2026-07-18: `apps/api/src/app.module.ts` and `apps/api/src/main.ts` are justified extra files because middleware ordering and typed CORS must be applied at the Nest bootstrap boundary; `apps/api/src/campaigns/campaigns.service.ts` is justified because the existing live-side-effect seam had to consume the shared high-risk policy.

## 15. Outcomes & Retrospective

- Status: Complete on 2026-07-18.
- Completed milestones: All five, in order.
- Validation summary: Full `sh scripts/verify.sh` passed. Final API integration coverage is 9 files/31 tests; persistence is 24 passed with the explicit live-Postgres test skipped unless opted in; web acceptance is 5 files/18 tests. Security scan and dependency audit pass with no known vulnerabilities.
- Changed files summary: Auth/config/session, authorization and tenant repository guards, approval/step-up lifecycle, security middleware/interceptor, audit/redaction, approval UI states/tests, environment/security/observability docs, and ADR-0012. Bootstrap and campaign files are justified extras recorded above.
- Remaining risks: Runtime identity lookup is deny-all and has no durable user/session store or login controller; real MFA enrollment/verifier is owner-controlled and not configured; server-rendered web requests do not yet forward authenticated sessions; rate-limit and audit stores are single-process/in-memory; live browser automation remains deferred to EP-007. These prevent production readiness despite green local validation.
