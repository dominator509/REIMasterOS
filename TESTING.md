# Testing Strategy

## Test Pyramid

Default test pyramid:

1. Many unit tests for domain, policies, validation, calculators, prompt compilation, sanitizer logic, and provider-independent behavior.
2. Fewer integration tests for repositories, migrations, queues, adapter contracts, API flows, and worker behavior.
3. Focused E2E/acceptance tests for primary user workflows and critical compliance gates.
4. Targeted load/performance tests for search, campaign workers, voice events, and LLM gateway cache behavior.
5. Security and accessibility tests included in standard verification before production readiness.

## Unit Test Rules

Unit tests must:

- Avoid databases, networks, provider SDKs, live LLMs, real DNC data, real property data, and real credentials.
- Use synthetic fixtures only.
- Cover domain entities and value objects.
- Cover compliance verdicts: `allowed`, `blocked`, and `needs_approval`.
- Cover high-risk action approval classification.
- Cover deal math, MAO, offer ladder, and negotiation-safety warnings.
- Cover deterministic prompt compilation and hidden-prefix sanitizer behavior.
- Cover token-compression policy decisions without relying on RTK unless licensed and approved.

Expected command:

```sh
sh scripts/test-unit.sh
```

## Integration Test Rules

Integration tests must:

- Use local disposable services from Compose or test containers.
- Use synthetic tenant data.
- Verify migrations apply idempotently.
- Verify repositories enforce tenant scope.
- Verify search projections are derived and rebuildable.
- Verify object storage keys are tenant-scoped.
- Verify provider adapters through mocked/local providers.
- Verify queues/workers recheck compliance before side effects.

Expected command:

```sh
sh scripts/test-integration.sh
```

## E2E / Acceptance Test Rules

E2E tests must cover:

- Login and tenant selection once auth exists.
- Property search/listing with empty and populated states.
- Lead CSV import preview, validation, and commit.
- Lead list stacking/deduplication.
- Property/owner/contact detail view with universal activity timeline.
- Task/follow-up creation and overdue display.
- Compliance block for missing DNC/consent prerequisites.
- Approval flow for high-risk/binding action.
- Manual direct-mail PDF/CSV export.
- SMTP/manual email fallback flow.
- Cost Optimization Center provider/fallback display.
- AI chat shell with sanitized output.
- Map workflow with list/table alternative.

Expected command:

```sh
sh scripts/test-e2e.sh
```

## Contract Test Rules

Provider contract tests are required for:

- Email adapters.
- Direct-mail adapters.
- Voice/telephony adapters.
- SMS adapters if enabled.
- Property-data adapters.
- MLS/RESO adapters.
- DNC/scrub vendor adapters.
- LLM provider adapters.
- MCP tool schemas.

Contract tests must not call live paid providers by default. Use recorded synthetic fixtures or mock servers. Live provider tests must be opt-in and require explicit environment variables documented in `ENVIRONMENT.md`.

## Smoke Test Rules

Smoke tests must verify:

- App/API starts.
- Health endpoint responds.
- Database connection works if applicable.
- Redis/search/object storage connections are either healthy or correctly marked disabled by profile.
- Login/auth health works if auth exists.
- A synthetic tenant can load the dashboard shell.
- Compliance gate blocks a high-risk outbound action without prerequisites.
- Hidden-prefix sanitizer rejects known leakage fixture.
- No provider live send occurs.

Expected command:

```sh
sh scripts/smoke-test.sh
```

## Regression Test Rules

Add regression tests for every fixed bug that affects:

- Tenant isolation.
- Compliance gates.
- Opt-out/unsubscribe/DNC suppression.
- High-risk approval gates.
- Hidden-prefix leakage.
- AI hallucinated/binding actions.
- Provider fallback selection.
- Search/index correctness.
- Campaign retries/idempotency.
- Data migration correctness.

## Performance Test Rules

Performance tests or local smoke benchmarks must cover:

