# Architecture

## Purpose

This document defines concrete architecture boundaries for the Real Estate Investor / Acquisitions OS. It prevents drift, vendor lock-in, compliance bypasses, AI tool overreach, and accidental coupling.

## System Overview

The system is a self-hostable, multi-tenant platform for property intelligence, CRM, outreach, negotiation, compliance, AI workflows, and operations.

The architecture uses a **six-layer paradigm**:

1. **Experience and Agent Surfaces**
   - Next.js dashboard/PWA.
   - Telegram command center.
   - Voice console and live-call copilot.
   - Mobile alert/control surfaces.
   - Future SDK/CLI clients.

2. **API/BFF and Application Services**
   - NestJS API/BFF by default.
   - Request validation.
   - Application use cases.
   - Authorization hooks.
   - API contracts.
   - WebSocket/SSE event fanout.

3. **Domain and Policy Core**
   - Pure TypeScript domain packages.
   - Entities, value objects, policies, calculators, compliance verdicts, approval rules, negotiation rules.
   - No framework, database, vendor, UI, or network imports.

4. **Data/Search/Storage Persistence**
   - PostgreSQL/PostGIS authoritative records.
   - OpenSearch/Elasticsearch projections.
   - Redis cache/queues/rate limits.
   - S3-compatible object storage for artifacts.
   - Migrations and repositories.

5. **Provider, Worker, MCP, and AI Integration**
   - Email, direct mail, voice, SMS, property data, MLS/RESO, skip trace, DNC, geocoding, maps, storage, auth, and observability adapters.
   - Workers for ingestion, campaigns, webhooks, mail rendering, AI jobs, cache warmup, and channel events.
   - Policy-enforced MCP Gateway and scoped MCP servers.
   - LLM gateway for Hermes/local, DeepSeek/hybrid, prefix cache, prompt compilation, token compression, and sanitization.

6. **Platform, Security, Observability, and Delivery**
   - Docker Compose profiles.
   - Helm/Kubernetes manifests.
   - CI/CD.
   - Secrets management.
   - OpenTelemetry, Prometheus, Grafana, Loki, Tempo/Jaeger, Alertmanager.
   - Backup/restore, release, rollback, incident response.

## Intended Repository Map

```text
/
  apps/
    web/                         # Next.js dashboard/PWA and UI tests
    api/                         # NestJS API/BFF, REST/WebSocket/SSE
  packages/
    domain/                      # Pure domain and policy core
    contracts/                   # Shared schemas, DTOs, API contracts
    config/                      # Typed configuration and env validation
    ui/                          # Shared UI components
    adapters/                    # Provider interface definitions and light wrappers
    testing/                     # Shared test factories and fixtures
  services/
    ai-gateway/                  # Python AI routing, prompt compiler, sanitizer, MCP clients
    ingestion-worker/            # Optional Go high-throughput ingestion worker
    token-compressor/            # Optional Rust token compression service if licensing allows
  workers/
    campaign-worker/             # Campaign orchestration
    webhook-worker/              # Provider callbacks
    mail-render-worker/          # Direct-mail PDF/CSV rendering
    compliance-worker/           # DNC/vendor sync, suppression refresh
    cache-warmup-worker/         # LLM prefix warmup
  db/
    migrations/                  # Database migrations
    seeds/                       # Synthetic local/test seed data only
  infra/
    compose/                     # Docker Compose deployment profiles
    helm/                        # Kubernetes/Helm charts
    otel/                        # Observability config
  scripts/
    *.sh                         # Command wrappers used by agents
  .github/
    workflows/                   # CI/CD
  .agent/
    execplans/ specs/ prompts/ checklists/ templates/
```

If the implemented repository differs, update this map and record the decision in `DECISIONS.md`.

## Layer Responsibilities

### Layer 1: Experience and Agent Surfaces

Allowed responsibilities:

- Render dashboard/PWA screens.
- Collect user input.
- Display loading, empty, error, success, compliance, approval, and audit states.
- Send commands to API/BFF contracts.
- Display sanitized AI responses only.
- Provide non-map alternatives for map workflows.
- Trigger Telegram/mobile/voice approvals through API/MCP-controlled endpoints.

Forbidden responsibilities:

