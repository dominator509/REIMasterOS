# EP-009: Deployment and Release

## 1. Purpose / Big Picture

Prepare self-hosted and production deployment paths: Docker Compose profiles, container build artifacts, CI/CD image pipeline, Helm/Kubernetes skeleton, release process, smoke tests, and rollback path.

## 2. Scope

- Docker Compose profiles.
- Dockerfiles/build artifacts.
- CI image build/scans.
- Helm/Kubernetes skeleton.
- Release/rollback documentation.
- Production-readiness script improvements.

## 3. Non-goals

- No actual production deployment.
- No live migrations.
- No live campaign/provider sends.
- No mandatory paid vendor.
- No committed secrets.
- No enterprise-only deployment requirement.

## 4. Context and Orientation

Deployment is Layer 6. Budget/self-host mode must be first-class. Production deployment is a STOP condition without explicit permission.

## 5. Files to Read First

- `AGENTS.md`
- `COMMANDS.md`
- `.agent/PLANS.md`
- `DEPLOYMENT.md`
- `ENVIRONMENT.md`
- `RELEASE.md`
- `ROLLBACK.md`
- `PRODUCTION_READINESS.md`
- `SECURITY.md`

## 6. Files to Change

Expected changed files/directories:

- `infra/compose/**`
- `infra/helm/**`
- `Dockerfile`
- `apps/*/Dockerfile`
- `services/*/Dockerfile`
- `workers/*/Dockerfile`
- `.dockerignore`
- `.github/workflows/ci.yml`
- `.env.example`
- `DEPLOYMENT.md`
- `RELEASE.md`
- `ROLLBACK.md`
- `scripts/production-readiness-check.sh`
- `.agent/execplans/EP-009-deployment-and-release.md`
- `DECISIONS.md`

Do not change files outside this list unless repository evidence requires it. Any extra file must be recorded in the Decision Log with reason and validation.

## 7. Interfaces and Contracts

- Compose profiles must not require paid providers for core mode.
- Helm values use secret references, not literal secrets.
- Build artifacts exclude `.env.local`, raw data, and generated sensitive artifacts.
- Smoke tests must not send live outreach.

## 8. Milestones

### Milestone 1: Create Docker Compose deployment profiles

- **Goal:** Support self-hosted solo/budget and configurable hybrid/vendor/enterprise profiles.
- **Files to read:** DEPLOYMENT.md, ENVIRONMENT.md, ARCHITECTURE.md
- **Files to change:** infra/compose/solo-budget.yml, infra/compose/hybrid-cheap.yml, infra/compose/vendor-fast.yml, infra/compose/enterprise-self-host.yml, .env.example, DEPLOYMENT.md
- **Exact edits expected:** Add Compose profiles for app/API/workers/Postgres/Redis/MinIO/OpenSearch/local LLM placeholders/observability; ensure paid providers optional.
- **Validation command:** `sh scripts/smoke-test.sh`
- **Expected result:** Smoke test passes in local profile or reports missing services with documented setup command.
- **Recovery instruction:** If services too heavy for default smoke, mark optional services disabled and document how to enable.

### Milestone 2: Add build artifacts and image pipeline

- **Goal:** Build deployable containers and CI image checks.
- **Files to read:** COMMANDS.md, .github/workflows/ci.yml
- **Files to change:** Dockerfile, apps/web/Dockerfile, apps/api/Dockerfile, services/ai-gateway/Dockerfile, workers/**/Dockerfile, .dockerignore, .github/workflows/ci.yml
- **Exact edits expected:** Create Dockerfiles or one multi-target Dockerfile, add build/test/scan jobs, avoid secrets in images.
- **Validation command:** `sh scripts/build.sh && sh scripts/security-check.sh`
- **Expected result:** Build and security check scripts pass.
- **Recovery instruction:** If a service does not exist, create Dockerfile only for existing services and record deferred services.

### Milestone 3: Add Helm/Kubernetes skeleton

