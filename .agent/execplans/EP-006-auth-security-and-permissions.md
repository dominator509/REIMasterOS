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

- [ ] Milestone 1: Implement auth configuration and session foundation — validation `sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 2: Implement RBAC and tenant isolation enforcement — validation `sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 3: Implement approval and 2FA step-up gates — validation `sh scripts/test-integration.sh && sh scripts/test-e2e.sh` passed and result recorded.
- [ ] Milestone 4: Add security headers, rate limits, redaction, and audit logs — validation `sh scripts/security-check.sh && sh scripts/test-integration.sh` passed and result recorded.
- [ ] Milestone 5: Final security/auth review — validation `sh scripts/verify.sh` passed and result recorded.

## 13. Surprises & Discoveries

- 2026-07-07: Built-in auth is default; external IdPs are adapters.

## 14. Decision Log

- 2026-07-07: High-risk actions require approval/2FA interfaces even if full UX is phased.

## 15. Outcomes & Retrospective

- Status: Not started.
- Completed milestones: None yet.
- Validation summary: Not run yet.
- Changed files summary: Not reviewed yet.
- Remaining risks: Execute milestones and update this section before final response.