- Direct database access.
- Direct provider API calls.
- Direct MCP tool execution.
- Compliance decisions.
- Prompt compilation.
- Hidden-prefix handling.
- Campaign worker execution.
- Raw DNC display.

### Layer 2: API/BFF and Application Services

Allowed responsibilities:

- Validate requests.
- Enforce authentication and authorization hooks.
- Invoke domain policies.
- Orchestrate repositories and provider ports.
- Emit activity events.
- Create approval records.
- Return stable response contracts.
- Publish async jobs.

Forbidden responsibilities:

- Vendor-specific business logic.
- Raw SQL outside repository/persistence modules.
- AI access that bypasses the LLM gateway and MCP policy gateway.
- Compliance decisions based on model output alone.

### Layer 3: Domain and Policy Core

Allowed responsibilities:

- Entity definitions.
- Value object validation.
- Pure policy decisions.
- DNC/compliance verdict calculation from provided facts.
- Deal math, ARV, repair assumptions, MAO, offer ladder rules.
- Negotiation safety warnings.
- Approval requirement determination.
- Provider interface/port definitions when needed.

Forbidden responsibilities:

- Importing UI, API framework, ORM, database clients, queue clients, telemetry clients, provider SDKs, or environment variables.
- Network calls.
- File-system writes.
- Date/time access without injected clock.
- Randomness without injected generator.

### Layer 4: Data/Search/Storage Persistence

Allowed responsibilities:

- Migrations.
- Repository implementations.
- Data integrity constraints.
- Search index projection writes.
- Redis-backed queue/cache implementations.
- Object storage implementations.
- Backup/restore scripts.

Forbidden responsibilities:

- Domain policy invention.
- User-visible formatting.
- Direct campaign launch decisions.
- Provider calls except storage/search/cache providers owned by this layer.

### Layer 5: Provider, Worker, MCP, and AI Integration

Allowed responsibilities:

- Implement provider adapter interfaces.
- Normalize provider webhook payloads.
- Execute background jobs from queues.
- Route LLM requests through approved providers.
- Compile deterministic prompts.
- Track DeepSeek and Hermes cache telemetry separately.
- Sanitize hidden prefixes and streaming output.
- Expose scoped MCP tools through policy gateway.
- Run cache warmup and token compression where allowed.

Forbidden responsibilities:

- Bypassing domain policy gates.
- Direct user data exposure without API/application approval.
- Making binding decisions.
- Treating token-compressed context as authoritative.
- Using RTK code/binaries without ADR-approved license review.

### Layer 6: Platform, Security, Observability, and Delivery

Allowed responsibilities:

- Infrastructure manifests.
- CI/CD.
- Secret stores.
- Monitoring and alerting.
- Deployment profiles.
- Release, rollback, and incident runbooks.
- Security scanning.
- License scanning and third-party attribution.

Forbidden responsibilities:

- Application business logic.
- Provider-specific behavior that should live behind adapters.
- Secrets in repository files.

## Dependency Rules

- Layer 1 may import shared contracts and UI packages. It must call Layer 2 over defined contracts.
- Layer 2 may import Layer 3, contracts, config, persistence interfaces, and provider ports.
- Layer 3 may import only standard language libraries and internal domain-only modules.
- Layer 4 may import Layer 3 interfaces/contracts and infrastructure libraries.
- Layer 5 may import Layer 3 interfaces/contracts and Layer 4 queue/storage primitives only through defined ports.
- Layer 6 is not imported by application code except generated config/telemetry clients explicitly documented in `packages/config` or platform wrappers.
- No layer may import from `apps/web` except tests in `apps/web`.
- No layer may import vendor SDKs except adapter implementations.
- No layer may call AI provider APIs except the LLM gateway.

## Import Rules

Concrete import rules for TypeScript packages:

```text
apps/web        -> packages/contracts, packages/ui, packages/config/client only
apps/api        -> packages/domain, packages/contracts, packages/config, packages/adapters interfaces
packages/domain -> no app, no db, no provider SDK, no env, no network
packages/contracts -> no app, no db, no provider SDK, no env, no network
packages/adapters -> packages/domain interfaces, packages/contracts, vendor SDKs only inside adapter subdirectories
packages/ui     -> React, contracts for display types only, no provider SDK, no server-only secrets
```

