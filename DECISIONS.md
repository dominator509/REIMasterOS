# Decisions

This file is the architecture decision log. Add an ADR for decisions that change architecture, stack, licensing, security posture, deployment posture, data model, vendor strategy, or user-visible product scope.

## Decision Table

| ADR      |       Date | Status   | Owner                | Decision                                                                                                                         | Related Files                                     |
| -------- | ---------: | -------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| ADR-0001 | 2026-07-07 | Accepted | Product/Architecture | Investor/acquisitions-first product scope; licensed-agent workflows optional.                                                    | `PROJECT_BRIEF.md`, `SPEC-000-product-scope.md`   |
| ADR-0002 | 2026-07-07 | Accepted | Architecture         | Use six-layer architecture with domain/policy core isolated from UI, database, provider SDKs, and AI runtimes.                   | `ARCHITECTURE.md`                                 |
| ADR-0003 | 2026-07-07 | Accepted | Architecture         | Use provider adapters and manual/self-host fallbacks before paid SaaS integrations.                                              | `ARCHITECTURE.md`, `ENVIRONMENT.md`               |
| ADR-0004 | 2026-07-07 | Accepted | Data Architecture    | PostgreSQL/PostGIS is authoritative; OpenSearch is a rebuildable projection; Redis is ephemeral; object storage holds artifacts. | `SPEC-002-data-model.md`                          |
| ADR-0005 | 2026-07-07 | Accepted | AI Architecture      | Local Hermes is default/private mode; DeepSeek is optional hosted/hybrid reasoning via LLM gateway.                              | `SPEC-001-core-domain.md`, `OBSERVABILITY.md`     |
| ADR-0006 | 2026-07-07 | Accepted | Compliance/Security  | DNC is suppression-only and raw DNC data must not be dashboard-visible.                                                          | `SECURITY.md`, `SPEC-005-auth-and-permissions.md` |
| ADR-0007 | 2026-07-07 | Accepted | Licensing/Security   | Cobras is reference-only and PropStream is benchmark-only unless future license/provenance ADR approves otherwise.               | `PROJECT_BRIEF.md`, `SECURITY.md`                 |
| ADR-0008 | 2026-07-07 | Proposed | AI/Legal             | RTK/Rust Token Killer integration requires license/provenance review before code or binary reuse.                                | `ASSUMPTIONS.md`, `SECURITY.md`                   |

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
