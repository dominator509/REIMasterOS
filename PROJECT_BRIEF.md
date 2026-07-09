# Project Brief: Real Estate Investor / Acquisitions OS

## Project Name

Working/internal name: **Real Estate Investor / Acquisitions OS**

Alternative internal labels allowed in planning documents only:

- AI Real Estate Investor OS
- Real Estate Acquisitions Automation Platform
- Self-Hosted Real Estate Intelligence + CRM + AI Outreach OS
- Investor Lead Operations OS

Final public brand name is TBD. Do not use PropStream branding, Cobras branding, or any third-party product branding as the final product name.

## Problem Statement

Real estate investors, acquisition operators, wholesalers, disposition teams, and investor-focused lead managers need one self-hostable operating system for property intelligence, CRM, compliant outreach, follow-ups, direct mail, calling, AI-assisted research, negotiation support, and activity tracking.

Existing SaaS tools can be expensive, vendor-locked, fragmented, or unsuitable for privacy-conscious and budget-conscious users. This project builds a provider-agnostic, compliance-gated platform that can run in a low-cost self-hosted mode while still supporting premium integrations when users choose them.

## Target Users

Primary users:

- Real estate investors
- Solo acquisition operators
- Wholesalers
- Acquisition teams
- Disposition teams
- Investor-focused lead managers
- Budget-conscious operators who need self-hosted or low-cost alternatives to SaaS tools

Secondary optional users:

- Licensed real estate agents
- Brokerages
- Investor-agent hybrid teams
- Real estate teams with MLS/RESO access

Investor/acquisitions workflows are the default. Licensed-agent and brokerage workflows are optional modules.

## Primary User Outcomes

Users must be able to:

1. Search, filter, score, deduplicate, and organize real estate leads.
2. Import and normalize property, owner, contact, and lead-list data from CSV and approved providers.
3. Track properties, owners, contacts, offers, communications, campaigns, tasks, negotiations, follow-ups, opt-outs, and compliance events.
4. Run compliant outreach through email, direct mail, calls, Telegram/mobile alerts, and optional SMS.
5. Enforce DNC, opt-out, unsubscribe, consent, quiet-hours, and approval gates before outreach.
6. Use a local/self-hosted Nous Hermes model for dashboard chat, Telegram/mobile control, roleplay, and voice workflows.
7. Use DeepSeek as an optional cache-optimized hosted/hybrid reasoning backend for heavy analysis.
8. Generate property research packs, MAO calculations, offer ladders, counteroffer strategies, call scripts, and negotiation practice.
9. Keep costs visible and low through self-hosted fallbacks, provider health/cost dashboards, local AI mode, manual exports, and cache telemetry.
10. Maintain a universal activity timeline across every property, owner, lead, campaign, conversation, AI action, and workflow.

## Business Goals

- Build a commercializable self-hostable product.
- Avoid literal cloning of any third-party product.
- Treat PropStream only as a capability-category benchmark.
- Treat Cobras Real Estate CRM only as a reference/inspiration source unless licensing and provenance are formally resolved.
- Make paid SaaS integrations optional accelerators, not mandatory platform dependencies.
- Provide budget, self-hosted, bring-your-own-provider, or manual-export fallbacks whenever legally and technically practical.
- Support solo/budget deployments and team/enterprise deployments.
- Keep legal, compliance, licensing, and outreach risk visible in product design.

## Technical Goals

- Use a six-layer architecture with explicit dependency boundaries:
  1. Experience and agent surfaces.
  2. API/BFF and application services.
  3. Domain and policy core.
  4. Data/search/storage persistence.
  5. Provider, worker, MCP, and AI integration.
  6. Platform, security, observability, and delivery.
- Use TypeScript-first web/API code, with Python for AI orchestration, optional Go for high-throughput ingestion/workers, and optional Rust for token compression if licensing permits.
- Use PostgreSQL/PostGIS as the system of record, OpenSearch/Elasticsearch for search, Redis for cache/queues/rate limits, and S3-compatible object storage for artifacts.
- Make AI tool use go through policy-enforced MCP gateways, not arbitrary backend API calls.
- Use deterministic prompt compilation and provider-specific cache telemetry.
- Separate raw authoritative data from RTK/token-compressed LLM context.
- Support Docker Compose for budget/self-host mode and Helm/Kubernetes for production and enterprise mode.

## Out of Scope

- Literal PropStream clone.
- PropStream code, UI, branding, data, proprietary workflows, protected expression, or implied affiliation.
- Cobras as a production foundation without licensing/provenance approval.
- Mandatory licensed-agent workflows.
- DNC as a lead source.
- Raw DNC number exposure in the dashboard.
- Fully autonomous outbound AI cold calling by default.
- AI making binding offers, waiving contingencies, or sending contracts without approval.
- Mandatory paid vendors for core CRM, local AI, SMTP email, manual direct-mail export, dashboard use, activity tracking, follow-ups, or basic automation.
- Scraping or misuse of restricted property, MLS, USPS, DNC, map, or geocoding data.

## Success Metrics

Functional success:

- Core CRM and property workflows pass acceptance tests.
- Lead import, search, list stacking, outreach gating, activity logging, and follow-up flows work end-to-end.
- Compliance gates return `allowed`, `blocked`, or `needs_approval` with auditable reasons.
- Provider adapters can be switched without changing domain logic.
- Manual export fallbacks exist for email and direct mail.

Cost and AI success:

- Local-only AI mode works without hosted LLM calls.
- DeepSeek eligible warm-request cache-hit SLO is at least 97%.
- Hermes/vLLM eligible local prefix-reuse SLO is at least 97%.
- Cache telemetry reports request-level cache hit, prompt-cache hit tokens, prompt-cache miss tokens, token-hit ratio, prefix hash/version, provider/model route, and estimated savings.
- Hidden prefixes never appear in dashboard chat, Telegram/mobile messages, voice transcripts, alerts, or ordinary logs.

Production success:

- All validation commands in `COMMANDS.md` pass.
- Security, privacy, accessibility, observability, deployment, rollback, backup, and incident-response checklists pass.
- Critical risks are either resolved or explicitly accepted with owner/date.
- Release and rollback procedures have been dry-run in staging or a local production-like environment.

## Production Readiness Definition

The project is production-ready only when:

- All behavior required by `.agent/specs/` is implemented or explicitly deferred by an approved decision record.
- All active ExecPlans required for the target release are complete.
- `sh scripts/verify.sh` passes.
- `sh scripts/production-readiness-check.sh` passes.
- No committed secrets, raw production data, raw DNC data, or hidden prompt prefixes are present.
- Migrations are tested and rollback/restore paths are documented.
- Observability, health checks, dashboards, and alert expectations are documented and verified.
- Compliance gates cannot be bypassed by UI, API, worker, MCP, Telegram, mobile, or AI voice paths.
- Final diff contains only files expected by the completed ExecPlans or justified in their Decision Logs.