Tests may import test utilities from `packages/testing`.

## Runtime Flow

Example: compliant call campaign launch.

1. User selects campaign in dashboard.
2. UI posts launch request to API.
3. API authenticates user and checks RBAC.
4. API validates request schema.
5. API loads campaign, lead list, suppression state, consent records, and tenant provider settings.
6. Domain compliance policy returns `allowed`, `blocked`, or `needs_approval`.
7. If blocked, API writes activity/audit event and returns compliance block.
8. If needs approval, API creates approval task and returns approval state.
9. If allowed, API enqueues campaign job.
10. Worker rechecks compliance before executing each contact.
11. Provider adapter sends only allowed outreach.
12. Webhooks update channel events.
13. Activity timeline receives immutable events.
14. Observability records queue, provider, compliance, and cost metrics.

## Data Flow

- Raw imports land in object storage and raw ingestion tables.
- Normalization creates canonical properties, owners, contacts, contact points, addresses, lists, and relationships.
- PostgreSQL/PostGIS remains authoritative.
- Search index receives projections.
- Redis stores ephemeral cache/queues/rate limits only.
- Token-compressed LLM context is derived data and must never replace raw records.
- Hosted LLM requests receive minimized payloads based on policy.

## Request/Command Flow

All user or agent commands follow this path:

```text
User/Agent Surface -> API/BFF -> Auth/RBAC -> Request Validation -> Domain Policy -> Repository/Provider Port -> Worker/Adapter -> Activity/Audit Event -> Observability
```

AI commands follow this stricter path:

```text
AI Surface -> LLM Gateway -> Prompt Compiler -> Sanitizer -> MCP Gateway -> Policy Engine -> Scoped MCP Tool -> API/Application Service -> Domain Policy -> Audit
```

AI agents must not call arbitrary backend APIs directly.

## State Management Rules

- UI state is local to the UI and must be derivable from API data.
- Server state is authoritative in PostgreSQL.
- Search state is a projection and may be rebuilt.
- Redis state is ephemeral and may be lost without data loss.
- Activity timeline events are append-only except legally required retention/delete workflows.
- Approval records are immutable except state transitions with audit events.
- Compliance verdicts must include input evidence references, not raw DNC data.

## Persistence Boundaries

- All schema changes go through migrations.
- Migrations must be forward-safe and rollback/restore documented.
- Tenant ID must be part of every tenant-owned row and query.
- Raw provider payloads are stored in tenant-scoped object storage when needed for audit/debug.
- Sensitive columns require encryption or strong protection as documented in `SECURITY.md`.
- Repositories must not return cross-tenant records.

## External Integration Boundaries

Every integration must use a provider interface and at least one fallback when legally/technically practical.

Required adapter categories:

- Property data: CSV/manual import first; ATTOM and licensed MLS/RESO adapters optional.
- Email: SMTP/manual export first; provider APIs optional.
- Direct mail: PDF/CSV export first; Lob/PostGrid/Postalytics optional.
- Voice: manual call tasks/SIP/self-host paths first; Twilio/SignalWire/Telnyx/Plivo/Bandwidth optional.
- SMS: disabled/manual by default; provider adapters optional and high-compliance.
- AI: local Hermes first; DeepSeek optional hosted/hybrid.
- Maps: MapLibre/self-hosted option first; Mapbox/Google optional.
- Auth: built-in first; Keycloak/authentik optional; commercial SSO optional.

## Security Boundaries

- Tenant isolation is enforced in API, repositories, queues, object storage keys, MCP tool scopes, and provider credentials.
- DNC raw data is never user-visible.
- Hosted LLM calls are optional and minimized.
- High-risk actions require deterministic policy and approval.
- Secrets are loaded through typed configuration and secret stores, never hard-coded.
- Telegram/mobile approval buttons must expire and require scoped permissions.
- 2FA is required for high-risk actions.

## Validation Boundaries

- UI validates for user experience only.
- API validates all external inputs.
- Domain validates business rules.
- Persistence validates data integrity constraints.
- Provider adapters validate outbound payloads against provider contracts.
- MCP Gateway validates tool schemas and policy before every tool call.

