# Production Readiness

## Definition of Production Readiness

The platform is production-ready only when functional, testing, security, privacy, performance, accessibility, observability, deployment, rollback, data, documentation, and support requirements are satisfied for the target release.

Production readiness is not reached by completing code alone.

## Functional Readiness

- [ ] Core user outcomes work.
- [ ] Investor/acquisitions workflows are default.
- [ ] Licensed-agent/brokerage workflows are optional.
- [ ] Property/owner/contact/list/task/activity workflows work.
- [ ] CSV import works with validation and synthetic tests.
- [ ] Lead list stacking/deduplication works.
- [ ] Compliance gates return `allowed`, `blocked`, and `needs_approval`.
- [ ] DNC is suppression-only.
- [ ] Email supports SMTP/manual fallback.
- [ ] Direct mail supports PDF/CSV manual export.
- [ ] Voice/call workflows are gated and disabled by default where required.
- [ ] AI chat/agent surfaces sanitize output.
- [ ] High-risk/binding actions require approval.
- [ ] Provider fallbacks are configurable.
- [ ] Cost Optimization Center displays provider/fallback/cost state.
- [ ] Activity timeline logs all side-effecting actions.

## Test Readiness

- [ ] `sh scripts/lint.sh` passes.
- [ ] `sh scripts/format-check.sh` passes.
- [ ] `sh scripts/typecheck.sh` passes.
- [ ] `sh scripts/test-unit.sh` passes.
- [ ] `sh scripts/test-integration.sh` passes.
- [ ] `sh scripts/test-e2e.sh` passes.
- [ ] `sh scripts/build.sh` passes.
- [ ] `sh scripts/security-check.sh` passes or accepted findings are documented.
- [ ] `sh scripts/dependency-audit.sh` passes or accepted findings are documented.
- [ ] `sh scripts/smoke-test.sh` passes.
- [ ] Critical regression tests exist.
- [ ] Compliance, tenant isolation, hidden-prefix, and approval-gate tests pass.

## Security Readiness

- [ ] No committed secrets.
- [ ] Secret scanning enabled.
- [ ] Dependency scanning enabled.
- [ ] SAST/container scanning enabled where applicable.
- [ ] Authentication and authorization implemented.
- [ ] RBAC denial tests pass.
- [ ] Tenant isolation tests pass.
- [ ] Provider credentials encrypted.
- [ ] DNC/compliance data protected.
- [ ] Logs redact sensitive data.
- [ ] Rate limits exist for critical endpoints.
- [ ] Webhook signatures verified where supported.
- [ ] AI/MCP tools are scoped and policy-gated.
- [ ] Hidden-prefix leakage tests pass.
- [ ] High-risk actions require approval and 2FA where specified.
- [ ] Third-party notices and license scan generated before commercial release.

## Privacy Readiness

- [ ] Hosted AI optional and disabled in local-only/private mode.
- [ ] Hosted AI payload minimization implemented.
- [ ] Retention policies documented.
- [ ] Data exports respect suppression/consent/compliance constraints.
- [ ] Raw data remains authoritative.
- [ ] Token-compressed context is non-authoritative.
- [ ] Call recordings/transcripts stored securely.
- [ ] Mail proofs/exports tenant-scoped.
- [ ] Provider payload storage tenant-scoped.
- [ ] User deletion/export requirements documented if applicable.

## Performance Readiness

- [ ] Search performance target documented.
- [ ] Worker throughput target documented.
- [ ] Direct-mail batch rendering target documented.
- [ ] Voice latency target documented where voice enabled.
- [ ] LLM gateway overhead measured.
- [ ] DeepSeek eligible warm-request cache-hit >= 97%.
- [ ] Hermes eligible local prefix-reuse >= 97%.
- [ ] Token-hit ratio reported separately.
- [ ] Cache warmup path documented.
- [ ] Load/performance tests or smoke benchmarks exist for critical flows.

## Accessibility Readiness

- [ ] Dashboard uses semantic HTML/components.
- [ ] Keyboard navigation works for primary workflows.
- [ ] Forms have labels, descriptions, errors, and validation states.
- [ ] Buttons/actions have accessible names.
- [ ] Color is not the only status indicator.
- [ ] Compliance blocks and approval states are screen-reader accessible.
- [ ] Real-time updates are not disruptive.
- [ ] Voice console includes transcript text.
- [ ] Map workflows have list/table alternatives.
- [ ] AI chat is keyboard/screen-reader accessible.

