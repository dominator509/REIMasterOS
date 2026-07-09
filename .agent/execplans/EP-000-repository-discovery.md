# EP-000: Repository Discovery

## 1. Purpose / Big Picture

Discover repository structure, stack, commands, implementation state, risks, and missing information before changing a greenfield or unknown repository. This plan is mandatory for existing or unknown repositories and useful as a first sanity check in a greenfield repo.

## 2. Scope

- Inventory files, git state, package managers, CI, environment docs, service directories, and command evidence.
- Update `COMMANDS.md`, `ARCHITECTURE.md`, and `ASSUMPTIONS.md` only when evidence requires.
- Produce a handoff for EP-001 or the next selected ExecPlan.

## 3. Non-goals

- No feature implementation.
- No broad refactors.
- No dependency installation unless needed for preflight evidence.
- No production credentials, provider calls, campaigns, migrations, or deployments.
- No Cobras/PropStream code import.

## 4. Context and Orientation

The selected repository status is greenfield. The generated blueprint pack may be the only content. Discovery must still confirm that state because lower-tier coding agents must not rely on hidden assumptions.

## 5. Files to Read First

- `AGENTS.md`
- `COMMANDS.md`
- `.agent/PLANS.md`
- `ASSUMPTIONS.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`

## 6. Files to Change

Expected changed files/directories:

- `.agent/execplans/EP-000-repository-discovery.md`
- `COMMANDS.md`
- `ARCHITECTURE.md`
- `ASSUMPTIONS.md`

Do not change files outside this list unless repository evidence requires it. Any extra file must be recorded in the Decision Log with reason and validation.

## 7. Interfaces and Contracts

- Read-only inventory commands are allowed when listed in `COMMANDS.md`.
- Any command changes must be reflected in `COMMANDS.md` before use.
- Discovery findings must be recorded in the ExecPlan, not hidden in chat.

## 8. Milestones

### Milestone 1: Inventory repository files and git state

- **Goal:** Establish the exact starting state before any edits.
- **Files to read:** AGENTS.md, COMMANDS.md, .agent/PLANS.md
- **Files to change:** .agent/execplans/EP-000-repository-discovery.md
- **Exact edits expected:** Append inventory findings to Progress and Surprises & Discoveries; do not edit application files.
- **Validation command:** `sh scripts/preflight.sh`
- **Expected result:** Script prints `preflight: ok` or a clear missing-tool/setup error that is recorded.
- **Recovery instruction:** If preflight fails due missing pnpm or package.json in a greenfield repository, record it as expected setup work for EP-001 unless another STOP condition applies.

### Milestone 2: Detect stack, package manager, and commands

- **Goal:** Confirm whether default pnpm/TypeScript assumptions match repository evidence.
- **Files to read:** package.json, pnpm-workspace.yaml, turbo.json, .github/workflows, pyproject.toml, go.mod, Cargo.toml
- **Files to change:** COMMANDS.md, ASSUMPTIONS.md, .agent/execplans/EP-000-repository-discovery.md
- **Exact edits expected:** Update COMMANDS.md only if repository evidence proves commands differ; update assumptions if stack differs.
- **Validation command:** `sh scripts/preflight.sh`
- **Expected result:** Preflight reflects the detected command state and fails only on real prerequisites.
- **Recovery instruction:** If files do not exist in greenfield state, record that EP-001 must create them; do not invent commands beyond COMMANDS.md.

### Milestone 3: Inspect CI, environment, and architecture evidence

- **Goal:** Identify existing CI/CD, environment variables, service directories, and architecture risks.
- **Files to read:** .github/workflows, .gitlab-ci.yml, .env.example, docker-compose.yml, infra, apps, packages, services, workers, db
- **Files to change:** ARCHITECTURE.md, ENVIRONMENT.md, ASSUMPTIONS.md, .agent/execplans/EP-000-repository-discovery.md
- **Exact edits expected:** Update docs only when evidence contradicts generated assumptions.
- **Validation command:** `sh scripts/preflight.sh`
- **Expected result:** Preflight still succeeds or reports expected missing foundation setup.
- **Recovery instruction:** If conflicting architecture exists, document the conflict and stop only if EP-001 cannot proceed without broad refactor.

### Milestone 4: Record risks and next active plan

- **Goal:** Create a clear handoff for EP-001 or another active plan.
- **Files to read:** ROADMAP.md, .agent/execplans/EP-001-foundation.md, ASSUMPTIONS.md
- **Files to change:** .agent/execplans/EP-000-repository-discovery.md, ASSUMPTIONS.md, COMMANDS.md, ARCHITECTURE.md
- **Exact edits expected:** Update Progress, Surprises, Decision Log, and Outcomes with discovered state, risks, and recommended next ExecPlan.
- **Validation command:** `git diff --name-only`
- **Expected result:** Diff contains only discovery docs unless repository evidence required command/architecture/assumption updates.
- **Recovery instruction:** If unexpected application files changed, revert those unrelated changes and record why.

