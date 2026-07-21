# Decisions

This file is the architecture decision log. Add an ADR for decisions that change architecture, stack, licensing, security posture, deployment posture, data model, vendor strategy, or user-visible product scope.

## Decision Table

| ADR      |       Date | Status   | Owner                | Decision                                                                                                                                          | Related Files                                               |
| -------- | ---------: | -------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| ADR-0001 | 2026-07-07 | Accepted | Product/Architecture | Investor/acquisitions-first product scope; licensed-agent workflows optional.                                                                     | `PROJECT_BRIEF.md`, `SPEC-000-product-scope.md`             |
| ADR-0002 | 2026-07-07 | Accepted | Architecture         | Use six-layer architecture with domain/policy core isolated from UI, database, provider SDKs, and AI runtimes.                                    | `ARCHITECTURE.md`                                           |
| ADR-0003 | 2026-07-07 | Accepted | Architecture         | Use provider adapters and manual/self-host fallbacks before paid SaaS integrations.                                                               | `ARCHITECTURE.md`, `ENVIRONMENT.md`                         |
| ADR-0004 | 2026-07-07 | Accepted | Data Architecture    | PostgreSQL/PostGIS is authoritative; OpenSearch is a rebuildable projection; Redis is ephemeral; object storage holds artifacts.                  | `SPEC-002-data-model.md`                                    |
| ADR-0005 | 2026-07-07 | Accepted | AI Architecture      | Local Hermes is default/private mode; DeepSeek is optional hosted/hybrid reasoning via LLM gateway.                                               | `SPEC-001-core-domain.md`, `OBSERVABILITY.md`               |
| ADR-0006 | 2026-07-07 | Accepted | Compliance/Security  | DNC is suppression-only and raw DNC data must not be dashboard-visible.                                                                           | `SECURITY.md`, `SPEC-005-auth-and-permissions.md`           |
| ADR-0007 | 2026-07-07 | Accepted | Licensing/Security   | Cobras is reference-only and PropStream is benchmark-only unless future license/provenance ADR approves otherwise.                                | `PROJECT_BRIEF.md`, `SECURITY.md`                           |
| ADR-0008 | 2026-07-07 | Proposed | AI/Legal             | RTK/Rust Token Killer integration requires license/provenance review before code or binary reuse.                                                 | `ASSUMPTIONS.md`, `SECURITY.md`                             |
| ADR-0009 | 2026-07-18 | Accepted | Data Architecture    | Use the MIT-licensed `pg` client behind the persistence `DbConnection` boundary for real parameterized PostgreSQL repositories.                   | `packages/persistence`, `SECURITY.md`                       |
| ADR-0010 | 2026-07-18 | Accepted | API/Security         | Protected APIs fail closed; campaign launch requires deterministic compliance, an approved action record, and MFA.                                | `apps/api/src`, `SPEC-005-auth-and-permissions.md`          |
| ADR-0011 | 2026-07-18 | Accepted | UI/Contracts         | Next server views validate API envelopes through compiled shared-contract exports; synthetic populated data is test-only.                         | `apps/web`, `packages/contracts`                            |
| ADR-0012 | 2026-07-18 | Accepted | Auth/Security        | Use signed built-in sessions, strict tenant/RBAC gates, expiring MFA-bound approvals, CSRF/CORS controls, and deny-all external step-up defaults. | `apps/api/src/auth`, `apps/api/src/security`, `SECURITY.md` |

## ADR Index

### ADR-0001: Investor/Acquisitions-First Product Scope

Context:

- The product owner is assumed not licensed as a real estate agent.
- Primary users are investors, wholesalers, acquisition teams, and disposition teams.
- Licensed-agent features are useful but should not define the default platform.

Decision:

- Default workflows, onboarding, copy, domain model, and permissions are investor/acquisitions-first.
- Licensed-agent/brokerage mode is optional and can add MLS/RESO, brokerage approval, and agency-specific compliance rules.

Alternatives considered:

- Agent-only CRM.
- Wholesale-only CRM.
- Generic CRM without real-estate acquisition workflows.

Consequences:

- Core domain must support offers, negotiations, deal math, lead lists, owner/property relationships, and compliance gating.
- Agent-specific workflows must not be mandatory.

Status: Accepted.

### ADR-0002: Six-Layer Architecture

Context:

- The platform combines UI, APIs, data, workers, provider adapters, MCP tools, AI routing, compliance, and operations.
- Lower-tier coding agents need strict boundaries.

Decision:

- Adopt the six-layer architecture defined in `ARCHITECTURE.md`.

Alternatives considered:

- Single Next.js full-stack app.
- Microservices from day one.
- Vendor-specific integration-first architecture.

Consequences:

- Domain package must remain pure.
- Provider SDKs live only in adapters.
- AI tool use goes through LLM/MCP gateway.

Status: Accepted.

### ADR-0003: Provider Adapters and Cost Fallbacks

Context:

- Paid SaaS should accelerate, not be mandatory.
- The platform must support budget/self-host mode.

Decision:

- All external services use provider interfaces.
- Manual/self-host fallback exists where practical.

Alternatives considered:

- Twilio/Mailchimp/Lob/Mapbox/Auth0/DeepSeek as mandatory defaults.
- Provider-specific business logic.

Consequences:

- More adapter code and contract tests.
- Better commercial flexibility and cost control.

Status: Accepted.

### ADR-0004: Authoritative Data and Projections

Context:

- Nationwide property intelligence requires search performance.
- Raw data must remain authoritative.
- Token-compressed summaries are not legal records.

Decision:

- PostgreSQL/PostGIS is authoritative.
- OpenSearch/Elasticsearch is a rebuildable projection.
- Redis is ephemeral.
- Object storage is tenant-scoped for raw payloads/artifacts.

Alternatives considered:

- Search engine as source of truth.
- Graph database mandatory from day one.
- Object storage only.

Consequences:

- Requires migration discipline and projection rebuild tooling.
- Prevents derived/search/LLM data from overwriting canonical records.

Status: Accepted.

### ADR-0005: Local Hermes Default and Optional DeepSeek

Context:

- Privacy and cost requirements require local-only mode.
- Heavy reasoning can benefit from DeepSeek cache behavior.

Decision:

- Hermes/local LLM is default/private mode.
- DeepSeek is optional via LLM gateway.
- Cache metrics for Hermes and DeepSeek are tracked separately.

Alternatives considered:

- Hosted LLM mandatory.
- Local-only without hosted overflow.
- Direct model calls from features.

Consequences:

- Requires routing, prompt compiler, sanitizer, cache telemetry, and provider config.
- Hosted AI must receive minimized data.

Status: Accepted.

### ADR-0006: DNC Suppression-Only

Context:

- National DNC data has compliance restrictions.
- Product requirements prohibit DNC as lead source.

Decision:

- DNC records are used only for suppression/compliance verdicts.
- Dashboard displays verdict/reason, not raw DNC numbers.

Alternatives considered:

- Raw DNC import/display.
- DNC list enrichment.
- Provider-only black-box DNC without audit records.

Consequences:

- Compliance audit records must reference verdicts and evidence hashes.
- Raw DNC data must be protected.

Status: Accepted.

### ADR-0007: Third-Party Benchmark/Reference Boundaries

Context:

- PropStream and Cobras are mentioned in planning.
- Legal/provenance risk must be avoided.

Decision:

- PropStream is only a capability-category benchmark.
- Cobras is reference/inspiration only.
- No code, UI, protected expression, data, or workflows are copied without formal ADR.

Alternatives considered:

- Fork Cobras.
- Clone PropStream-like UI.
- Ignore comparable tools entirely.

Consequences:

- Build original implementation from scratch.
- Product can cover similar categories but must use original design and licensed data.

Status: Accepted.

### ADR-0008: RTK License Review Before Use

Context:

