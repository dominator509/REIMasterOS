# EP-002: Core Domain

## 1. Purpose / Big Picture

Implement pure core domain models and business logic for the Real Estate Investor / Acquisitions OS, including CRM/property entities, compliance verdicts, high-risk approval rules, deal math, negotiation safety, provider fallback decisions, and AI action policy.

## 2. Scope

- Domain entities and value objects.
- Pure business rules.
- Compliance/approval policies.
- Deal math and negotiation safety.
- Provider fallback and AI action policy types.
- Unit tests.

## 3. Non-goals

- No database, ORM, migrations, API routes, UI, provider SDKs, network calls, environment reads, queues, or live AI calls.
- No legal advice.
- No PropStream/Cobras code copying.
- No raw DNC storage implementation.

## 4. Context and Orientation

The domain is Layer 3 and must remain pure. Later layers call domain policies; domain never calls later layers. Compliance-critical decisions must be deterministic and test-backed, not model-discretion-based.

## 5. Files to Read First

- `AGENTS.md`
- `COMMANDS.md`
- `.agent/PLANS.md`
- `ARCHITECTURE.md`
- `SPEC-001-core-domain.md`
- `SPEC-005-auth-and-permissions.md`
- `SECURITY.md`
- `TESTING.md`

## 6. Files to Change

Expected changed files/directories:

- `packages/domain/src/**`
- `packages/domain/package.json`
- `packages/domain/tsconfig.json`
- `packages/domain/src/__tests__/**`
- `.agent/execplans/EP-002-core-domain.md`
- `ASSUMPTIONS.md`
- `DECISIONS.md`

Do not change files outside this list unless repository evidence requires it. Any extra file must be recorded in the Decision Log with reason and validation.

## 7. Interfaces and Contracts

- Domain exports typed entities/value objects/policies from `packages/domain/src/index.ts`.
- Compliance verdict shape must include `verdict`, `reasonCodes`, `evidenceRefs`, and `requiredApprovals`.
- Domain must not import database, UI, API framework, provider SDK, env, queue, or telemetry modules.

## 8. Milestones

### Milestone 1: Define domain primitives and entities

