# Observability

## Logging Strategy

Use structured logs. Every service must include:

- `timestamp`
- `level`
- `service`
- `environment`
- `version`
- `request_id` or `job_id`
- `tenant_id` where applicable
- `user_id` where applicable
- `route` or `operation`
- `status`
- `duration_ms`
- `error_code` when applicable

Workers must include:

- `queue`
- `job_type`
- `attempt`
- `max_attempts`
- `idempotency_key`
- `provider`
- `channel`

LLM gateway must include:

- `llm_route`
- `provider`
- `model`
- `prefix_hash`
- `prefix_version`
- `prompt_cache_hit_tokens`
- `prompt_cache_miss_tokens`
- `token_hit_ratio`
- `request_cache_hit`
- `estimated_cost_savings`

Do not log hidden prefix text or raw prompts in ordinary logs.

## Redaction Rules

Redact:

- Secrets and tokens.
- Raw DNC data.
- Contact details beyond hashes/IDs.
- Call recordings.
- Full transcripts unless stored in secure transcript store.
- Raw provider payloads unless stored in secure tenant-scoped object storage.
- Hidden prefixes and compiled prompts.
- Payment/billing sensitive fields.

## Metrics

Required metric categories:

API:

- Request count.
- Error count.
- Latency histogram.
- Auth failures.
- Rate-limit denials.
- Tenant-scope denials.

CRM/property:

- Property import count.
- Import validation failures.
- Search latency.
- Search result count.
- Projection lag.
- Lead dedupe/list stacking duration.

Compliance:

- Compliance verdict counts by `allowed`, `blocked`, `needs_approval`.
- Block reason counts.
- Opt-out/unsubscribe count.
- DNC provider health state.
- High-risk approval count.

Campaign/channel:

- Email send attempts/success/failure/suppression.
- Direct-mail render/send/export count.
- Voice call attempts/events/latency/transfer/opt-out.
- SMS attempts/suppression when enabled.
- Provider webhook count/failure.
- Queue depth and age.

AI/LLM:

- Local Hermes request count/latency.
- DeepSeek request count/latency.
- Separate cache metrics for Hermes and DeepSeek.
- Eligible workflow cache participation.
- Request-level cache hit rate.
- Prompt-cache hit/miss tokens.
- Token-hit ratio.
- Prefix drift count.
- Sanitizer block count.
- Hosted LLM cost estimate.
- Token compression savings.

Cost:

- Spend estimate by provider/channel/tenant.
- Manual fallback usage.
- Provider health.
- Quota usage.

## Traces

Use OpenTelemetry where practical.

Trace boundaries:

- UI request to API.
- API to repository.
- API to queue publish.
- Worker job execution.
- Provider adapter call.
- MCP Gateway tool execution.
- LLM gateway routing.
- Search query.
- Direct-mail PDF generation.
- Voice event processing.

Do not include secrets, raw DNC data, hidden prefixes, or raw prompts in spans.

## Health Checks

Required endpoints or equivalent:

- Liveness.
- Readiness.
- Dependency health.
- Worker health.
- AI gateway route health.
- Compliance provider health.
- Provider adapter health.
- Search projection health.

Health responses must avoid secrets and raw provider payloads.

## Uptime Checks

Production uptime checks must monitor:

- Web dashboard.
- API readiness.
- Auth path.
- Worker queue lag.
- Database connectivity.
- Search projection lag.
- Object storage availability.
- AI gateway if enabled.
- Provider health if live providers enabled.

## Dashboards

Required dashboards:

- System overview.
- API health and latency.
- Worker queues.
- Property ingestion/search.
- Campaign delivery.
- DNC/compliance status.
- Provider cost center.
- AI cost/token savings.
- LLM cache health.
- RTK/token compression savings if implemented.
- Voice call latency/events.
- Error budget and incidents.

## Alerts

Minimum alerts:

- API high error rate.
- API high latency.
- Worker queue age above threshold.
- Database unavailable.
- Search unavailable or projection lag high.
- Object storage unavailable.
- Compliance gate service failing.
- DNC provider unavailable when required.
- Provider send failure spike.
- Hidden-prefix sanitizer block spike.
- Hidden-prefix leakage test failure.
- LLM cache hit rate below SLO for eligible workflows.
- Hosted LLM spend above threshold.
- Cross-tenant access denial spike.
- Secret scan failure in CI.
- Backup failure.
- Smoke test failure after deploy.

## Service-Level Indicators

Core SLIs:

- API availability.
- API p95 latency.
- Search p95 latency.
- Worker queue age.
- Compliance verdict latency.
- Campaign event processing success.
- Voice event p95 latency where voice enabled.
- LLM gateway p95 latency.
- DeepSeek eligible warm-request cache-hit rate.
- Hermes eligible prefix-reuse rate.
- Hidden-prefix leakage count.
- Tenant-scope violation count.

## Service-Level Objectives

Initial SLO targets before real load testing:

- DeepSeek eligible warm-request cache-hit: >= 97%.
- Hermes/local eligible prefix-reuse: >= 97%.
- Hybrid workflow cache participation for eligible workflows: >= 97%.
- Hidden-prefix leakage: 0.
- Compliance gate bypass: 0.
- Cross-tenant data leak: 0.
- Production smoke test success after deploy: 100%.

Do not promise universal 97% token-hit ratio for all chat/voice turns. Token-hit ratio depends on stable prefix size versus dynamic payload size and must be reported separately.

## Debugging Production Issues

1. Identify request ID, job ID, tenant ID, and timeframe.
2. Check dashboards for error/latency/queue/provider/cache anomalies.
3. Inspect redacted structured logs.
4. Inspect traces without sensitive payloads.
5. Reproduce with synthetic data.
6. Mitigate safely.
7. Record incident if user impact, security risk, compliance risk, or production data risk exists.

## Observability Acceptance Criteria

Observability is acceptable when:

- Logs are structured and redacted.
- Health checks exist.
- Critical metrics exist.
- LLM cache metrics are separated by provider.
- Compliance verdicts are observable without raw DNC data.
- Provider health/cost is visible.
- Dashboards exist or are specified.
- Alerts exist or are specified.
- Smoke tests verify observability-critical paths.
