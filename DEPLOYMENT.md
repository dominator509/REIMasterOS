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

The migration runner records each applied version in `schema_migrations` and
skips it on later runs. Local port collisions may be resolved with the
documented `POSTGRES_HOST_PORT` override; container traffic remains on 5432.
Before staging or production migration, complete the isolated restore
verification procedure in `OPERATIONS.md` and attach its checksum, schema
version, duration, and result to the release record.

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

Offline safety/package smoke before deployment:

```sh
sh scripts/smoke-test.sh
```

Post-deploy target smoke (replace reserved domains with the explicitly approved
target):

```sh
DEPLOYMENT_SMOKE_API_URL=https://api.rei-os.example.invalid \
DEPLOYMENT_SMOKE_WEB_URL=https://rei-os.example.invalid \
sh scripts/smoke-test.sh
```

The target mode performs only read-only live/readiness and web-root requests; it
does not launch campaigns or send through providers.

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

## Build from Source

```bash
sh scripts/install.sh
sh scripts/build.sh
sh scripts/verify.sh
```

## EP-010 Deployment Evidence Review (2026-07-19)

The API and web production images were built independently and started locally as non-root
processes during EP-009. The enterprise Helm chart was checksum-verified, linted, and rendered
with synthetic image/Secret references. Those checks are an artifact dry run only.

No staging or production environment was deployed. Kubernetes admission, immutable registry
references, target configuration, DNS/TLS, real Secret injection, database migration, connected
readiness, and target-aware smoke remain unproved. Production deployment was neither authorized
nor attempted.

## EP-009 Compose Profile Contract (2026-07-18)

Compose files are deployment templates, not proof of a running environment:

- `solo-budget.yml` starts PostgreSQL and Redis for the default local core. `full-data`, `app`, `local-ai`, and `observability` profiles opt into MinIO/OpenSearch, API/web, a local LLM sidecar, and the monitoring skeleton. No paid provider is required. Local data-service credentials are synthetic defaults and must never be reused outside local development.
- `hybrid-cheap.yml` builds API/web with self-hosted PostgreSQL/Redis and an optional `local-ai` profile. Staging URLs, CORS, database/Redis passwords, session secret, and encryption key are required from a non-committed environment source.
- `vendor-fast.yml` enables self-hosted data services and accepts optional SMTP/provider variables. Missing vendor credentials leave provider paths disabled/manual; they are not launch prerequisites for core CRM behavior.
- `enterprise-self-host.yml` consumes immutable API/web image references and owner-supplied secrets. Infrastructure image variables may use local defaults for template evaluation, but release owners must replace mutable tags with approved tags or digests before staging/production.

The repository has no worker or AI-gateway runtime directories, so these profiles do not fabricate containers for them. The local LLM entry is an optional sidecar only and does not enable the application AI route. Production deployment, migration, secret creation, DNS/TLS, provider enablement, and live outreach remain explicit owner actions and STOP conditions.

The default local data command remains:

```sh
pnpm db:setup
```

Opt-in application and observability profiles require a non-committed Compose environment file with the documented values before use. EP-009 validates profile structure and images but does not execute `up`, migrate a database, or deploy any target.

## EP-009 Helm Chart Contract (2026-07-18)

`infra/helm` is the optional enterprise self-host chart. Budget and solo users do
not need Kubernetes. The chart renders only the API and web runtimes that exist in
this repository and provides:

- deployments and ClusterIP services with non-root, read-only-root-filesystem
  security contexts and bounded resource requests/limits;
- API liveness and readiness probes at `/health/live` and `/health/ready`;
- a ConfigMap containing documented non-secret runtime configuration;
- references to an operator-created Secret for `DATABASE_URL`,
  `SESSION_SECRET`, and `ENCRYPTION_KEY`—never literal secret values;
- an optional ingress with separate web and API hosts;
- required image tags or digests instead of a deployable `latest` default.

The `workers.enabled` value defaults to `false` and deliberately fails rendering
when enabled because there is no worker runtime to package. PostgreSQL, Redis,
object storage, search, local AI, TLS/certificates, DNS, Secret creation,
migrations, backups, and observability backends remain operator-owned platform
dependencies. Run the Helm lint/template commands in `COMMANDS.md` before staging.
Helm was not installed system-wide on the EP-009 audit host. A checksum-verified
temporary Helm v3.20.2 binary linted the chart and rendered API/web manifests with
synthetic references; the repository readiness script separately validates chart
structure. Kubernetes admission and staging rollout remain unproved.