## Observability Readiness

- [ ] Structured logs exist.
- [ ] Redaction rules are tested.
- [ ] Health checks exist.
- [ ] Metrics exist for API, workers, search, compliance, campaigns, providers, cost, and AI cache.
- [ ] Tracing exists where applicable.
- [ ] Dashboards exist or are provisioned.
- [ ] Alerts exist or are provisioned.
- [ ] Production smoke tests verify critical paths.
- [ ] Incident runbook exists.

## Deployment Readiness

- [ ] Build artifacts are reproducible.
- [ ] Docker Compose profile works for target release.
- [ ] Helm/Kubernetes manifests validate if target release includes enterprise mode.
- [ ] Environment variables documented.
- [ ] Config validation fails closed.
- [ ] CI/CD builds, tests, scans, and packages artifacts.
- [ ] Staging deploy completed.
- [ ] Post-deploy smoke tests pass.

## Rollback Readiness

- [ ] Application rollback documented.
- [ ] Config rollback documented.
- [ ] Database rollback/restore documented.
- [ ] Feature flag rollback documented where applicable.
- [ ] Rollback drill completed in staging or local production-like environment.
- [ ] Rollback verification checks documented.

## Data Readiness

- [ ] Migrations tested.
- [ ] Backups configured.
- [ ] Restore path tested.
- [ ] Search projection rebuild documented.
- [ ] Object storage backup/retention documented.
- [ ] Tenant-scoped data integrity verified.
- [ ] Synthetic test data only in tests.

## Documentation Readiness

- [ ] `PROJECT_BRIEF.md` current.
- [ ] `ASSUMPTIONS.md` current.
- [ ] `COMMANDS.md` current.
- [ ] `ARCHITECTURE.md` current.
- [ ] Specs current.
- [ ] ExecPlans complete.
- [ ] Security, environment, deployment, operations, observability, release, rollback docs current.
- [ ] Third-party notices generated where required.

## Support Readiness

- [ ] Incident response checklist exists.
- [ ] Operational runbooks exist.
- [ ] Escalation path documented.
- [ ] Known risks documented.
- [ ] Support contact/owner documented before public release.
- [ ] Monitoring owner documented.

## Final Launch Gate

Launch is allowed only when:

- `sh scripts/verify.sh` passes.
- `sh scripts/production-readiness-check.sh` passes.
- No unresolved critical security/compliance/data-loss/tenant-isolation issues remain.
- Rollback path is tested.
- Explicit production deployment permission exists.
- Launch owner records date, scope, risks, and go/no-go decision.

## Checklist

- [ ] Functional readiness complete.
- [ ] Test readiness complete.
- [ ] Security readiness complete.
- [ ] Privacy readiness complete.
- [ ] Performance readiness complete.
- [ ] Accessibility readiness complete.
- [ ] Observability readiness complete.
- [ ] Deployment readiness complete.
- [ ] Rollback readiness complete.
- [ ] Data readiness complete.
- [ ] Documentation readiness complete.
- [ ] Support readiness complete.
- [ ] Final launch gate approved.

## EP-010 Readiness Report (2026-07-19)

### Launch Decision

**NO-GO for staging or production launch.**

Repository-local implementation and verification are green, but production readiness requires
runtime, data-recovery, deployment, performance, accessibility, ownership, and release evidence
that does not exist in this checkout. No production deployment, migration, live provider call,
or live outreach was authorized or attempted.

### Evidence Matrix

