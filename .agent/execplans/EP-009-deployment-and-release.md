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

- [ ] Milestone 1: Create Docker Compose deployment profiles — validation `sh scripts/smoke-test.sh` passed and result recorded.
- [ ] Milestone 2: Add build artifacts and image pipeline — validation `sh scripts/build.sh && sh scripts/security-check.sh` passed and result recorded.
- [ ] Milestone 3: Add Helm/Kubernetes skeleton — validation `sh scripts/production-readiness-check.sh` passed and result recorded.
- [ ] Milestone 4: Finalize release and rollback process — validation `sh scripts/production-readiness-check.sh` passed and result recorded.
- [ ] Milestone 5: Final deployment/release review — validation `git diff --name-only` passed and result recorded.

## 13. Surprises & Discoveries

- 2026-07-07: Docker Compose budget mode is primary; Kubernetes is optional enterprise path.

## 14. Decision Log

- 2026-07-07: Production deploy/migration remains STOP condition.

## 15. Outcomes & Retrospective

- Status: Not started.
- Completed milestones: None yet.
- Validation summary: Not run yet.
- Changed files summary: Not reviewed yet.
- Remaining risks: Execute milestones and update this section before final response.
