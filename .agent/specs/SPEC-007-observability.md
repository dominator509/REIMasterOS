# SPEC-007: Observability

## Status

Draft baseline.

## Owner

DevOps/Observability.

## Linked Roadmap Phase

Phase 7: Observability and Operations.

## Linked ExecPlans

- `EP-008-observability-and-operations.md`
- `EP-010-production-readiness.md`

## User-Visible Goal

Operators can detect, debug, and resolve issues with API, data, search, workers, providers, compliance gates, AI routes, cache health, costs, and campaigns without exposing sensitive data.

## Non-Goals

- Logging secrets or raw DNC data.
- Logging hidden prompts/prefixes.
- Storing raw production payloads in ordinary logs.
- Relying on a single paid observability vendor.
- Blocking self-hosted observability.

## Terms

- **SLI**: Service-level indicator.
- **SLO**: Service-level objective.
- **Trace**: Distributed request/job flow.
- **Redacted log**: Structured log with sensitive fields removed.
- **Provider health**: Adapter state, error rate, quota, latency, and cost signals.
- **Cache SLO**: LLM prefix/cache participation and hit rate for eligible workflows.

## Required Behavior

Observability must include:

- Structured logs.
- Redaction.
- Metrics.
- Traces where practical.
- Health checks.
- Dashboards.
- Alerts.
- Smoke tests.
- Runbooks.

Required product dashboards:

- LLM cache health.
- AI cost/token savings.
- RTK/token compression savings if implemented.
- Campaign delivery.
- Channel worker health.
- DNC/compliance status.
- Voice call latency/events.
- Property ingestion status.
- Provider cost center.
- Search latency.
- API/worker health.

## Inputs

- API requests.
- Worker jobs.
- Provider adapter calls.
- Compliance verdicts.
- AI/LLM requests.
- Search queries.
- Health check probes.
- Deployment/release events.

## Outputs

- Logs.
- Metrics.
- Traces.
- Health responses.
- Alerts.
- Dashboard panels.
- Runbook links.
- Smoke test results.

## Error States

- Missing telemetry.
- Redaction failure.
- Health check failure.
- Metric cardinality explosion.
- Alert noise.
- Observability provider unavailable.
- Cache SLO violation.
- Hidden-prefix sanitizer block spike.
- Provider health failure.

## Data Rules

- Use tenant ID and IDs, not raw PII.
- Hash/redact contact points.
- Do not log raw DNC, secrets, hidden prefixes, raw prompts, full transcripts, call recordings, or provider credentials.
- Store raw provider payloads only in tenant-scoped secure object storage where required.

## Security Rules

- Observability access restricted by role.
- Sensitive dashboards restricted.
- Logs/traces must not leak credentials.
- Incident data access audited where possible.

## Accessibility Rules

- Dashboards should have textual summaries or tables for critical charts.
- Alert messages should be concise and readable.
- Status colors must have text labels.

## Performance Rules

- Telemetry overhead must be minimal.
- Avoid high-cardinality labels such as raw addresses, phone numbers, emails, prompt text, or full URLs with secrets.
- Sampling may be used for high-volume traces but not for security/compliance events.

## Observability Rules

This spec is itself the observability requirement source. `OBSERVABILITY.md` provides operational details.

## Required Tests

- Log redaction test.
- Health endpoint test.
- Metrics exposure test.
- Compliance metric test.
- LLM cache metric test.
- Provider health metric test.
- Smoke test verifies health.
- Alert rule syntax validation where configured.

## Acceptance Criteria

- Required logs/metrics/health checks exist.
- Redaction tests pass.
- LLM cache metrics separated by provider.
- Compliance status observable without raw DNC data.
- Smoke tests pass.
- Dashboards/alerts documented or provisioned.