- Property search latency for representative indexed fixtures.
- List stacking/deduplication throughput.
- CSV import validation throughput.
- Campaign worker queue throughput.
- Direct-mail PDF batch rendering.
- Voice event latency and transcript logging path.
- LLM gateway overhead and cache telemetry.
- DeepSeek/Hermes cache participation for eligible workflows.

Production SLOs must be documented before load testing with real-scale data.

## Accessibility Test Rules

UI tests must verify:

- Keyboard access for primary workflows.
- Accessible names on buttons/actions.
- Form labels, descriptions, errors, and validation states.
- Compliance blocks and approval states readable by screen readers.
- Color is not the only status indicator.
- Real-time updates do not overwhelm assistive technologies.
- Voice console includes transcript text.
- Map workflows have list/table alternatives.

## Security Test Rules

Security tests must include:

- Secret scan.
- Dependency audit.
- SAST where configured.
- Container scan where images exist.
- Cross-tenant access denial tests.
- Authorization denial tests.
- CSRF/session/header checks where applicable.
- Injection validation tests at API boundaries.
- File upload restrictions where applicable.
- Log redaction tests.
- Prompt/hidden-prefix leakage tests.
- DNC raw-data exposure tests.

Expected commands:

```sh
sh scripts/security-check.sh
sh scripts/dependency-audit.sh
```

## Test Data Rules

- Use synthetic data only.
- Do not use real owners, sellers, addresses, phone numbers, emails, DNC data, MLS data, call recordings, transcripts, or provider payloads.
- Use clearly fake domains such as `example.test`.
- Use fake phone numbers reserved for testing where possible.
- Use fixture tenants with explicit tenant IDs.
- Cleanup test data deterministically.

## Mocking Rules

- Mock provider SDKs at adapter boundaries, not inside domain logic.
- Mock clocks and IDs for deterministic tests.
- Mock hosted LLM responses with fixtures.
- Do not mock the code under test.
- Use fake repositories for unit tests and real disposable repositories for integration tests.

## Fixture Rules

Fixtures must live in test-specific directories and be named to show they are synthetic. Fixtures must not contain:

- Secrets.
- Raw DNC numbers.
- Real people.
- Real addresses unless legally safe public sample data is explicitly approved.
- Raw production payloads.
- Hidden prompt text in user-visible expected outputs.

## Required Tests Per Feature

Every feature must include:

- At least one happy-path test.
- At least one validation/error test.
- At least one authorization/tenant-scope test when applicable.
- At least one observability/logging or activity/audit assertion for side-effecting behavior.
- At least one idempotency/retry test for worker behavior.
- At least one compliance test for outreach, AI tool use, negotiation, or provider sends.

## Validation Matrix

| Change Type        | Required Commands                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| Domain-only        | `sh scripts/lint.sh`, `sh scripts/typecheck.sh`, `sh scripts/test-unit.sh`                                   |
| Persistence/schema | Domain commands plus `sh scripts/test-integration.sh`, migration command                                     |
| API/service        | `sh scripts/lint.sh`, `sh scripts/typecheck.sh`, `sh scripts/test-unit.sh`, `sh scripts/test-integration.sh` |
| UI/client          | `sh scripts/lint.sh`, `sh scripts/typecheck.sh`, `sh scripts/test-unit.sh`, `sh scripts/test-e2e.sh`         |
| Security/auth      | Full verify plus `sh scripts/security-check.sh`                                                              |
| Deployment/infra   | `sh scripts/build.sh`, `sh scripts/smoke-test.sh`, `sh scripts/production-readiness-check.sh`                |
| Production release | `sh scripts/verify.sh`, `sh scripts/production-readiness-check.sh`                                           |

## Definition of Test Done

Testing is done only when:

- Required tests exist.
- Required commands pass.
- Regression tests exist for fixed bugs.
- Test data is synthetic.
- No tests depend on live paid vendors by default.
- Failure states and compliance blocks are covered.
- Accessibility and security checks are included where applicable.
- Results are recorded in the active ExecPlan.
