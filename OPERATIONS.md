# Operations Runbook

## Local Operations

Local operations are for development and synthetic tests only.

Common commands:

```sh
sh scripts/preflight.sh
sh scripts/install.sh
pnpm dev
pnpm db:setup
pnpm db:migrate
sh scripts/verify.sh
```

Do not use production data locally.

## Staging Operations

Staging should mirror production topology with non-production data and credentials.

Staging requirements:

- Run migrations before app deploy when needed.
- Run smoke tests after deploy.
- Verify logs, metrics, traces, and alerts.
- Exercise rollback before production launch.
- Use synthetic data unless approved test data exists.

## Production Operations

Production operations require explicit permission.

Before production changes:

- Confirm release candidate passed verification.
- Confirm backup and restore path.
- Confirm migration plan.
- Confirm rollback path.
- Confirm observability.
- Confirm compliance gate tests.
- Confirm no live outreach launches accidentally.

## Health Checks

Required health checks after implementation:

- `/health/live`: process is alive.
- `/health/ready`: process can serve traffic.
- `/health/dependencies`: database/cache/search/object storage status with redacted details.
- Worker health: queue connectivity and lag.
- AI gateway health: local/hosted provider route status without keys.
- Compliance health: DNC provider status by verdict availability, not raw data.
- Provider health: per adapter status, quotas, and last error.

## Common Failure Modes

| Failure                        | Likely Cause                                          | First Diagnostic                          | Safe Mitigation                                    |
| ------------------------------ | ----------------------------------------------------- | ----------------------------------------- | -------------------------------------------------- |
| API unhealthy                  | Config, DB, migrations, dependency outage             | Check `/health/dependencies` and logs     | Roll back config/app or restore dependency         |
| Dashboard loads but data empty | API error, auth tenant scope, search projection lag   | Check API logs and network response       | Rebuild projection or fix tenant scope             |
| Search stale                   | Projection worker stopped                             | Check queue lag and worker logs           | Restart worker and rebuild projection              |
| Campaign blocked               | Missing DNC/consent/approval/provider config          | Check compliance verdict/audit            | Resolve prerequisites; do not bypass               |
| Provider sends failing         | Credential, quota, webhook, vendor outage             | Check provider health dashboard           | Switch provider/fallback if configured             |
| Email deliverability issue     | SPF/DKIM/DMARC/provider reputation                    | Run checker and provider logs             | Pause campaign; fix DNS/provider                   |
| Direct mail batch failed       | PDF render, address validation, provider error        | Check batch manifest and artifacts        | Regenerate synthetic/test batch first              |
| Voice latency high             | STT/TTS/LLM route, SIP/LiveKit path, worker lag       | Check voice latency metrics               | Route local Hermes, reduce context, pause outbound |
| AI cache hit rate low          | Prefix drift, model change, schema change, cache cold | Check prefix hash/version metrics         | Run cache warmup worker                            |
| Hidden prefix leakage          | Sanitizer regression                                  | Run sanitizer tests immediately           | Disable AI surface until fixed                     |
| Cross-tenant access alert      | Tenant scoping bug                                    | Stop affected service, inspect logs/tests | Patch, verify, notify per incident process         |

## Troubleshooting

1. Identify affected tenant(s), feature, and time range.
2. Check recent deploy/config/migration changes.
3. Check health endpoints.
4. Check logs with request IDs/job IDs.
5. Check metrics and alerts.
6. Reproduce with synthetic data.
7. Apply smallest safe mitigation.
8. Record incident notes.

## Database Backup and Restore

Before production launch:

- Define backup schedule.
- Define retention.
- Encrypt backups.
- Store backups off primary host.
- Test restore into isolated environment.
- Document restore time objective.

Before production migration:

- Confirm latest backup completed.
- Confirm restore test is recent.
- Stop if restore path is unknown.

### Local and staging backup procedure

PostgreSQL/PostGIS is the authoritative store. Use a custom-format `pg_dump`
from the matching PostgreSQL major version, write the archive outside the
repository, encrypt it at rest, and record the migration version alongside the
archive. A backup is not considered verified merely because `pg_dump` exits
successfully.

For the solo Compose profile, operators run `pg_dump` inside the `postgres`
service and direct the binary archive to an access-controlled path outside this
checkout. Never commit an archive, raw provider payload, contact data, or DNC
evidence.

### Restore verification procedure

1. Provision an isolated PostgreSQL/PostGIS instance with no production network
   access and the same PostgreSQL major version.
2. Create a new empty verification database; never restore over the source.
3. Restore the custom-format archive with `pg_restore --exit-on-error`.
4. Confirm PostGIS is available, `schema_migrations` contains the expected
   version, all canonical tables exist, and tenant-owned tables retain
   `tenant_id` constraints/indexes.
5. Run `sh scripts/test-integration.sh` with only synthetic fixtures against the
   verification database.
6. Record archive checksum, restore start/end time, verifier, schema version,
   and result. Destroy the isolated verification instance only under the
   environment owner's approved cleanup procedure.

Production restore remains an explicit STOP/approval action. Application
rollback is preferred when data is sound; database restore is reserved for a
validated data or migration incident.

### Projection and ephemeral-state recovery