| Area                           | Current evidence                                                                                                                                                               | Status                                                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Full repository verification   | `sh scripts/verify.sh` passed after EP-009 and again at EP-010 milestone 1                                                                                                     | PASS (local)                                                                                                                        |
| Unit/integration/acceptance    | 92 domain, 42 API, 24 persistence plus one opt-in live-PostgreSQL skip, 17 observability, 13 contracts, 11 config, 6 adapter, 4 web unit, and 18 render-level E2E tests passed | PASS (local)                                                                                                                        |
| Build and package boundaries   | API and web production builds pass; both local images built and started as non-root processes                                                                                  | PASS (local)                                                                                                                        |
| Security/dependencies          | Local secret-pattern scan passed; dependency audit reported zero known vulnerabilities                                                                                         | PASS (local)                                                                                                                        |
| Compliance and isolation       | Tenant, RBAC, approval, DNC suppression, worker-policy recheck, redaction, and hidden-prefix regressions pass                                                                  | PASS (local)                                                                                                                        |
| Persistence runtime            | PostgreSQL migration/repository contracts exist; the live database test was not configured and API stores remain process-local                                                 | BLOCKED                                                                                                                             |
| Authentication and credentials | Fail-closed sessions/approvals and encrypted-byte repository contract exist; durable identity/session/audit, real MFA, and runtime credential encryption are absent            | BLOCKED                                                                                                                             |
| Webhooks and providers         | Provider interfaces and mocks exist; runtime verifier is deny-all and live adapters/credentials are not configured                                                             | BLOCKED                                                                                                                             |
| Privacy/retention              | Data classes and safety rules are documented                                                                                                                                   | BLOCKED: no retention/deletion enforcement or target evidence                                                                       |
| Accessibility                  | Semantic render-level acceptance passes                                                                                                                                        | PARTIAL: no real-browser, keyboard traversal, contrast, zoom/reflow, or assistive-technology audit                                  |
| Performance                    | SLO/SLI targets and cache telemetry contracts are documented                                                                                                                   | BLOCKED: no representative search, worker, mail, voice, or LLM benchmark                                                            |
| Observability                  | Redacted telemetry contracts and OTel/Prometheus/Grafana/alert skeletons validate structurally                                                                                 | BLOCKED: no runtime exporter, scrape, alert delivery, retention, or monitoring owner                                                |
| Deployment artifacts           | Compose profiles validate; API/web images start; Helm lint/render passed with synthetic references                                                                             | PASS (artifact dry run only)                                                                                                        |
| Deployment target              | Target-aware read-only smoke support exists                                                                                                                                    | BLOCKED: no staging target, DNS/TLS, Secrets, registry artifacts, or target smoke                                                   |
| Backup/restore                 | Procedure is documented                                                                                                                                                        | BLOCKED: no archive, checksum, isolated restore, timing, schema verification, or verifier                                           |
| Rollback                       | Immutable-artifact procedures and checks are documented                                                                                                                        | BLOCKED: no deployed revision/digest pair or completed drill                                                                        |
| Release governance             | Local branch is known                                                                                                                                                          | BLOCKED: no remote, protected workflow, version, changelog, SBOM, notices, publishing authority, launch owner, or explicit approval |

The repository readiness script also passes, but it explicitly validates artifacts only and is
not deployment or runtime proof. The eight offline smoke checks pass; target-aware smoke was not
run because no approved target URLs were configured.

### Launch Blockers

1. Replace process-local API identity, session, audit, and domain stores with durable
   tenant-isolated persistence and prove connected database readiness.
2. Implement an owner-configured MFA/step-up path and runtime encryption/secret-store lifecycle
   for provider credentials.
3. Configure provider-specific webhook verification before enabling any webhook/provider route.
4. Implement and verify retention/deletion controls for protected data classes.
5. Wire runtime metrics/traces/log transport and dependency probes; deploy dashboards/alerts and
   assign monitoring/incident ownership.
6. Measure representative search, worker, direct-mail, voice (if enabled), and LLM/cache
   workloads against approved SLOs.
7. Complete a real-browser and manual accessibility audit for primary workflows.
8. Produce an encrypted backup, verify an isolated restore, and record checksum, schema version,
   duration, integrity checks, and verifier.
9. Select a staging target, immutable published artifacts, DNS/TLS, owner-managed Secrets, and
   run connected readiness plus target smoke.
10. Complete a staging rollback drill using recorded current/previous artifacts and database
    compatibility evidence.
11. Configure the source remote/protected workflow and release governance; generate versioned
    release notes/changelog, SBOM, third-party notices, and required license review.
12. Assign a named launch owner, support/escalation contacts, monitoring owner, and explicit
    go/no-go approval.

### Accepted Risks

None are formally accepted. Repository role labels such as Platform or Operations are not
evidence of a named owner, approval date, mitigation commitment, or review date.

### Production-Readiness Criteria

- Functional/test/security repository gates: **passed locally for implemented scope**.
- Privacy/performance/accessibility/observability/deployment/rollback/data/support gates:
  **partial or blocked**.
- Explicit deployment permission: **absent**.
- Final launch gate: **failed (NO-GO)**.

The codebase is a validated local development/release-artifact baseline, not a production-ready
deployment.