- RTK/Rust Token Killer may provide token compression benefits.
- License and dependency tree are unknown.

Decision:

- Proposed: do not use, fork, modify, bundle, or distribute RTK until license/provenance review is completed.
- A clean-room token-compressor service may be designed behind an interface.

Alternatives considered:

- Bundle RTK immediately.
- Do not support token compression.
- Use only prompt summarization.

Consequences:

- Token compression implementation starts with interfaces/tests.
- Legal review gates any RTK-specific code.

Status: Proposed.

### ADR-0009: PostgreSQL Client Behind Persistence Boundary

Context:

- EP-003 had repository interfaces and recording tests but no application
  connection capable of exercising repository SQL against PostgreSQL.
- Docker `psql` remains appropriate for versioned migration execution, but it is
  not an application repository client.

Decision:

- Use the MIT-licensed `pg` package in `packages/persistence` only.
- Keep it behind `DbConnection`; repository values remain parameterized and SQL
  identifiers remain fixed in code.
- Require verified TLS when `DbConfig.ssl` is enabled.

Alternatives considered:

- Continue with recording-only repository tests.
- Build a custom application protocol wrapper around Docker `psql`.
- Add an ORM before domain and query requirements justify one.

Consequences:

- Live local integration tests can prove cross-tenant query behavior against the
  applied schema.
- The dependency and lockfile enter the security/license audit surface.
- Higher-level plans can inject `DbConnection` without importing `pg` directly.

Status: Accepted.

### ADR-0010: Fail-Closed API and Campaign Launch Gates

Context:

- EP-004 needs authorization hooks before EP-006 supplies production identity.
- Campaign launch is a high-risk side effect that must not be authorized by AI output or by an approval that contradicts suppression facts.
- Provider, queue, and AI runtimes are not yet production-configured.

Decision:

- Reject protected requests that do not already contain an authenticated context; synthetic contexts are test-only.
- Evaluate deterministic compliance first, require an approved `campaign.launch` record second, and require verified MFA third before enqueueing any launch.
- Keep AI disabled, webhook verification deny-all, and jobs in memory until later plans provide configured adapters.

Alternatives considered:

- Inject an administrative placeholder context at runtime.
- Allow compliance-approved campaigns to launch with MFA but no approval record.
- Enable permissive provider and AI defaults during scaffolding.

Consequences:

- Protected routes are intentionally unavailable until EP-006 establishes identity propagation.
- Approvals cannot override blocked compliance facts.
- EP-008 and later plans must replace health/job/provider placeholders before production readiness can pass.

Status: Accepted.

### ADR-0011: Contract-Validated Server Views and Compiled Workspace Exports

Context:

- EP-005 UI pages need typed runtime API validation without storing secrets or production-like fixtures in the browser.
- The documented `API_BASE_URL` is server-only, and production identity is not available until EP-006.
- `@rei-os/contracts` previously advertised TypeScript source whose emitted `.js` specifiers failed in a clean Next/Webpack build.

Decision:

- Load authenticated workspace resources from server-rendered dynamic pages using `API_BASE_URL` and validate standard shared envelopes before rendering.
- Publish the contracts package's existing TypeScript output through `dist` package exports.
- Keep synthetic populated records exclusively in acceptance tests; keep write controls disabled until identity and MFA are configured.
- Run EP-005 acceptance through a filtered Turbo task that builds contracts and web before executing the web suite.

Alternatives considered:

- Embed production mock records in pages.
- Expose the internal API URL and auth material to browser JavaScript.
- Import deep contract source paths or rewrite their ESM specifiers for Next.
- Call the server-rendered acceptance suite a live-browser test.

Consequences:

- Unexpected API shapes fail visibly instead of entering UI state.
- Clean builds consume the same compiled contract artifacts as runtime packages.
- EP-006 must propagate authenticated sessions to server API requests, and EP-007 must add live-browser coverage before production readiness.

Status: Accepted.

