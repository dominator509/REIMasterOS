# EP-005: User Interface or Client

## 1. Purpose / Big Picture

Implement the dashboard/PWA user interaction layer for property search, CRM, lead lists, tasks, activity, import/export, compliance/approval states, AI assistant shell, and cost optimization center.

## 2. Scope

- Next.js dashboard shell.
- Accessible navigation.
- Core CRM/property/list/task/activity screens.
- CSV import preview.
- Manual email/direct-mail export UI.
- Compliance block and approval required states.
- AI assistant shell.
- Cost Optimization Center.
- E2E/accessibility tests.

## 3. Non-goals

- No native mobile app.
- No PropStream/Cobras UI copying.
- No map-only workflows.
- No live provider sends.
- No AI output display before sanitizer.
- No compliance logic implemented in UI.

## 4. Context and Orientation

The UI is Layer 1. It calls API contracts and displays states. It must not make compliance decisions, call provider APIs directly, or call MCP tools directly.

## 5. Files to Read First

- `AGENTS.md`
- `COMMANDS.md`
- `.agent/PLANS.md`
- `ARCHITECTURE.md`
- `SPEC-004-ui-ux-behavior.md`
- `SPEC-003-api-contracts.md`
- `TESTING.md`
- `SECURITY.md`

## 6. Files to Change

Expected changed files/directories:

- `apps/web/src/**`
- `apps/web/tests/**`
- `packages/ui/**`
- `packages/contracts/src/**`
- `.agent/execplans/EP-005-user-interface-or-client.md`
- `DECISIONS.md`

Do not change files outside this list unless repository evidence requires it. Any extra file must be recorded in the Decision Log with reason and validation.

## 7. Interfaces and Contracts

- UI uses shared contracts for data shapes.
- UI displays compliance verdicts and approvals returned by API.
- AI chat displays sanitized messages only.
- Map workflows must include list/table alternatives.

## 8. Milestones

### Milestone 1: Create dashboard shell and navigation

