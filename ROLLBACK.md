# Rollback Process

## Rollback Triggers

Rollback when any of these occur:

- Production outage.
- Severe error-rate increase.
- Cross-tenant data access.
- Secret exposure.
- Raw DNC exposure.
- Compliance gate bypass.
- Unauthorized live outreach.
- Hidden-prefix leakage to users.
- Destructive migration issue.
- Unacceptable provider send failure.
- Critical security vulnerability introduced.
- Failed post-deploy smoke test with user impact.

## Rollback Decision Owner

The release owner or incident owner decides rollback. For production data, compliance, security, or legal risk, stop automated action and escalate according to `OPERATIONS.md`.

## Rollback Types

- Application rollback: deploy previous known-good image/version.
- Config rollback: revert environment variables, feature flags, provider route settings.
- Database rollback: use down migration or restore from backup.
- Feature flag rollback: disable feature or provider path.
- Provider rollback: switch to manual/self-host fallback or pause sends.
- AI route rollback: disable hosted route, revert prompt prefix version, or switch to local-only mode.

## Application Rollback

1. Identify previous known-good version.
2. Stop new deploy rollout.
3. Deploy previous artifact.
4. Keep database unchanged unless schema/data issue requires database rollback.
5. Run smoke tests.
6. Monitor errors and queues.

## Database Rollback

Database rollback is high risk.

1. Stop writes if needed.
2. Confirm backup availability.
3. Confirm restore target.
4. Determine whether down migration is safe.
5. Get explicit approval for production restore/destructive rollback.
6. Execute rollback/restore.
7. Verify data integrity.
8. Rebuild search projections if needed.
9. Run smoke tests.

## Config Rollback

1. Identify config change.
2. Revert to previous known-good values.
3. Restart/reload affected services.
4. Verify health.
5. Run targeted smoke tests.

## Feature Flag Rollback

Disable:

- SMS.
- Outbound AI voice.
- Hosted LLM route.
- Campaign launch.
- Specific provider adapter.
- Experimental negotiation automation.
- New search projection path.

Feature flag rollback must leave audit logs intact.

## Verification After Rollback

Verify:

- Health endpoints.
- Login/auth path.
- Synthetic tenant dashboard.
- Compliance gate blocks unsafe action.
- No new live sends.
- Queue lag stabilizes.
- Error rate returns to baseline.
- Search projections are consistent.
- Hidden-prefix sanitizer tests pass where AI affected.

## Communication

For incidents with user impact:

- State what happened.
- State affected scope.
- State mitigation.
- State whether data/compliance risk exists.
- Provide next update time in human-run incident process.
- Do not expose secrets, raw DNC data, or sensitive details.

## Postmortem

Required for SEV-1/SEV-2.

Include:

- Timeline.
- Impact.
- Root cause.
- Detection.
- Response.
- What worked.
- What failed.
- Corrective actions.
- Owners and deadlines.
- Tests/alerts/docs added.

## EP-010 Rollback Evidence Review (2026-07-19)

Rollback commands and acceptance criteria are documented, and Helm/Compose templates received
local structural validation. No previous/current published digest pair, deployed revision,
compatible database state, backup checksum, target smoke result, monitoring evidence, timing, or
rollback owner exists. Consequently no rollback drill has passed. Performing a staging or
production rollback without environment authority would exceed this audit; production rollback
or restore remains an explicit STOP condition.

## EP-009 Immutable-Artifact Rollback Drill

Before a release, record these values outside the repository in the environment's
release record:

- current and previous API image digests;
- current and previous web image digests;
- Compose project/profile or Helm release, namespace, and revision;
- database schema version before and after migration;
- backup checksum and isolated restore-verification result;
- config/Secret version and rollback owner;
- smoke and monitoring evidence before and after the drill.

### Compose application rollback

1. Confirm the database is sound. If it is, do not restore it.
2. Set `API_IMAGE` and `WEB_IMAGE` in the operator-owned release environment to
   the recorded previous immutable references.
3. With explicit environment-owner authority, reconcile only the `api` and `web`
   services in `infra/compose/enterprise-self-host.yml`:

   ```sh
   docker compose --env-file <operator-env-file> \
     -f infra/compose/enterprise-self-host.yml \
     up -d --no-deps api web
   ```

   Do not remove volumes or recreate authoritative data services.

4. Run the target-aware smoke command from `RELEASE.md`, verify error/latency
   telemetry, and record the result.

### Helm application rollback

1. Inspect Helm history and confirm the prior revision uses the recorded images
   and compatible configuration:

   ```sh
   helm history <release> --namespace <namespace>
   ```

2. With explicit environment-owner authority, roll back to that revision using
   the recorded release, namespace, and revision:

   ```sh
   helm rollback <release> <revision> \
     --namespace <namespace> \
     --wait \
     --timeout 10m
   ```

   Do not add `--force` or alter Secret values during the first rollback attempt.

3. Wait for API/web readiness, run the target-aware smoke command, verify
   monitoring, and record the revision and result.

### Migration/data incident

The repository currently provides forward-only `VNNN__*.sql` migrations and does
not prove a safe down migration. Never improvise reverse SQL. If the old
application is schema-compatible, prefer application rollback while leaving the
database unchanged. Otherwise pause writes and follow the approved isolated
restore procedure in `OPERATIONS.md`; production restore is destructive/high risk
and remains a STOP condition requiring explicit approval.

### Drill acceptance

A rollback drill passes only when the prior immutable application artifacts are
running, both deployed smoke URLs pass, dependency readiness is green, no
compliance/tenant-isolation alerts fire, and the release record contains timing
and evidence. EP-009 did not deploy an environment, so no staging or production
rollback drill is claimed.