- **Goal:** Prepare enterprise self-host deployment manifests without requiring Kubernetes for budget mode.
- **Files to read:** DEPLOYMENT.md, ENVIRONMENT.md, SECURITY.md
- **Files to change:** infra/helm/**, DEPLOYMENT.md
- **Exact edits expected:** Add Helm chart skeleton for web/API/workers/config/secrets references/ingress/health probes/resources; document values and disabled optional providers.
- **Validation command:** `sh scripts/production-readiness-check.sh`
- **Expected result:** Readiness check validates chart files or reports clear remaining checks.
- **Recovery instruction:** If Helm unavailable locally, validate templates if possible or document command requirement.

### Milestone 4: Finalize release and rollback process

- **Goal:** Make release, migration, smoke, and rollback steps executable/documented.
- **Files to read:** RELEASE.md, ROLLBACK.md, DEPLOYMENT.md, OPERATIONS.md
- **Files to change:** RELEASE.md, ROLLBACK.md, DEPLOYMENT.md, scripts/production-readiness-check.sh
- **Exact edits expected:** Update release/rollback docs with actual build/deploy artifacts and smoke command; improve readiness script checks for deployment files.
- **Validation command:** `sh scripts/production-readiness-check.sh`
- **Expected result:** Production readiness check prints `production readiness: ok` only if required deployment docs/files exist.
- **Recovery instruction:** If production readiness cannot pass yet, script must fail clearly with missing item; record for EP-010.

### Milestone 5: Final deployment/release review

- **Goal:** Validate deployment artifacts and update ExecPlan.
- **Files to read:** PRODUCTION_READINESS.md, COMMANDS.md
- **Files to change:** .agent/execplans/EP-009-deployment-and-release.md, DECISIONS.md
- **Exact edits expected:** Update progress/outcomes and decision log; confirm no production deployment executed.
- **Validation command:** `git diff --name-only`
- **Expected result:** Diff contains expected deployment/release files; no secrets.
- **Recovery instruction:** If secrets or generated artifacts appear, remove them and rerun diff.

## 9. Concrete Steps

### Milestone 1 Steps: Create Docker Compose deployment profiles

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/smoke-test.sh`.
5. Record command output and update Progress before continuing.

### Milestone 2 Steps: Add build artifacts and image pipeline

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/build.sh && sh scripts/security-check.sh`.
5. Record command output and update Progress before continuing.

### Milestone 3 Steps: Add Helm/Kubernetes skeleton

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/production-readiness-check.sh`.
5. Record command output and update Progress before continuing.

### Milestone 4 Steps: Finalize release and rollback process

1. Read the listed files before editing.
2. Inspect existing repository patterns and confirm names before use.
3. Apply the exact edits expected for this milestone only.
4. Run `sh scripts/production-readiness-check.sh`.
5. Record command output and update Progress before continuing.

### Milestone 5 Steps: Final deployment/release review

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

- Solo/budget deployment profile exists.
- Build artifacts/images can be built for existing services.
- Helm skeleton exists for enterprise self-host mode.
- Release and rollback docs match actual artifacts.
- Production readiness checks cover deployment files.
- No production deployment performed.

If a final validation command cannot run because this greenfield repository has not yet reached the required implementation phase, record the exact failure, complete the narrower milestone validations that are in scope, and stop only if `AGENTS.md` STOP conditions apply.

## 11. Idempotence and Recovery

Deployment files are additive. Re-running builds should be reproducible. Do not remove local data volumes unless explicitly in disposable local context.

General recovery:

- Inspect the exact error before editing.
- Apply the bounded retry rule in `AGENTS.md`.
- Prefer additive changes and deterministic fixtures.
- Never patch blindly around the same failure.
- If repository reality differs from this ExecPlan, choose the smallest safe change consistent with specs, record it, and continue.
- Stop only for STOP conditions in `AGENTS.md`.

## 12. Progress

Initial state: Not started. Requires prior application services for meaningful images; create only existing-service images.

- [x] Milestone 1: Create Docker Compose deployment profiles — all four profiles now use explicit runtime configuration, health-gated app dependencies, optional local-AI/observability paths, and no mandatory paid provider. `sh scripts/smoke-test.sh` passed with 8/8 checks on 2026-07-18.
- [x] Milestone 2: Add build artifacts and image pipeline — `sh scripts/build.sh && sh scripts/security-check.sh` passed on 2026-07-18. Isolated local Docker builds then produced `rei-os-api:local` and `rei-os-web:local` as unprivileged Node runtime images; no push or deployment occurred.
- [x] Milestone 3: Add Helm/Kubernetes skeleton — `sh scripts/production-readiness-check.sh` passed its repository-artifact checks on 2026-07-18. A checksum-verified temporary Helm v3.20.2 binary also linted the chart and rendered API/web manifests with synthetic references; enabling the absent worker runtime failed as designed. No cluster admission or deployment was attempted.
- [x] Milestone 4: Finalize release and rollback process — `sh scripts/production-readiness-check.sh` passed on 2026-07-18 after verifying image jobs/scans, release/rollback evidence contracts, and target-smoke markers. `sh scripts/typecheck.sh` and the default 8-case smoke also passed for the new target-aware smoke path.
- [x] Milestone 5: Final deployment/release review — `git diff --name-only`, `git status --short --branch`, and `git diff --check` passed/reviewed on 2026-07-18. The cumulative worktree contains EP-001–EP-009 implementation plus three pre-existing user-owned `.obsidian` changes; EP-009 extras are justified below and no secret/generated release artifact is intended for the final diff.

## 13. Surprises & Discoveries

- 2026-07-07: Docker Compose budget mode is primary; Kubernetes is optional enterprise path.
- 2026-07-18: Existing hybrid/vendor/enterprise profiles omitted auth secrets required by production config, loaded an implicit `.env`, lacked application health checks, referenced incomplete observability mounts, and suggested immediate deploy commands. Profiles now distinguish synthetic local defaults from owner-supplied staging/production values and deployment docs no longer present templates as quick deploys.
- 2026-07-18: The host build hid a package-boundary defect because `@rei-os/config` used Node globals without declaring `@types/node`; a clean API container build exposed it. The first combined PowerShell image-build sequence also allowed a later successful web build to mask the failed API build, so image validations were rerun independently and documented as separate commands.
- 2026-07-18: The existing Helm directory contained only chart metadata and mutable `latest` values. No templates existed. Helm is not installed system-wide on this audit host; official v3.20.2 was downloaded to `C:\tmp`, its SHA-256 matched the published checksum, and lint/render passed. Kubernetes admission remains unproved.
- 2026-07-18: The existing smoke command was entirely offline even though release docs called it a post-deploy check. It now adds read-only web/live/readiness checks only when both explicit target URLs are supplied. Readiness still honestly fails until required runtime dependencies have connected probes; no staging target existed to exercise target mode.
- 2026-07-19: The first final verify retry reached the web production build but failed with Windows `EPERM` while Next tried to create pnpm symlinks under `.next/standalone`. A disposable `C:\tmp` probe confirmed the audit process cannot create any symlink, so stale output was not the cause. Next now omits standalone output on Windows unless explicitly forced while Linux CI/container builds keep it; two consecutive local web builds passed.

## 14. Decision Log

- 2026-07-07: Production deploy/migration remains STOP condition.
- 2026-07-18: Do not fabricate containers for absent worker or AI-gateway runtimes. An optional local-LLM sidecar does not enable the application AI route; paid provider variables remain optional and manual/local core fallbacks remain first-class.
- 2026-07-18: Compose application/observability profiles require secrets from an ignored operator-owned environment source. The solo data-only path remains usable without those values; local data-service defaults are explicitly non-production.
- 2026-07-18: Package runtime exports point to compiled `dist` output, and each package must declare build-only types it consumes so clean container builds do not depend on host hoisting. `packages/config/package.json` and the lockfile are justified extra files for that release-image defect.
- 2026-07-18: CI builds both existing runtime images and pins the container scanner action to a full reviewed commit. The Helm chart requires image tags or digests plus an existing Secret reference, renders only API/web, and refuses to enable the absent worker runtime.
- 2026-07-18: Runtime images share a version-and-digest-pinned Node base, run as the unprivileged `node` user, and are built/scanned independently. CI intentionally does not publish: registry selection, credentials, signing, provenance, SBOM/notices, and immutable release references remain owner-controlled gates.
- 2026-07-18: `scripts/smoke/local-smoke.ts` is a justified extra file because the documented release smoke command previously did not test any deployed artifact. Its target mode is GET-only and fails closed on missing, malformed, credential-bearing, unreachable, live-failing, or non-ready targets.
- 2026-07-18: `COMMANDS.md`, `apps/api/package.json`, `packages/config/package.json`, `packages/domain/package.json`, `packages/observability/package.json`, and `pnpm-lock.yaml` are justified active-plan extras. They document newly validated commands and repair clean-container dependency/export boundaries required for deployable images. The root multi-target Dockerfile covers the existing API; absent service/worker Dockerfiles were not fabricated.
- 2026-07-19: `apps/web/package.json`, `apps/web/next.config.ts`, `apps/web/src/__tests__/next-config.test.ts`, and `scripts/clean-next-output.mjs` are justified extras required to make the documented production build repeatable on Windows without weakening Linux release images. The cleanup verifies the `@rei-os/web` package identity before removing only `.next`.

## 15. Outcomes & Retrospective

- Status: Completed on 2026-07-19.
- Completed milestones: All five milestones completed in order.
- Validation summary: Compose smoke passed 8/8; build and security checks passed; API/web images built and started as non-root runtimes; Helm v3.20.2 lint/render passed with synthetic references and the worker negative gate failed as designed; production-readiness artifact checks passed; two consecutive Windows web builds passed after the symlink-capability fix; final `sh scripts/verify.sh` passed lint, format, typecheck, 92 domain tests, 42 API tests, 24 persistence tests plus one opt-in live-DB skip, 17 observability tests, 13 contract tests, 11 config tests, 6 adapter tests, 4 web unit tests, 18 E2E tests, build, security, zero known dependency vulnerabilities, and 8 smoke checks.
- Changed files summary: Expected Compose, image, CI, Helm, deployment/release/rollback, readiness, environment, decision, and plan files changed. Justified extras repair clean-container package exports/dependencies, document commands, add read-only target smoke, and make Windows builds repeatable without changing Linux standalone release output. Cumulative EP-001–EP-008 work and three pre-existing user-owned `.obsidian` changes remain in the shared worktree.
- Remaining risks: No remote/registry/publishing authority, SBOM/notices, connected dependency probes, Kubernetes admission, staging backup/restore/deploy/smoke/rollback evidence, or production approval exists. No production deployment, migration, image push, Secret creation, provider call, or live outreach occurred.