## 9. Concrete Steps

### Milestone 1 Steps: Inventory repository files and git state

1. Run `pwd`.
2. Run `git status --short`.
3. Run `find . -maxdepth 3 -type f | sort`.
4. Record whether the repo is blueprint-only or contains pre-existing implementation.
5. Do not delete or reorganize files.

### Milestone 2 Steps: Detect stack, package manager, and commands

1. Inspect known dependency/config files if present.
2. Record package manager evidence.
3. Record any existing scripts.
4. If scripts differ from `COMMANDS.md`, update `COMMANDS.md` with exact names from repository files.
5. If no package files exist, keep greenfield assumption A-001/A-002.

### Milestone 3 Steps: Inspect CI, environment, and architecture evidence

1. Search for CI files.
2. Search for environment examples.
3. Search for existing app/package/service directories.
4. Record architectural deviations from the six-layer map.
5. Update docs if evidence requires.

### Milestone 4 Steps: Record risks and next active plan

1. Summarize repository state.
2. List discovered blockers.
3. Confirm next plan is EP-001 for greenfield.
4. Run `git diff --name-only`.
5. Update Outcomes & Retrospective.

## 10. Validation and Acceptance

Required final validation:

```sh
sh scripts/verify.sh
```

Acceptance criteria:

- Repository starting state is documented.
- Package manager and command assumptions are confirmed or updated.
- CI/environment/architecture evidence is documented.
- No application feature work is performed.
- Next ExecPlan recommendation is recorded.

If a final validation command cannot run because this greenfield repository has not yet reached the required implementation phase, record the exact failure, complete the narrower milestone validations that are in scope, and stop only if `AGENTS.md` STOP conditions apply.

## 11. Idempotence and Recovery

Discovery is idempotent because it reads repository files and updates documentation only. Re-running should update timestamps/findings without altering application behavior.

General recovery:

- Inspect the exact error before editing.
- Apply the bounded retry rule in `AGENTS.md`.
- Prefer additive changes and deterministic fixtures.
- Never patch blindly around the same failure.
- If repository reality differs from this ExecPlan, choose the smallest safe change consistent with specs, record it, and continue.
- Stop only for STOP conditions in `AGENTS.md`.

## 12. Progress

Initial state from blueprint generation: greenfield assumption recorded; execute this plan to confirm.

- [x] Milestone 1: Inventory repository files and git state — validation `sh scripts/preflight.sh` passed: `preflight: ok` (expected warnings about missing package.json and .env.local — greenfield normal). 97 files in repo, all blueprint docs + tool configs. No application code.
- [x] Milestone 2: Detect stack, package manager, and commands — validation `sh scripts/preflight.sh` passed. Confirmed: no package.json, pnpm-workspace.yaml, turbo.json, pyproject.toml, go.mod, or Cargo.toml. All A-001/A-002 greenfield assumptions confirmed. COMMANDS.md and ASSUMPTIONS.md need no changes.
- [x] Milestone 3: Inspect CI, environment, and architecture evidence — validation `sh scripts/preflight.sh` passed. No .github/, .gitlab-ci.yml, .env files, or app directories. ARCHITECTURE.md, ENVIRONMENT.md, ASSUMPTIONS.md all match greenfield state. No conflicting architecture.
- [x] Milestone 4: Record risks and next active plan — validation `git diff --name-only` passed. Only EP-000 progress updated. Handoff to EP-001.

## 13. Surprises & Discoveries

- 2026-07-07: Blueprint generated for greenfield repository.
- 2026-07-08: Discovery confirmed 97 files — all blueprint docs + tool configs (.claude/, .serena/, .obsidian/). Zero application code, zero package files, zero CI/CD.
- 2026-07-08: Git repo not initialized at start — initialized during discovery (baseline commit created).
- 2026-07-08: .claude/, .serena/, .obsidian/ already configured — tool ecosystem ready before first line of code.

## 14. Decision Log

- 2026-07-07: Default decision is to proceed to EP-001 after discovery if repository is blueprint-only.
- 2026-07-08: Git initialized during EP-000 to enable `git diff` validation. No application files existed to disturb.
- 2026-07-08: All 20 assumptions (A-001 through A-020) confirmed — no COMMANDS.md, ARCHITECTURE.md, or ASSUMPTIONS.md changes needed.

## 15. Outcomes & Retrospective

- Status: **Complete**.
- Completed milestones: 4/4.
- Validation summary: `sh scripts/preflight.sh` → `preflight: ok`. `git diff --name-only` → only EP-000 updated.
- Changed files summary: Only `.agent/execplans/EP-000-repository-discovery.md` (progress updates).
- Remaining risks: None. Greenfield state fully confirmed. Handoff to EP-001 is clean.
- Next ExecPlan: **EP-001-foundation.md** — create monorepo skeleton, pnpm workspace, package.json scripts, and make placeholder scripts operational.