- **Goal:** Create pure domain models for tenant-scoped acquisition workflows.
- **Files to read:** SPEC-001-core-domain.md, ARCHITECTURE.md, packages/domain
- **Files to change:** packages/domain/src/entities/**, packages/domain/src/value-objects/**, packages/domain/src/index.ts, packages/domain/src/__tests__/**
- **Exact edits expected:** Implement TenantId, EntityId, Address, ContactPoint, Property, Owner, Contact, LeadList, ActivityEvent, Task, Campaign, Offer, Negotiation types with validation and synthetic unit tests.
- **Validation command:** `sh scripts/test-unit.sh`
- **Expected result:** Unit tests pass and print `unit tests: ok`.
- **Recovery instruction:** If existing domain patterns differ, adapt to them while keeping domain pure and record decision.

### Milestone 2: Implement compliance and approval policies

- **Goal:** Deterministically classify outreach and high-risk actions.
- **Files to read:** SECURITY.md, SPEC-005-auth-and-permissions.md, SPEC-001-core-domain.md
- **Files to change:** packages/domain/src/policies/compliance.ts, packages/domain/src/policies/approval.ts, packages/domain/src/__tests__/compliance-policy.test.ts
- **Exact edits expected:** Create verdict types `allowed|blocked|needs_approval`, reason codes, and policy tests for DNC, internal opt-out, unsubscribe, consent, quiet hours, call recording, SMS disabled, outbound AI voice locked, and binding offer actions.
- **Validation command:** `sh scripts/test-unit.sh`
- **Expected result:** Compliance tests cover all three verdicts and pass.
- **Recovery instruction:** If rule ambiguity appears, choose safest deny/needs_approval default and record in Decision Log.

### Milestone 3: Implement deal math and negotiation safety

- **Goal:** Support investor acquisition analysis without unsafe negotiation tactics.
- **Files to read:** SPEC-001-core-domain.md, PROJECT_BRIEF.md, SECURITY.md
- **Files to change:** packages/domain/src/deal-math/**, packages/domain/src/negotiation/**, packages/domain/src/__tests__/deal-math.test.ts, packages/domain/src/__tests__/negotiation-safety.test.ts
- **Exact edits expected:** Implement ARV/repair/holding/closing/profit/MAO calculations, offer ladder, counteroffer summary types, and negotiation safety checks blocking misrepresentation and unauthorized commitments.
- **Validation command:** `sh scripts/test-unit.sh`
- **Expected result:** Deal math and negotiation safety unit tests pass.
- **Recovery instruction:** If formulas are unspecified, implement conservative configurable formulas with explicit assumptions and record them.

### Milestone 4: Implement provider fallback and AI action policy types

- **Goal:** Represent provider-agnostic, cost-aware operations and AI tool safety in domain.
- **Files to read:** ARCHITECTURE.md, SPEC-000-product-scope.md, SPEC-001-core-domain.md
- **Files to change:** packages/domain/src/providers/**, packages/domain/src/ai-policy/**, packages/domain/src/__tests__/provider-fallback.test.ts, packages/domain/src/__tests__/ai-action-policy.test.ts
- **Exact edits expected:** Create provider capability/fallback decision functions for email/direct-mail/voice/SMS/maps/AI and AI action classifications that require MCP/policy/approval.
- **Validation command:** `sh scripts/test-unit.sh`
- **Expected result:** Provider fallback and AI policy tests pass.
- **Recovery instruction:** If a provider capability is unclear, model it generically and avoid vendor-specific behavior.

### Milestone 5: Enforce domain boundary and final review

- **Goal:** Verify domain imports no forbidden layers and update ExecPlan.
- **Files to read:** ARCHITECTURE.md, COMMANDS.md
- **Files to change:** packages/domain/**, .agent/execplans/EP-002-core-domain.md, DECISIONS.md
- **Exact edits expected:** Add or configure boundary tests/lint where available; update Progress, decisions, outcomes.
- **Validation command:** `sh scripts/verify.sh`
- **Expected result:** Full verification passes.
- **Recovery instruction:** If full verify fails outside domain due earlier unfinished plans, run `sh scripts/test-unit.sh` and record out-of-scope failure evidence.


## 9. Concrete Steps

### Milestone 1 Steps: Define domain primitives and entities

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-unit.sh`.
5. Record command output and update Progress before continuing.

### Milestone 2 Steps: Implement compliance and approval policies

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-unit.sh`.
5. Record command output and update Progress before continuing.

### Milestone 3 Steps: Implement deal math and negotiation safety

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-unit.sh`.
5. Record command output and update Progress before continuing.

### Milestone 4 Steps: Implement provider fallback and AI action policy types

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-unit.sh`.
5. Record command output and update Progress before continuing.

### Milestone 5 Steps: Enforce domain boundary and final review

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

- Domain package is pure and compile-safe.
- Unit tests cover required domain behavior.
- Compliance verdicts and approval policies return safe defaults.
- Deal math formulas and assumptions are tested.
- Provider fallback and AI policy concepts are defined without vendor lock-in.

If a final validation command cannot run because this greenfield repository has not yet reached the required implementation phase, record the exact failure, complete the narrower milestone validations that are in scope, and stop only if `AGENTS.md` STOP conditions apply.

## 11. Idempotence and Recovery

Domain work is idempotent when types/tests are additive. If existing domain files exist, extend them rather than replacing unless tests prove they are incompatible.

General recovery:

- Inspect the exact error before editing.
- Apply the bounded retry rule in `AGENTS.md`.
- Prefer additive changes and deterministic fixtures.
- Never patch blindly around the same failure.
- If repository reality differs from this ExecPlan, choose the smallest safe change consistent with specs, record it, and continue.
- Stop only for STOP conditions in `AGENTS.md`.

## 12. Progress

Initial state: Not started. Begin only after EP-001 foundation exists or adapt to existing domain package discovered by EP-000.

- [ ] Milestone 1: Define domain primitives and entities — validation `sh scripts/test-unit.sh` passed and result recorded.
- [ ] Milestone 2: Implement compliance and approval policies — validation `sh scripts/test-unit.sh` passed and result recorded.
- [ ] Milestone 3: Implement deal math and negotiation safety — validation `sh scripts/test-unit.sh` passed and result recorded.
- [ ] Milestone 4: Implement provider fallback and AI action policy types — validation `sh scripts/test-unit.sh` passed and result recorded.
- [ ] Milestone 5: Enforce domain boundary and final review — validation `sh scripts/verify.sh` passed and result recorded.

## 13. Surprises & Discoveries

- 2026-07-07: Domain formulas are expected to be conservative and configurable because market-specific assumptions vary.

## 14. Decision Log

- 2026-07-07: Compliance policies default to blocked/needs_approval when prerequisites are missing.

## 15. Outcomes & Retrospective

- Status: Not started.
- Completed milestones: None yet.
- Validation summary: Not run yet.
- Changed files summary: Not reviewed yet.
- Remaining risks: Execute milestones and update this section before final response.
