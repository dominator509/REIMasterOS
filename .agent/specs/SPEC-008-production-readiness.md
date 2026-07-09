# SPEC-008: Production Readiness

## Status

Draft baseline.

## Owner

Product/Engineering/Operations/Security.

## Linked Roadmap Phase

Phase 9: Production Readiness.

## Linked ExecPlans

- `EP-009-deployment-and-release.md`
- `EP-010-production-readiness.md`

## User-Visible Goal

The product can be launched safely with reliable functionality, tests, security, privacy, performance, accessibility, observability, deployment, rollback, data protection, documentation, and support paths.

## Non-Goals

- Launching with untested compliance gates.
- Launching without rollback.
- Launching without backups.
- Launching without observability.
- Launching with hidden-prefix leakage risk.
- Launching with raw DNC exposure.
- Launching with mandatory paid providers for core flows.
- Launching production deploys by autonomous agent without explicit permission.

## Terms

- **Launch gate**: Final go/no-go decision.
- **Release candidate**: Build that passed verification and staging smoke.
- **Rollback drill**: Tested rollback in staging/local production-like environment.
- **Accepted risk**: Documented risk with owner/date/mitigation.

## Required Behavior

Before production:

- All release-scope specs implemented or deferred by ADR.
- All release-scope ExecPlans complete.
- Full verify passes.
- Production readiness check passes.
- Security scans pass or findings accepted.
- Compliance tests pass.
- Tenant isolation tests pass.
- Hidden-prefix leakage tests pass.
- Backup/restore verified.
- Staging deployment and smoke tests complete.
- Rollback drill complete.
- Docs current.
- Runbooks current.
- Alerts/dashboards ready.
- Explicit production approval obtained.

## Inputs

- Completed code.
- Test results.
- Security scan results.
- Deployment artifacts.
- Migration plan.
- Backup/restore evidence.
- Observability dashboards/alerts.
- Release notes.
- Risk register.

## Outputs

- Go/no-go decision.
- Production readiness report.
- Release notes.
- Rollback plan.
- Incident/support ownership.
- Accepted risks.

## Error States

- Validation command failure.
- Critical security issue.
- Compliance gate failure.
- Tenant isolation failure.
- Hidden-prefix leakage.
- Backup/restore missing.
- Rollback path missing.
- Observability missing.
- Accessibility blocker.
- Production approval missing.
- Required external license/credential missing.

## Data Rules

- No production data in tests.
- No secrets in repository.
- Backups encrypted and tested.
- Retention documented.
- Data exports comply with suppression/consent.
- Migrations safe or approved.

## Security Rules

- Deny launch for unresolved critical security/compliance issues.
- Production deploy/migration is a STOP condition without explicit permission.
- Live campaign sends not part of production-readiness scripts.
- Hosted AI and high-compliance channels disabled until configured.

## Accessibility Rules

- Critical UI flows must meet baseline accessibility tests.
- Known accessibility gaps must be documented with severity and owner.

## Performance Rules

- Critical flows have documented expectations.
- Obvious bottlenecks documented.
- LLM cache SLOs measured for eligible workflows.
- Search/worker/voice latency targets documented.

## Observability Rules

- Health checks ready.
- Metrics/logs/traces ready.
- Alerts ready.
- Dashboards ready.
- Runbooks linked.
- Post-deploy monitoring window defined.

## Required Tests

- `sh scripts/verify.sh`.
- `sh scripts/production-readiness-check.sh`.
- Staging smoke tests.
- Rollback drill.
- Backup/restore verification.
- Security scan.
- Accessibility smoke tests.
- Performance smoke tests for critical flows.

## Acceptance Criteria

- All readiness checklist items complete or accepted with owner/date.
- No critical unresolved blocker remains.
- Production deployment has explicit permission.
- Rollback and incident response are documented.
- Final report states production readiness status clearly.
