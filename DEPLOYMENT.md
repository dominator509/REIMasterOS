# Deployment

## Deployment Environments

Supported environments:

1. Local development.
2. Local production-like Docker Compose.
3. Staging.
4. Production self-host Docker Compose for solo/budget mode.
5. Production Kubernetes/Helm for team/enterprise mode.

Deployment profiles:

- `solo-budget.yml`
- `hybrid-cheap.yml`
- `vendor-fast.yml`
- `enterprise-self-host.yml`

## Deployment Architecture

Baseline production architecture:

- Web app container.
- API/BFF container.
- Worker containers.
- AI gateway container.
- PostgreSQL/PostGIS.
- Redis.
- OpenSearch/Elasticsearch.
- Object storage through local filesystem, MinIO, or S3-compatible provider.
- Optional local Hermes/vLLM/Ollama/llama.cpp service.
- Optional external providers through adapter configuration.
- Observability stack through OpenTelemetry, Prometheus, Grafana, Loki, Tempo/Jaeger, and Alertmanager where enabled.

## Build Artifact

Build artifacts must be reproducible:

- Docker images for app/API/workers/services.
- Static assets for web app.
- Migration bundle.
- Helm chart package where applicable.
- Third-party notices bundle.
- SBOM where configured.

## Release Flow

1. Complete active ExecPlan.
2. Run `sh scripts/verify.sh`.
3. Run `sh scripts/production-readiness-check.sh` for release candidates.
4. Update changelog/release notes.
5. Build release artifacts.
6. Deploy to staging.
7. Run staging smoke tests.
8. Verify observability.
9. Confirm rollback path.
10. Deploy to production only with explicit permission.
11. Run post-deploy smoke tests.
12. Monitor dashboards/alerts.

## Deployment Steps

Local production-like deployment steps after infra exists:

```sh
sh scripts/preflight.sh
sh scripts/install.sh
pnpm db:setup
pnpm db:migrate
sh scripts/build.sh
sh scripts/smoke-test.sh
```

Docker Compose production deployment must be documented by EP-009 once Compose files exist. Kubernetes deployment must be documented by EP-009 once Helm charts exist.

## Migration Steps

Migration rules:

1. Back up before production migrations.
2. Verify restore path.
3. Run migration in staging first.
4. Run migration validation tests.
5. For production, stop unless explicit permission exists.
6. Run migration.
7. Verify schema state and application health.
8. Monitor errors.

Default local migration command after EP-003:

```sh
pnpm db:migrate
```

## Rollback Steps

Rollback details are in `ROLLBACK.md`.

Minimum rollback sequence:

1. Stop or pause affected deploy/campaign.
2. Revert application version.
3. Revert config/feature flag if needed.
4. Restore database only if migration/data issue requires it and restore path is approved.
5. Run smoke tests.
6. Monitor errors and data consistency.

## Post-Deploy Smoke Tests

Post-deploy smoke tests must verify:

- Web app reachable.
- API health endpoint reachable.
- Database connection healthy.
- Redis/search/object storage state healthy or intentionally disabled.
- Login/auth path works.
- Synthetic tenant dashboard loads.
- Compliance gate blocks high-risk outbound action without prerequisites.
- Activity event can be written for synthetic action.
- Hidden-prefix sanitizer rejects leakage fixture.
- No live campaign send occurs.

Expected command where implemented:

```sh
sh scripts/smoke-test.sh
```

## Required Approvals

Explicit approval is required for:

- Production deployment.
- Production migration.
- Destructive or irreversible data operation.
- Live campaign launch.
- Live SMS/call/direct-mail/email provider send.
- Enabling outbound AI voice.
- Changing DNC/provider compliance configuration.
- Importing licensed MLS/property/DNC data.
- Bundling or modifying third-party code with unresolved license questions.

## Deployment STOP Conditions

Stop deployment when:

- Required secrets are missing.
- Database backup/restore is not verified.
- Migration is destructive or irreversible without approval.
- Security scan fails with critical issues.
- Compliance gate tests fail.
- Tenant isolation tests fail.
- Smoke tests fail and no approved rollback exists.
- Observability is unavailable for production.
- Release artifact contains secrets, production data, raw DNC data, or hidden prefixes.
- The deployment target is production and explicit permission is absent.

## Production Verification

After production deployment:

- Run post-deploy smoke tests.
- Check error rate.
- Check latency.
- Check worker queues.
- Check provider health/cost center.
- Check DNC/compliance status dashboard.
- Check LLM cache health if AI is enabled.
- Check logs for redaction.
- Confirm alerts are active.
- Record verification outcome in release notes.

## EP-010 Updates (2026-07-09)

### Quick Deploy

```bash
# Solo budget mode (minimal)
docker compose -f infra/compose/solo-budget.yml up -d

# Hybrid cheap mode (API + Web + DB + Redis)
docker compose -f infra/compose/hybrid-cheap.yml up -d

# Vendor fast mode (full services)
docker compose -f infra/compose/vendor-fast.yml up -d

# Enterprise self-hosted (with monitoring)
docker compose -f infra/compose/enterprise-self-host.yml up -d
```

### Build from source

```bash
pnpm install
pnpm build
pnpm test:unit
sh scripts/verify.sh
```