- **Goal:** Provide accessible app shell with investor/acquisitions-first navigation.
- **Files to read:** SPEC-004-ui-ux-behavior.md, PROJECT_BRIEF.md, apps/web
- **Files to change:** apps/web/src/app/**, apps/web/src/components/**, packages/ui/**, apps/web/tests/**
- **Exact edits expected:** Implement layout, navigation, tenant/mode indicator, placeholder pages, accessible landmarks, and no third-party branding.
- **Validation command:** `sh scripts/test-e2e.sh`
- **Expected result:** E2E shell/navigation test passes.
- **Recovery instruction:** If Next.js app structure differs, adapt to existing app router/pages router and record decision.

### Milestone 2: Implement property/list/task/activity core screens

- **Goal:** Create primary CRM views with loading/empty/error states.
- **Files to read:** SPEC-004-ui-ux-behavior.md, SPEC-003-api-contracts.md
- **Files to change:** apps/web/src/features/properties/**, apps/web/src/features/lead-lists/**, apps/web/src/features/tasks/**, apps/web/src/features/activity/**, apps/web/tests/**
- **Exact edits expected:** Add property search/list/detail, lead list detail, task/follow-up UI, universal timeline components using API contracts or mocked test adapters.
- **Validation command:** `sh scripts/test-e2e.sh`
- **Expected result:** E2E tests cover empty/populated/error states.
- **Recovery instruction:** If API is incomplete, use contract-backed mock handlers only in tests and record dependency.

### Milestone 3: Implement import/export and compliance states

- **Goal:** Make CSV import, manual email/direct-mail export, compliance block, and approval required states visible.
- **Files to read:** SPEC-004-ui-ux-behavior.md, SECURITY.md
- **Files to change:** apps/web/src/features/imports/**, apps/web/src/features/campaigns/**, apps/web/src/features/compliance/**, apps/web/tests/**
- **Exact edits expected:** Add import preview/validation UI, manual export screens, compliance verdict panel, approval card, and tests for blocked/needs_approval/success states.
- **Validation command:** `sh scripts/test-e2e.sh`
- **Expected result:** Compliance and import/export E2E tests pass.
- **Recovery instruction:** If export endpoints unavailable, create disabled/provider-not-configured UI state and record API dependency.

### Milestone 4: Implement AI shell and Cost Optimization Center

- **Goal:** Provide local-Hermes-first AI chat shell and provider/fallback/cost dashboard.
- **Files to read:** SPEC-004-ui-ux-behavior.md, OBSERVABILITY.md, ENVIRONMENT.md
- **Files to change:** apps/web/src/features/ai/**, apps/web/src/features/cost-center/**, apps/web/tests/**
- **Exact edits expected:** Add AI chat shell that only displays sanitized API responses; add provider health/cost/fallback table and local-only mode indicators.
- **Validation command:** `sh scripts/test-e2e.sh`
- **Expected result:** AI sanitizer block and cost center E2E tests pass.
- **Recovery instruction:** If AI API unavailable, implement disabled/local-only informational state and record dependency.

### Milestone 5: Accessibility and final UI verification

- **Goal:** Verify UI behavior and accessibility requirements.
- **Files to read:** TESTING.md, PRODUCTION_READINESS.md
- **Files to change:** apps/web/tests/**, .agent/execplans/EP-005-user-interface-or-client.md
- **Exact edits expected:** Add accessibility checks for key screens; update progress/outcomes.
- **Validation command:** `sh scripts/verify.sh`
- **Expected result:** Full verification passes.
- **Recovery instruction:** If full verify fails outside UI, run E2E/accessibility relevant commands and record remaining blockers.


## 9. Concrete Steps

### Milestone 1 Steps: Create dashboard shell and navigation

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-e2e.sh`.
5. Record command output and update Progress before continuing.

### Milestone 2 Steps: Implement property/list/task/activity core screens

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-e2e.sh`.
5. Record command output and update Progress before continuing.

### Milestone 3 Steps: Implement import/export and compliance states

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-e2e.sh`.
5. Record command output and update Progress before continuing.

### Milestone 4 Steps: Implement AI shell and Cost Optimization Center

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/test-e2e.sh`.
5. Record command output and update Progress before continuing.

### Milestone 5 Steps: Accessibility and final UI verification

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

- Dashboard shell and navigation render accessibly.
- Primary screens cover loading/empty/error/populated states.
- Compliance/approval states are visible and accessible.
- Manual export fallbacks are represented.
- AI shell respects sanitizer state.
- E2E/accessibility tests pass.

If a final validation command cannot run because this greenfield repository has not yet reached the required implementation phase, record the exact failure, complete the narrower milestone validations that are in scope, and stop only if `AGENTS.md` STOP conditions apply.

## 11. Idempotence and Recovery

UI work should be additive and componentized. Mock data may be used only in tests or disabled states; user-visible production code should call API contracts.

General recovery:

- Inspect the exact error before editing.
- Apply the bounded retry rule in `AGENTS.md`.
- Prefer additive changes and deterministic fixtures.
- Never patch blindly around the same failure.
- If repository reality differs from this ExecPlan, choose the smallest safe change consistent with specs, record it, and continue.
- Stop only for STOP conditions in `AGENTS.md`.

## 12. Progress

Initial state: Not started. Requires EP-001; benefits from EP-004 contracts/API.

- [ ] Milestone 1: Create dashboard shell and navigation — validation `sh scripts/test-e2e.sh` passed and result recorded.
- [ ] Milestone 2: Implement property/list/task/activity core screens — validation `sh scripts/test-e2e.sh` passed and result recorded.
- [ ] Milestone 3: Implement import/export and compliance states — validation `sh scripts/test-e2e.sh` passed and result recorded.
- [ ] Milestone 4: Implement AI shell and Cost Optimization Center — validation `sh scripts/test-e2e.sh` passed and result recorded.
- [ ] Milestone 5: Accessibility and final UI verification — validation `sh scripts/verify.sh` passed and result recorded.

## 13. Surprises & Discoveries

- 2026-07-07: UI defaults to investor/acquisitions language and avoids third-party protected expression.

## 14. Decision Log

- 2026-07-07: If API endpoints lag, UI must show disabled/empty states rather than invent backend behavior.

## 15. Outcomes & Retrospective

- Status: Not started.
- Completed milestones: None yet.
- Validation summary: Not run yet.
- Changed files summary: Not reviewed yet.
- Remaining risks: Execute milestones and update this section before final response.