## Error Handling Boundaries

- Domain returns typed errors/verdicts, not HTTP errors.
- API maps typed errors to stable response codes.
- UI maps response codes to accessible user messages.
- Workers classify errors as retryable, non-retryable, blocked-by-policy, or needs-approval.
- Provider adapters normalize vendor errors.
- AI sanitizers block unsafe output before user visibility.

## Observability Boundaries

- API logs request IDs, tenant IDs, user IDs, route names, status codes, and latency without secrets.
- Workers log job IDs, tenant IDs, queue names, retry counts, status, and provider route without payload secrets.
- LLM gateway logs prefix hash/version, cache hit metrics, provider/model route, and estimated cost savings without hidden prefix text.
- Compliance logs verdicts and reason codes without exposing raw DNC data.
- Provider spend and health metrics are tracked per tenant/provider/channel.

## Architectural Invariants

- Domain core is vendor-free.
- Compliance gates cannot be bypassed.
- Raw data remains authoritative.
- Token-compressed context is derived and non-authoritative.
- Hosted AI is optional.
- Paid SaaS providers are optional.
- Manual export fallbacks exist for email and direct mail.
- DNC is suppression-only.
- Hidden prefixes never become user-visible.
- AI cannot perform binding/high-risk actions without approval.
- All tenant data access is tenant-scoped.
- All provider calls go through adapters.
- All AI tool calls go through MCP Gateway.
- All campaign/channel events create activity/audit records.

## Forbidden Changes

- Literal PropStream clone or copied protected expression.
- Direct Cobras code reuse without ADR-approved licensing/provenance.
- Mandatory dependency on a single paid vendor.
- Direct provider SDK calls from UI, domain, or application business logic.
- AI direct database access.
- DNC-as-lead-source features.
- Raw DNC dashboard display.
- Production data use in tests.
- Hidden-prefix logging or display.
- Destructive migration without explicit permission.
- Broad repository restructure outside an active ExecPlan.

## How to Add a New Feature

1. Create or update a spec in `.agent/specs/`.
2. Create an ExecPlan from `.agent/templates/execplan-template.md`.
3. Identify impacted layers.
4. Define interfaces/contracts first.
5. Add domain behavior and tests.
6. Add persistence if needed with migration tests.
7. Add API/service boundary and tests.
8. Add UI/client behavior and accessibility tests if applicable.
9. Add observability, security, and documentation updates.
10. Run validation commands from `COMMANDS.md`.
11. Record decisions and assumptions.

## How to Add a New Dependency

1. Confirm dependency need from active ExecPlan.
2. Search existing dependencies.
3. Check license and distribution implications.
4. Prefer optional sidecar integration for GPL/AGPL/copyleft services.
5. Add dependency to the narrowest package.
6. Update lockfile.
7. Add or update tests.
8. Update docs and ADR if architecture/security/license posture changes.

## How to Modify Data Schema

1. Update `SPEC-002-data-model.md`.
2. Add a migration under `db/migrations/`.
3. Include tenant scope and constraints.
4. Add repository/integration tests.
5. Add migration up/down or documented restore path.
6. Update seed/test fixtures with synthetic data.
7. Run migration validation and integration tests.
8. Do not run against production without explicit permission.

## How to Add a New Integration

1. Add or update provider interface in `packages/adapters` or domain port.
2. Implement a manual/self-host fallback when practical.
3. Implement provider-specific adapter in isolated adapter directory.
4. Add contract tests with mocked provider responses.
5. Add health/cost telemetry.
6. Add config variables in `ENVIRONMENT.md`.
7. Add secret handling and redaction rules.
8. Add docs for setup, fallback, and limitations.

## Architecture Review Checklist

- Does the change preserve the six-layer boundaries?
- Does domain remain vendor-free?
- Are paid providers optional?
- Is tenant isolation enforced?
- Are compliance gates deterministic and test-backed?
- Are high-risk actions approval-gated?
- Are raw data and compressed LLM context separated?
- Are hidden prefixes sanitized and not logged?
- Are provider calls behind adapters?
- Are AI tool calls behind MCP Gateway?
- Are commands documented in `COMMANDS.md`?
- Are tests and observability included?
- Are docs and decisions updated?
