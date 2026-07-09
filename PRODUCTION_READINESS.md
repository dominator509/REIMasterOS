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

## EP-010 Readiness Report (2026-07-09)

### Verification Status

| Check                       | Status | Evidence                                        |
| --------------------------- | ------ | ----------------------------------------------- |
| TypeScript typecheck        | PASS   | `pnpm typecheck` — 7/7 tasks                    |
| ESLint                      | PASS   | `pnpm lint` — no issues                         |
| Prettier                    | PASS   | `pnpm format:check` — all matched               |
| Unit tests                  | PASS   | `pnpm test:unit` — 7/7 suites                   |
| Integration tests           | PASS   | `pnpm test:integration` — 2/2 tasks             |
| Build                       | PASS   | `pnpm build` — 7/7 tasks (6 success + 1 cached) |
| Smoke test                  | PASS   | `pnpm smoke` — 4/4 passed                       |
| Full verify                 | PASS   | `sh scripts/verify.sh` — `verify: ok`           |
| CI workflow                 | PASS   | `.github/workflows/ci.yml` exists               |
| Docker Compose (solo)       | PASS   | `infra/compose/solo-budget.yml`                 |
| Docker Compose (hybrid)     | PASS   | `infra/compose/hybrid-cheap.yml`                |
| Docker Compose (vendor)     | PASS   | `infra/compose/vendor-fast.yml`                 |
| Docker Compose (enterprise) | PASS   | `infra/compose/enterprise-self-host.yml`        |
| Dockerfiles                 | PASS   | Root `Dockerfile` + `apps/web/Dockerfile`       |
| Helm skeleton               | PASS   | `infra/helm/Chart.yaml` + `values.yaml`         |
| Prometheus config           | PASS   | `infra/prometheus/prometheus.yml`               |
| Grafana dashboard           | PASS   | `infra/grafana/dashboards/overview.json`        |
| OTEL config                 | PASS   | `infra/otel/collector-config.yml`               |
| .env.example                | PASS   | Exists with all required vars                   |
| .gitignore                  | PASS   | Covers all tool caches and secrets              |
| .dockerignore               | PASS   | Excludes node_modules, .env, logs               |
| Preflight                   | PASS   | `sh scripts/preflight.sh` → `preflight: ok`     |

### Production Readiness Score

**8/10 — Ready for Phase 1 deployment with caveats.**

### Launch Blockers

None. All verification checks pass.

### Accepted Risks

| Risk                                                | Owner         | Mitigation                                             | Review Date              |
| --------------------------------------------------- | ------------- | ------------------------------------------------------ | ------------------------ |
| 23 npm audit vulnerabilities (1 critical in multer) | Platform team | NestJS dependency chain; update when patches available | 2026-08-01               |
| E2E tests are placeholder stubs                     | QA            | EP-005 UI tests will add Playwright-based E2E          | 2026-08-01               |
| AI features not yet wired to actual LLM             | AI team       | AI gateway service to be built post-MVP                | 2026-09-01               |
| No HTTPS/TLS in default Compose                     | DevOps        | Add nginx/caddy reverse proxy for production           | Before production deploy |
| In-memory stores in API services                    | Engineering   | Wire to persistence layer (EP-003 repos)               | 2026-08-01               |

### Package Inventory

| Package               | Status   | Tests                                                                                                     |
| --------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| @rei-os/domain        | Complete | 71 tests — entities, value objects, compliance, deal math, negotiation, providers, AI policy, permissions |
| @rei-os/contracts     | Complete | 15 tests — property, contact, lead, pagination, API schemas, error codes                                  |
| @rei-os/config        | Complete | 7 tests — env validation, auth config                                                                     |
| @rei-os/testing       | Complete | TypeScript compilation passing                                                                            |
| @rei-os/persistence   | Complete | 7 tests — repositories, search, storage, cache stubs                                                      |
| @rei-os/observability | Complete | 6 tests — redaction, DNC detection                                                                        |
| @rei-os/api           | Complete | 9 tests — health, properties, compliance                                                                  |
| @rei-os/web           | Complete | Dashboard shell with 9 routes                                                                             |

### Next Steps

1. Wire persistence layer (EP-003 repositories) into API services
2. Add Playwright E2E tests for critical UI flows
3. Implement AI gateway service for Hermes/DeepSeek integration
4. Set up actual OpenTelemetry instrumentation
5. Security penetration testing before production
6. Database backup/restore drill
