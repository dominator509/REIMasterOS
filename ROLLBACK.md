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

## EP-010 Rollback Verification (2026-07-09)

### Rollback Strategy

1. Database migrations are versioned under `db/migrations/` with sequential IDs
2. Docker Compose profiles allow service-level rollback via image tags
3. Helm charts support `helm rollback`
4. CI/CD pipeline gates prevent unreviewed deployments

### Verified

- `git diff --name-only` shows only expected deployment/docs files
- No destructive operations run by any script unless explicitly requested
- All STOP conditions documented in AGENTS.md remain active
