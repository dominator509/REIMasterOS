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

EP-006 records built-in login success/failure, invalid authentication context, approval lifecycle, authorization denials, and rate-limit denials in the tenant-scoped audit service. Failed-login identifiers are SHA-256 hashes; passwords, tokens, cookies, CSRF/MFA values, and request bodies are never included.

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

The EP-006 recursive redactor applies these rules to nested objects and arrays and additionally removes authorization headers, cookies, API keys, email addresses, phone numbers, and postal-address fields. This in-memory audit baseline is covered by regression tests but is not durable production audit storage.

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

## EP-010 Performance, Accessibility, and Observability Evidence Review (2026-07-19)

| Gate                             | Evidence                                                                                                                 | Status       | Launch implication                                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Structured logging and redaction | Package and API regression tests cover required context, recursive redaction, raw-DNC rejection, and safe error handling | PASS (local) | Durable log transport and target access controls are not configured                                                                        |
| Health endpoints                 | Liveness, readiness, and sanitized dependency projections have tests                                                     | PARTIAL      | Dependency probes report configuration state; they do not establish database, queue, search, storage, worker, AI, or provider connectivity |
| Metrics and traces               | Stable bounded metric contracts, runtime helper logic, and in-memory/no-op collectors are tested                         | PARTIAL      | The application graph has no production exporter/registry binding, so deployed telemetry is not proved                                     |
| Dashboards and alerts            | OTel, Prometheus, Grafana, and alert artifacts pass structural readiness checks                                          | PARTIAL      | No collector scrape, rule evaluation, notification delivery, retention, or monitoring owner is proved                                      |
| Search and worker performance    | Required SLIs and target categories are documented                                                                       | BLOCKED      | No search/worker runtime or representative load benchmark exists                                                                           |
| Voice performance                | Required latency metric and target category are documented                                                               | BLOCKED      | Voice is disabled and no enabled-path measurement exists                                                                                   |
| LLM/cache performance            | Provider-separated cache metric contracts and the 97% eligible-workflow targets are documented                           | BLOCKED      | No gateway or measured eligible warm workload exists; the targets are not achieved evidence                                                |
| Production smoke/uptime          | Target-aware GET-only smoke support exists                                                                               | BLOCKED      | No staging/production URL or post-deploy observation was provided                                                                          |

The monitoring files are deployable skeletons, not a running observability system. Production
readiness requires target evidence and named operational ownership.

## Implemented Baseline (EP-008)

The local baseline is exporter-neutral and self-hostable:

- `StructuredLogger` requires service, environment, version, operation, status, and request/job correlation. It accepts event names rather than free text, recursively redacts sensitive context, drops exception messages, and replaces raw-DNC payloads with a blocked marker.
- `/health/live` reports process state. `/health/ready` fails closed when the required database probe is unavailable. `/health/dependencies` reports database, Redis, search, storage, workers, AI gateway, compliance provider, and adapters without returning URLs, credentials, or vendor payloads.
- `InMemoryMetricsCollector` and `InMemoryTracer` provide deterministic local/test evidence. `NoopMetricsCollector` and `NoopTracer` are the disabled-exporter defaults. No runtime OTLP exporter is enabled merely by these interfaces.
- The OTel, Prometheus, Grafana, and alert files are provisioning skeletons. They are validated structurally by `sh scripts/production-readiness-check.sh`; they are not evidence that a collector or dashboard is deployed.

Stable metric names are:

- API/security: `rei_api_requests_total`, `rei_api_errors_total`, `rei_api_request_duration_ms`, `rei_auth_failures_total`, `rei_rate_limit_denials_total`, `rei_tenant_scope_denials_total`.
- Compliance/campaign/workers: `rei_compliance_verdicts_total`, `rei_compliance_block_reasons_total`, `rei_campaign_events_total`, `rei_worker_jobs_total`, `rei_worker_queue_depth`, `rei_worker_queue_age_seconds`.
- Providers/cost: `rei_provider_calls_total`, `rei_provider_call_duration_ms`, `rei_provider_cost_estimate_usd`, `rei_manual_fallback_total`.
- Search/import/voice: `rei_search_query_duration_ms`, `rei_search_results`, `rei_search_projection_lag_seconds`, `rei_property_imports_total`, `rei_voice_events_total`, `rei_voice_event_duration_ms`.
- AI/cache/safety: `rei_ai_requests_total`, `rei_ai_request_duration_ms`, `rei_ai_cache_requests_total`, `rei_ai_cache_tokens_total`, `rei_ai_prefix_drift_total`, `rei_ai_sanitizer_blocks_total`.

Metric labels are bounded enums, route patterns, provider/model identifiers, status codes, or reason codes. Raw URLs, emails, phone numbers, addresses, tenant payloads, prompts, and arbitrary label keys are rejected. Hermes and DeepSeek cache metrics use the same names with distinct `provider` labels and must be queried separately.
