# Production Readiness Checklist

Functionality:

- [ ] Core user outcomes work.
- [ ] Investor/acquisitions mode default.
- [ ] Licensed-agent features optional.
- [ ] Provider fallbacks available.
- [ ] Compliance gates cannot be bypassed.
- [ ] High-risk approvals enforced.
- [ ] AI output sanitized.

Tests:

- [ ] Lint passes.
- [ ] Format check passes.
- [ ] Typecheck passes.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] E2E tests pass.
- [ ] Build passes.
- [ ] Smoke tests pass.
- [ ] Critical regression tests pass.

Security:

- [ ] No secrets.
- [ ] Dependency audit reviewed.
- [ ] Secret scan/SAST/container scan configured where applicable.
- [ ] Auth/RBAC correct.
- [ ] Tenant isolation tests pass.
- [ ] DNC raw data protected.
- [ ] Hidden-prefix leakage tests pass.
- [ ] Provider credentials encrypted.

Privacy:

- [ ] Hosted AI optional.
- [ ] Payload minimization documented.
- [ ] Retention policies documented.
- [ ] Exports respect compliance constraints.
- [ ] Sensitive artifacts tenant-scoped.

Performance:

- [ ] Critical load expectations documented.
- [ ] Search/index plan verified.
- [ ] Worker throughput expectations documented.
- [ ] LLM cache SLOs measured for eligible workflows.
- [ ] Cache/token metrics separated correctly.

Accessibility:

- [ ] Keyboard navigation considered/tested.
- [ ] Semantic structure considered/tested.
- [ ] Color-only communication avoided.
- [ ] Compliance/approval states accessible.
- [ ] Map workflows have alternatives.

Observability:

- [ ] Structured logs.
- [ ] Redaction tests.
- [ ] Health checks.
- [ ] Metrics.
- [ ] Dashboards/alerts.
- [ ] Runbooks.

Deployment:

- [ ] Deployment process documented.
- [ ] Environment variables documented.
- [ ] Release checklist exists.
- [ ] Post-deploy smoke test exists.

Rollback:

- [ ] Application rollback documented.
- [ ] Config rollback documented.
- [ ] Database restore path documented.
- [ ] Rollback drill completed.

Backups:

- [ ] Backup schedule documented.
- [ ] Restore tested.
- [ ] Backup encryption documented.

Docs/support:

- [ ] Docs current.
- [ ] Incident checklist exists.
- [ ] Support/escalation owner documented.
- [ ] Known risks documented.
