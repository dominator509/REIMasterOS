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

## Flaky Test Policy

- Treat nondeterminism as a defect: first control clocks, IDs, random input, ports, process cleanup, and fixture ordering, then rerun the same documented command.
- On a second same-root failure, isolate the narrowest test and record the observed seed, timing, service state, and exact error before changing code.
- Quarantine is a last resort and requires an owner, a tracking issue, an expiry date, and a Decision Log entry. Quarantined tests remain visible and may not silently pass.
- Compliance, tenant-isolation, authorization, secret/redaction, hidden-prefix, migration, dependency-audit, security-scan, and smoke checks may not be skipped or quarantined.
- CI retries are not a substitute for determinism. A retry may gather evidence, but the original failure remains actionable until its root cause is fixed.

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

## EP-010 Test-Evidence Boundaries (2026-07-19)

The current verifier provides strong deterministic repository evidence, but it does not replace
runtime validation:

- Server-rendered UI acceptance covers semantic landmarks, accessible names, live regions,
  compliance status, table alternatives, loading/empty/error states, and keyboard entry points.
- The UI suite is Vitest/render-level acceptance, not real-browser automation. It has no browser
  focus-order, keyboard traversal, zoom/reflow, contrast, screen-reader, or assistive-technology
  evidence, and it does not use Playwright or an automated accessibility engine.
- No representative performance/load suite exists for search, workers, direct-mail rendering,
  voice, or the LLM gateway. Documented SLOs are targets only.
- The live PostgreSQL isolation test is opt-in and was skipped in the EP-010 full verification
  because no target database was configured.
- Provider and AI tests use synthetic mocks and fail-closed adapters; they do not prove a live
  paid provider, hosted model, webhook secret, or outreach path.

These gaps are launch blockers, not test failures: the implemented local behaviors pass, while
production-only evidence remains absent.

## EP-007 Coverage Audit (2026-07-18)

This is a source-to-spec coverage map, not a percentage claim. No coverage reporter is configured, and test counts alone do not prove production readiness.

| Area          | Current evidence                                                                                                                                                                        | Critical gaps routed to EP-007                                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain        | Entity/value-object, deal math, negotiation safety, permissions, campaign, approval, compliance, activity, provider-fallback, and AI action-policy unit tests                           | Add a consolidated suppression matrix proving DNC, opt-out, unsubscribe, consent, quiet-hours, and recording gates cannot regress                                                              |
| Persistence   | Migration shape/runner, recording repositories, canonical tenant filters, encrypted credential metadata, and opt-in live PostgreSQL isolation                                           | Expand cross-tenant denial across canonical read/write seams; the live database test remains explicitly opt-in and backup/restore is an operations concern                                     |
| API           | Contract validation, auth/session, CSRF/headers/rate limits, tenant-scoped services, approval/MFA, campaign compliance, audit/redaction, webhook signature failure, and full Nest graph | Add worker-style policy recheck coverage and broader provider failure contracts; built-in login has no HTTP/persistent identity path yet                                                       |
| UI            | Server-rendered acceptance for shell, primary resource states, accessibility semantics, compliance/approval, imports/exports, AI disabled state, and cost/provider state                | Tests are render-level Vitest acceptance, not live-browser automation; authenticated login/tenant selection and real write flows are absent                                                    |
| Auth/security | Signed expiry-bound sessions, deny-by-default identity/step-up, role/delegation denial, tenant guards, high-risk expiry/MFA, CORS/CSRF/header/rate-limit/redaction tests                | Durable sessions/users, real MFA enrollment, distributed rate limits, and browser session propagation remain later implementation work                                                         |
| Compliance    | Domain verdict tests and API campaign launch tests cover `allowed`, `blocked`, and `needs_approval`                                                                                     | Add a table-driven regression matrix and explicit stale-job/worker recheck boundary; never add raw DNC fixtures                                                                                |
| AI            | Domain action classification and an API/UI disabled gateway state                                                                                                                       | No AI gateway, prompt compiler, streaming sanitizer, prefix hash/version, or provider-separated cache telemetry exists; add contract-level safety/cache stubs without enabling model calls     |
| Providers     | Domain fallback selection, disabled health projection, and webhook verifier deny/accept mocks                                                                                           | No `packages/adapters`, `services`, or `workers` tree exists; add interface-level mocked contracts for email, direct mail, voice, disabled SMS, property CSV, DNC verdicts, and webhook errors |
| Observability | Recursive API/package redaction, health projection, audit lifecycle, smoke checks, and static monitoring assets                                                                         | Metrics interfaces are not backed by a runtime registry; add deterministic provider/AI cache metric contract tests and keep deployment provisioning for later plans                            |
| Deployment/CI | Local full verify, Compose/build/smoke scripts, and a single documented CI verification entrypoint                                                                                      | Hosted Actions execution still requires a configured remote; the local verifier now includes E2E, security, dependency audit, and smoke as blocking checks                                     |

The repository has no `services/` or `workers/` implementation yet. EP-007 will use package/API contract seams for missing gateway/adapter/worker boundaries and will record those dependencies rather than inventing live runtimes.

CI runs `sh scripts/verify.sh`, the documented full-verification entrypoint. That script performs frozen installation, lint, formatting, type checking, unit and integration tests, build, E2E acceptance tests, local security scan, dependency audit, and smoke tests in order; every step is blocking.
