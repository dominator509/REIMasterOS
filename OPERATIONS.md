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