- OpenSearch is derived. Rebuild it from tenant-scoped PostgreSQL records after
  authoritative restore; never restore search in place of PostgreSQL.
- Redis is ephemeral. Recreate cache, queue, and rate-limit state rather than
  treating it as backup authority.
- Object storage is not a search projection. Back up tenant-scoped artifacts
  according to retention policy and verify bucket/key scope independently.
- Until a projection worker is implemented, the supported recovery state is a
  healthy authoritative database with search disabled or empty; no manual SQL
  process may fabricate search authority.

## EP-010 Backup and Restore Evidence Review (2026-07-19)

The backup/restore procedure is documented, but no archive, checksum, migration-version record,
isolated restore, integrity query, duration, or named verifier is present. The opt-in live
PostgreSQL test was not configured during EP-010. Therefore backup and restore readiness is
**BLOCKED** for launch. No production or user database was accessed, migrated, dumped, or restored
by this audit.

## Scheduled Jobs

Scheduled jobs must be documented with:

- Name.
- Purpose.
- Schedule.
- Tenant scope.
- Idempotency key.
- Retry policy.
- Timeout.
- Failure alert.
- Backfill/recovery command.
- Data touched.

Initial expected jobs:

- Search projection rebuild.
- DNC/vendor sync where configured.
- Email/direct-mail/campaign retries.
- Provider webhook reconciliation.
- AI cache warmup.
- Retention cleanup.
- Backup verification.
- Cost telemetry rollup.

## Incident Triage

Severity levels:

- SEV-1: Data loss, cross-tenant leak, compliance bypass, secret exposure, raw DNC leak, unauthorized live campaign, production down.
- SEV-2: Major feature outage, provider sends failing broadly, AI hidden-prefix leak contained, high error rate.
- SEV-3: Degraded performance, isolated tenant issue, non-critical worker lag.
- SEV-4: Minor bug or documentation issue.

Triage steps:

1. Declare severity.
2. Assign incident owner.
3. Mitigate user harm.
4. Preserve evidence.
5. Communicate status.
6. Resolve.
7. Verify.
8. Write postmortem for SEV-1/SEV-2.

## Escalation Rules

Escalate immediately for:

- Cross-tenant data access.
- Secret exposure.
- Raw DNC exposure.
- Unauthorized outreach.
- Compliance gate failure.
- Production data deletion.
- Provider abuse/spam report.
- AI impersonation or binding commitment.
- Legal/licensing uncertainty.

## Maintenance Windows

Production maintenance must:

- Be scheduled when possible.
- Include expected user impact.
- Include rollback plan.
- Include backup verification for migrations.
- Avoid campaign send windows.
- Be communicated to affected users when required.

## Operational Safety Rules

- Do not bypass compliance gates for operations.
- Do not run live campaigns from scripts.
- Do not inspect raw sensitive data unless required for incident response and authorized.
- Do not upload production data to external debugging tools.
- Do not reduce logging redaction to debug.
- Use synthetic reproduction whenever possible.

## Observability Alert Triage

The configs under `infra/otel`, `infra/prometheus`, and `infra/grafana` are self-hosted provisioning skeletons. Before treating any alert as active, an operator must prove the collector, Prometheus rule evaluation, Grafana data source, notification routing, access control, retention, and monitoring owner in the target environment.

| Alert or dashboard signal       | Severity default | First safe check                                      | Immediate action                                                                |
| ------------------------------- | ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| Telemetry collector down        | SEV-2            | Collector health on port 13133 and deployment events  | Restore telemetry; use redacted local service logs while visibility is impaired |
| API error/latency high          | SEV-2/3          | `/health/ready`, route-pattern metrics, recent deploy | Pause risky changes; roll back application/config if correlated                 |
| Worker queue age high           | SEV-2/3          | Queue name, oldest job age, worker health             | Pause new campaign work; never bypass compliance rechecks                       |
| Search projection lag high      | SEV-3            | Authoritative database health and projection worker   | Keep PostgreSQL authoritative; disable stale search or rebuild projection       |
| Tenant-scope denial spike       | SEV-1            | Request/job IDs and authorization audit events        | Stop affected surface and investigate isolation; do not inspect raw tenant data |
| Provider failure spike          | SEV-2/3          | Provider/category status and manual fallback          | Disable affected live adapter and use configured manual fallback                |
| AI sanitizer block              | SEV-1/2          | Sanitizer block count and prefix version/hash only    | Disable the AI surface; never log or display the blocked content                |
| AI cache hit rate below SLO     | SEV-3            | Provider-separated eligible request counts            | Check prefix version drift; do not weaken sanitizer or eligibility rules        |
| Provider estimated cost high    | SEV-3            | Provider/channel estimate and configured threshold    | Pause optional paid routing; preserve required manual/local fallback            |
| Compliance block rate anomalous | SEV-2            | Verdict and reason-code counts, provider health       | Fail closed and investigate; never override DNC/consent policy operationally    |

For every alert, record UTC time, environment, affected service, request/job IDs, metric expression, safe mitigation, owner, and resolution evidence. Do not copy raw prompts, provider payloads, DNC/contact data, credentials, transcripts, or recordings into incident notes. Thresholds in `infra/prometheus/alerts.yml` are conservative baselines and require owner review against measured traffic before production enablement.