### ADR-0012: Built-In Session and High-Risk Security Baseline

Context:

- Self-host and budget deployments cannot require a commercial identity provider.
- Cookie authentication, tenant permissions, and high-risk actions need deterministic fail-closed controls before live providers or production identity stores exist.
- The repository requires approval/MFA gates without inventing production secrets or a vendor-specific 2FA API.

Decision:

- Use standard-library HMAC-signed sessions with absolute and idle expiry, `HttpOnly`/`SameSite=Strict` cookies, and `Secure` in staging/production.
- Require explicit production secrets and CORS origins; protect cookie-authenticated writes with a separate double-submit CSRF value.
- Derive roles only from the domain constants, reject missing tenant context before API/repository work, and restrict base roles with delegated permission lists.
- Require current tenant/action-matched expiring approvals plus MFA for high-risk actions.
- Keep identity lookup and external step-up deny-all until owner-configured adapters are available.
- Add single-process rate limiting and in-memory audit as honest baselines, not distributed production claims.

Alternatives considered:

- Make Auth0/Okta/WorkOS mandatory.
- Use unsigned or browser-readable session state.
- Trust tenant headers or allow approval records without MFA/expiry binding.
- Ship a fixed TOTP secret or permissive development verifier in production.

Consequences:

- Local/service tests can exercise built-in auth without live accounts or secrets.
- Staging/production startup fails closed on placeholder secrets or local/wildcard CORS.
- A durable tenant identity/session/audit store, real MFA enrollment/verifier, distributed limiter, and authenticated web-to-API propagation remain required before production readiness.

Status: Accepted.

### ADR-0013: Exporter-Neutral Redacted Observability Baseline

Date: 2026-07-18.

Owner: Platform/Operations.

Related files: `packages/observability/**`, `apps/api/src/observability/**`, `apps/api/src/health/**`, `infra/otel/**`, `infra/prometheus/**`, `infra/grafana/**`, `OBSERVABILITY.md`, `OPERATIONS.md`.

Context:

- Self-hosted deployments must not require a paid observability vendor.
- Logs, metrics, traces, and health responses must not expose secrets, raw DNC/contact data, hidden prefixes, prompts, provider payloads, or exception messages.
- Worker, AI gateway, exporter, and production monitoring runtimes are not yet configured.

Decision:

- Use stable provider-neutral logger, metric-collector, and tracer ports with deterministic in-memory test implementations and disabled-exporter no-op implementations.
- Require request/job correlation and structured event names, reject unsafe metric labels, redact trace/log attributes, and keep Hermes and DeepSeek cache signals separated by bounded provider labels.
- Separate liveness, readiness, and dependency health; fail required database readiness closed while showing optional absent services as `not_configured`.
- Provision OTel, Prometheus, alert, Grafana, and runbook skeletons without claiming they are deployed; structural readiness validation must say so explicitly and fail on missing artifacts.

Alternatives considered:

- Require a commercial logging/APM platform.
- Add an OpenTelemetry SDK/exporter dependency before runtime ownership and environment configuration exist.
- Emit raw errors, URLs, prompts, provider payloads, or arbitrary metric labels for debugging.
- Treat provisioning files as proof of live monitoring readiness.

Consequences:

- Local validation can prove redaction, metric emission, trace behavior, health semantics, dashboard JSON, and structural configuration without network access.
- Runtime OTLP wiring, Prometheus rule evaluation, alert delivery, dashboard access control/retention, SLO calibration, and monitoring ownership remain production-readiness work.
- Worker and AI gateway metrics remain contract-only until those runtimes exist.

Status: Accepted.

### ADR-0014: Immutable Existing-Runtime Release Artifacts

Date: 2026-07-18.

Owner: Platform/Release.

Related files: `Dockerfile`, `apps/web/Dockerfile`, `.github/workflows/ci.yml`, `infra/compose/**`, `infra/helm/**`, `RELEASE.md`, `ROLLBACK.md`.

Context:

- The repository currently has API and web runtimes but no worker or AI-gateway runtime.
- Budget/self-host mode must not require Kubernetes or a paid provider.
- The prior Helm directory had no templates, image defaults were mutable, and release docs overstated smoke/readiness evidence.
- Production deployment, migration, registry credentials, and Secret creation are owner-controlled STOP conditions.

Decision:

- Build separate API and web images from a version-and-digest-pinned Node base, run both as the unprivileged `node` user, and publish compiled workspace package exports.
- Make CI build both images after full verification and block HIGH/CRITICAL Trivy findings with the scanner action pinned to a reviewed full commit; do not publish images without a configured registry/provenance owner.
- Keep Compose as the first-class budget path. Provide an optional Helm chart only for the existing API/web runtimes, require immutable image references and an existing Secret name, and refuse to enable an absent worker runtime.
- Treat repository readiness, Helm rendering, cluster admission, deployed smoke, and production readiness as distinct evidence levels. Target smoke is read-only and fails required dependency readiness closed.

Alternatives considered:

- Fabricate placeholder worker/AI-gateway containers.
- Ship `latest` application images or literal Helm secrets.
- Let CI publish to an inferred registry.
- Treat structural chart checks or local package smoke as deployed-runtime proof.

Consequences:

- Clean local and CI builds exercise production package boundaries and generate small non-root runtime images.
- Solo deployments remain Compose-first while enterprise operators can lint/render a chart without the chart owning databases, Secrets, TLS, or provider accounts.
- Registry publication, signing, SBOM/notices, backup/restore evidence, connected readiness probes, cluster admission, staging smoke/rollback, and explicit production approval remain release gates.

Status: Accepted.

### ADR-0015: Evidence-Tiered Production No-Go Gate

Date: 2026-07-19.

Owner: Unassigned; a named release owner is required before launch.

Related files: `PRODUCTION_READINESS.md`, `SECURITY.md`, `OBSERVABILITY.md`,
`TESTING.md`, `DEPLOYMENT.md`, `OPERATIONS.md`, `RELEASE.md`,
`ROLLBACK.md`.

Context:

- The full repository verifier, security scan, dependency audit, offline smoke, image startup,
  Compose validation, and Helm lint/render pass.
- The prior readiness report treated file existence and local checks as deployment proof and
  contained stale vulnerability/test claims.
- Runtime services, target infrastructure, backup/restore, rollback, measured SLOs, release
  governance, and named operational ownership are absent.

Decision:

- Classify evidence as local behavior, artifact/structural validation, connected-runtime proof,
  or launch approval.
- A lower evidence tier may not satisfy a higher-tier gate.
- Record a NO-GO until every blocking runtime and governance gate has target evidence and a named
  launch owner approves the release.
- Do not convert missing authorization, secrets, provider accounts, or production targets into
  fabricated acceptance records.

Alternatives considered:

- Preserve the numeric readiness score despite stale evidence.
- Treat passing local verification and structural manifests as production readiness.
- Assign generic team labels as risk owners without an accountable person or approval.
- Deploy a target or perform production data operations without explicit authorization.

Consequences:

- The repository can be described accurately as a green local implementation and artifact
  baseline while launch remains blocked.
- Future reviews can promote individual gates only when stronger evidence is attached.
- Operational blockers require environment-owner work or follow-up ExecPlans; EP-010 does not
  hide them through broad feature implementation.

Status: Accepted.

## Rules for Adding New Decisions

Add an ADR when any of these change:

- Architecture boundaries.
- Runtime/service topology.
- Database/schema strategy.
- Provider/vendor strategy.
- Licensing/provenance posture.
- Auth/security model.
- Compliance policy behavior.
- Deployment target.
- Production readiness criteria.
- AI model, prompt, cache, or MCP design.

Each ADR must include:

- Context.
- Decision.
- Alternatives considered.
- Consequences.
- Status.
- Date.
- Owner.
- Related files.

Use `.agent/templates/adr-template.md`.
