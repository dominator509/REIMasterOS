# Release Process

## Release Types

- Development snapshot: local or internal testing only.
- Release candidate: staging-ready build with complete validation.
- Patch release: bug/security fix with no major behavior changes.
- Minor release: new compatible features.
- Major release: breaking changes, migration changes, or deployment topology changes.

## Versioning

Use semantic versioning after the first public release:

```text
MAJOR.MINOR.PATCH
```

Before public release, use date or pre-release tags such as:

```text
0.1.0-alpha.1
0.1.0-rc.1
```

## Changelog

Every release candidate must include:

- Added.
- Changed.
- Fixed.
- Security.
- Migration notes.
- Rollback notes.
- Known risks.
- Third-party/license notes.

## Branch Strategy

Default branch: `main`.

Recommended flow:

1. Feature branch per ExecPlan.
2. Pull request with ExecPlan link.
3. CI verification.
4. Review.
5. Merge to `main`.
6. Release branch/tag for release candidate.

Coding agents must not invent branch names or merge strategies if repository policy differs; update this file from repository evidence.

## Release Candidate Criteria

A release candidate requires:

- Active ExecPlans complete.
- Specs updated.
- `sh scripts/verify.sh` passes.
- Security/dependency checks pass or findings accepted.
- Migration plan documented.
- Deployment notes documented.
- Rollback plan documented.
- Staging deploy ready.

## Release Checklist

- [ ] Version selected.
- [ ] Changelog updated.
- [ ] Third-party notices generated where required.
- [ ] SBOM generated where configured.
- [ ] Release artifacts built.
- [ ] Migrations reviewed.
- [ ] Secrets/config reviewed.
- [ ] Staging deployed.
- [ ] Staging smoke tests passed.
- [ ] Observability verified.
- [ ] Rollback path verified.
- [ ] Production deployment explicitly approved.
- [ ] Post-deploy smoke tests passed.
- [ ] Monitoring window completed.

## Smoke Tests

Run after staging and production deploys:

```sh
sh scripts/smoke-test.sh
```

Smoke tests must not send live outreach by default.

## Approvals

Explicit approval is required for:

- Production deployment.
- Production migration.
- Live campaign sends.
- Enabling high-compliance channels.
- Enabling outbound AI voice.
- Importing licensed data.
- Bundling third-party code with unresolved license questions.

## Release Notes

Release notes must include:

- User-visible changes.
- Compliance-related changes.
- Security-related changes.
- Deployment/migration instructions.
- Known limitations.
- Rollback notes.
- Provider-specific notes.
- Cost/AI-routing implications where relevant.

## Post-Release Monitoring

Monitor for at least the defined release window:

- API errors and latency.
- Worker queue lag.
- Search projection lag.
- Compliance verdict failures.
- Provider send failures.
- Hidden-prefix sanitizer blocks.
- LLM cache SLOs.
- Hosted LLM spend.
- Tenant isolation alerts.
- Smoke test failures.

## EP-010 Release Notes (v0.0.0)

### Artifacts

- `Dockerfile` — API service container
- `apps/web/Dockerfile` — Web dashboard container
- `infra/compose/` — 4 deployment profiles
- `infra/helm/` — Kubernetes skeleton
- `.github/workflows/ci.yml` — CI pipeline

### Verification

```bash
sh scripts/verify.sh  # Full pipeline
pnpm smoke            # Smoke test
sh scripts/production-readiness-check.sh  # Readiness audit
```
