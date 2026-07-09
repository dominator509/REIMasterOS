# Incident Response Checklist

Detect:

- [ ] Alert, user report, or smoke failure received.
- [ ] Severity assigned.
- [ ] Incident owner assigned.

Triage:

- [ ] Affected tenants/features/timeframe identified.
- [ ] Request IDs/job IDs gathered.
- [ ] Recent deploy/config/migration checked.
- [ ] Security/compliance/data-loss risk assessed.

Mitigate:

- [ ] Stop harmful action.
- [ ] Pause campaigns/providers if needed.
- [ ] Roll back app/config if needed.
- [ ] Disable feature flag if needed.
- [ ] Preserve evidence.

Communicate:

- [ ] Internal status shared.
- [ ] User communication prepared if user impact.
- [ ] Sensitive data excluded from updates.

Resolve:

- [ ] Root cause identified.
- [ ] Fix implemented through ExecPlan or emergency process.
- [ ] Validation run.
- [ ] Production smoke verified.

Verify:

- [ ] Error rate normal.
- [ ] Queue lag normal.
- [ ] Compliance/security checks normal.
- [ ] No new hidden-prefix/raw DNC/tenant leak.

Document:

- [ ] Timeline recorded.
- [ ] Impact recorded.
- [ ] Root cause recorded.
- [ ] Corrective actions assigned.

Follow up:

- [ ] Regression tests added.
- [ ] Alerts/runbooks updated.
- [ ] Postmortem completed for SEV-1/SEV-2.
