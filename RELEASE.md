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

## Source-Control Gate

This checkout is currently on local branch `master` and has no configured Git
remote. No protected default branch, pull request policy, release tag, registry,
or publishing authority can be inferred. A release owner must configure and
verify those controls before publication. Coding agents must not invent a remote,
branch, tag, registry, or credentials.

## Release Candidate Criteria

A release candidate requires:

- Active ExecPlans complete.
- Specs updated.
- `sh scripts/verify.sh` passes.
- Security/dependency checks pass or findings accepted.
- Migration plan documented.
- Deployment notes documented.
- Rollback plan documented.
- Immutable API and web image references selected.
- Registry publication path and provenance owner confirmed.
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

Run the offline safety/package smoke before creating artifacts:

```sh
sh scripts/smoke-test.sh
```

After an authorized staging or production deployment, run the target-aware mode:

```sh
DEPLOYMENT_SMOKE_API_URL=https://api.rei-os.example.invalid \
DEPLOYMENT_SMOKE_WEB_URL=https://rei-os.example.invalid \
sh scripts/smoke-test.sh
```

Target-aware smoke checks only web reachability and API live/readiness endpoints.
It never sends outreach. Replace the reserved example domains with the approved
target; a non-ready dependency fails the release check.

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

## EP-010 Launch Evidence Review (2026-07-19)

Repository verification and local artifact checks pass. This checkout still has no Git remote,
protected release workflow, registry/publishing authority, immutable published artifacts,
release version/changelog, SBOM, notices bundle, staging deployment, target smoke, monitoring
window, rollback drill, or explicit production approval. The release decision is **NO-GO**.

## EP-009 Release Candidate Procedure

1. Confirm all active ExecPlans for the intended release are complete and review
   the working tree for unrelated or sensitive files.
2. Select a semantic pre-release version and create the required changelog,
   migration, third-party/license, and rollback notes. This repository does not
   yet contain a changelog, SBOM, or notices bundle; do not claim those artifacts.
3. Run the repository gates independently so a later command cannot mask an
   earlier failure:

   ```sh
   sh scripts/verify.sh
   sh scripts/production-readiness-check.sh
   docker build --target api-runtime --tag rei-os-api:local .
   docker build --file apps/web/Dockerfile --target web-runtime --tag rei-os-web:local .
   ```

4. Let CI rebuild and scan both images. The current workflow does not publish
   images; registry selection, authentication, signing, SBOM generation, and push
   remain release-owner work.
5. Record the content digests of the approved API and web images. Staging and
   production configuration must use immutable digests or reviewed immutable
   tags—not `latest`.
6. Complete the isolated backup/restore verification in `OPERATIONS.md` and
   attach its checksum, schema version, duration, and result before any migration.
7. If Kubernetes is the selected staging target, run both Helm commands in
   `COMMANDS.md` using synthetic references first, then repeat with approved
   Secret and immutable image references. Helm rendering was not available on the
   EP-009 audit host.
8. Obtain staging authority, deploy through the environment owner's established
   mechanism, run the target-aware smoke command, inspect observability, and
   conduct the rollback drill in `ROLLBACK.md`.
9. Production migration/deployment requires a separate explicit approval after
   the staging evidence is accepted. Never reuse staging or synthetic secrets.

## Current EP-009 Release Status (2026-07-18)

- Local API and web images: built successfully as unprivileged Node images.
- Repository verification/readiness: milestone checks and final EP-009 full
  verification passed on 2026-07-19.
- Image scan: configured in CI and pinned to a reviewed action commit; no registry
  publication is configured.
- Staging/production: not deployed.
- Release blockers: no remote/registry/publishing authority, changelog, SBOM or
  notices bundle, verified staging restore/deploy/smoke/rollback evidence, or
  explicit production approval.
