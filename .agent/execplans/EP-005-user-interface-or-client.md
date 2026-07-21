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

- [x] Milestone 1: Create dashboard shell and navigation — 2026-07-18 `sh scripts/test-e2e.sh` passed (1 file / 2 acceptance tests); semantic landmarks, skip navigation, investor/acquisitions workspace context, required destinations, and original branding are covered.
- [x] Milestone 2: Implement property/list/task/activity core screens — 2026-07-18 `sh scripts/typecheck.sh` and `sh scripts/test-e2e.sh` passed (2 files / 5 acceptance tests); contract-backed property/detail, lead-list/detail, task, and universal activity views cover loading, empty, populated, and error states with a table alternative.
- [x] Milestone 3: Implement import/export and compliance states — 2026-07-18 `sh scripts/test-e2e.sh` passed (3 files / 10 tests); CSV validation, provider-optional manual email/direct-mail exports, allowed/blocked/needs-approval verdicts, expiring approvals, and disabled pre-auth launch controls are covered.
- [x] Milestone 4: Implement AI shell and Cost Optimization Center — 2026-07-18 `sh scripts/test-e2e.sh` passed (4 files / 13 tests); local-only/disabled AI, sanitizer blocking with no partial output, sanitized messages, provider health/fallbacks, and honest unavailable spend/cache telemetry are covered.
- [x] Milestone 5: Accessibility and final UI verification — 2026-07-18 `sh scripts/test-e2e.sh` passed after a clean dependency/web build (5 files / 17 tests), and `sh scripts/verify.sh` passed install, lint, format, typecheck, unit, integration, build, security, dependency audit, and smoke.

## 13. Surprises & Discoveries

- 2026-07-07: UI defaults to investor/acquisitions language and avoids third-party protected expression.
- 2026-07-18 audit: The client contained styled placeholder pages and a trivial unit test; `@rei-os/web test:e2e` deliberately exited with failure, while the root Turbo E2E command also invoked the API package's unrelated failing placeholder.
- 2026-07-18 validation recovery: The first E2E run was blocked by the unrelated API placeholder. After scoping the command, standalone Vitest lacked Next's automatic JSX transform; adding React only in the test moved the same failure to the first rendered component. Stopped the per-file-import hypothesis and configured the acceptance suite's JSX transform centrally.
- 2026-07-18 contract integration: All exported list response schemas used a legacy `{ data, total, ... }` pagination shape while EP-004 services return the standard `{ data: { items, ... }, meta }` envelope. Updated list schemas to the standard envelope before wiring UI parsing.
- 2026-07-18 final verification: The default Vitest unit discovery also collected `tests/**/*.e2e.test.tsx`, bypassing the acceptance config's JSX transform and duplicating the suite. Restricted the unit config to `src/**/*.test.*`; acceptance remains exclusively under `test:e2e`.
- 2026-07-18 production build: `@rei-os/contracts` advertised `src/index.ts`, whose ESM `.js` specifiers cannot be resolved by Next/Webpack against source. Published the existing TypeScript build output through `dist` package exports and changed root E2E dispatch to a filtered Turbo task so contract/web builds always precede acceptance tests.

## 14. Decision Log

- 2026-07-07: If API endpoints lag, UI must show disabled/empty states rather than invent backend behavior.
- 2026-07-18: Use Vitest server-rendered acceptance tests for EP-005 because the existing stack has no browser driver. This proves real component/route markup but is not represented as live-browser coverage; EP-007 must add deeper browser/accessibility hardening if required.
- 2026-07-18: Changed root `package.json` `test:e2e` to target `@rei-os/web` so this UI plan's required command does not invoke the API package's explicit unimplemented placeholder. This expected extra file is necessary to make the documented command truthful; API transport E2E remains EP-007 work.
- 2026-07-18: Added `apps/web/package.json` and `apps/web/vitest.e2e.config.ts` as framework command/config extras required to replace the failing placeholder with the acceptance suite; no new dependency was added.
- 2026-07-18: Production pages load from the documented server-only `API_BASE_URL` (default `http://localhost:3001`) and validate shared response schemas. Synthetic populated data exists only in acceptance tests; unauthenticated writes stay visibly disabled until EP-006.
- 2026-07-18: Updated `packages/contracts/package.json` to expose its existing compiled `dist` artifacts. This expected package-config extra is required for the Next production bundle; no new build tool or dependency was introduced.
- 2026-07-18: Updated `COMMANDS.md`, root `package.json`, `apps/web/package.json`, both web Vitest configs, `packages/contracts/package.json`, and `pnpm-lock.yaml` outside the narrow source/test list because the previously documented E2E/package wiring could not execute a clean production acceptance run. All extras are command, framework-config, or lockfile evidence; no unrelated product scope was added.

## 15. Outcomes & Retrospective

- Status: Complete.
- Completed milestones: All five milestones completed in order on 2026-07-18.
- Validation summary: `sh scripts/test-e2e.sh` passed a clean contract/web build plus 5 files / 17 server-rendered acceptance and accessibility tests. `sh scripts/typecheck.sh`, targeted unit/build recovery checks, and final `sh scripts/verify.sh` passed. Security scan and dependency audit are green with no known vulnerabilities.
- Changed files summary: Accessible Next app shell/navigation; contract-validating API adapter; property/detail, lead-list/detail, task, activity, import/export, compliance/approval, campaign, AI, provider, and cost-center views; shared response-schema corrections; acceptance/accessibility tests; package/test command configuration; compiled contracts export; command/decision docs; and this ExecPlan.
- Remaining risks: Tests render real components but do not drive a live browser, so focus behavior, responsive layout, and network navigation still require Playwright/browser hardening in EP-007. Authentication/session propagation and enabled writes are intentionally deferred to EP-006. Runtime API stores/jobs, artifact upload, live AI/providers, and cost/cache telemetry remain disabled or unavailable; the UI states these limits rather than claiming readiness. Production-readiness criteria did not pass and were not run for this plan.
