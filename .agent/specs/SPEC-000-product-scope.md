# SPEC-000: Product Scope

## Status

Draft baseline for greenfield implementation.

## Owner

Product/Architecture.

## Linked Roadmap Phase

Phase 0 through Phase 9.

## Linked ExecPlans

- `EP-000-repository-discovery.md`
- `EP-001-foundation.md`
- `EP-010-production-readiness.md`

## User-Visible Goal

Users can understand and use the platform as an investor/acquisitions-first real estate operating system for property intelligence, CRM, compliant outreach, negotiation support, AI assistance, activity tracking, and cost-aware operations.

## Non-Goals

- Literal PropStream clone.
- PropStream code, UI, branding, data, proprietary workflows, protected expression, or affiliation.
- Cobras code reuse without formal license/provenance approval.
- Licensed-agent-only positioning.
- DNC as a lead source.
- Mandatory paid SaaS providers for core use.
- Fully autonomous outbound AI cold calling by default.
- AI binding commitments without approval.
- Raw DNC dashboard exposure.
- Hosted AI requirement.
- Production outreach without compliance prerequisites.

## Terms

- **Investor/acquisitions mode**: Default product mode for investors, wholesalers, acquisition teams, and lead managers.
- **Licensed-agent mode**: Optional module for broker/agent workflows requiring extra permissions and data-provider rules.
- **Compliance gate**: Deterministic backend policy returning `allowed`, `blocked`, or `needs_approval`.
- **Provider adapter**: Internal interface wrapping an external or self-hosted provider.
- **Manual fallback**: Export/task-based flow that avoids mandatory paid SaaS.
- **Hidden prefix**: Internal LLM/system/cache prompt content never visible to users.
- **Authoritative record**: Raw/canonical data in PostgreSQL and protected object storage, not compressed LLM context.

## Required Behavior

- Product copy and defaults identify the platform as investor/acquisitions-first.
- Licensed-agent/brokerage workflows are optional and gated by configuration/permissions.
- Core modules include:
  - Tenants, users, teams, roles.
  - Properties, owners, contacts, contact points, addresses.
  - Lead lists, tags, stages, saved searches.
  - Notes, tasks, follow-ups.
  - Universal activity timeline.
  - Campaigns and channel events.
  - Compliance verdicts and audit logs.
  - Offers, negotiations, deal math, approval states.
  - Provider adapters and cost/fallback settings.
  - AI chat/agent shell with LLM/MCP gateways.
- Paid provider integrations must have fallbacks where legally/technically practical.
- High-risk actions must be blocked or require approval.
- Hidden prompts/prefixes must not leak.
- DNC must be suppression-only.

## Inputs

- User-created tenant, team, and role settings.
- CSV property/lead imports.
- Approved property-data provider payloads.
- MLS/RESO data only when licensed.
- Contact and owner data.
- Campaign configurations.
- Provider settings.
- DNC/consent/opt-out records.
- AI user prompts and tool requests.
- Telegram/mobile/voice commands.

## Outputs

- Property/owner/contact/search/list views.
- Campaign and outreach artifacts.
- Direct-mail PDFs/CSVs.
- Email/manual export files.
- Compliance verdicts.
- Approval tasks.
- Activity/audit timeline entries.
- AI research, negotiation, and roleplay outputs after sanitizer.
- Cost/provider dashboards.
- Operational metrics/logs.

## Error States

- Missing provider configuration.
- Missing compliance prerequisite.
- Missing approval.
- Tenant access denied.
- Import validation failure.
- Unsupported data license.
- Provider unavailable.
- AI route disabled.
- Hidden-prefix sanitizer block.
- Attempted high-risk action without permission.
- Attempted raw DNC access.

## Data Rules

- Tenant data is isolated.
- Raw data is authoritative.
- Search index is derived.
- Token-compressed context is derived and non-authoritative.
- Sensitive artifacts are tenant-scoped.
- DNC raw data is protected and not dashboard-visible.
- Retention policies must be configurable for sensitive artifacts.

## Security Rules

- Auth required for non-public use.
- RBAC enforced.
- 2FA/approval for high-risk actions.
- Provider credentials encrypted.
- Hosted AI optional and data-minimized.
- No live sends in default tests.
- No third-party code reuse without license/provenance review.

## Accessibility Rules

- UI must target WCAG 2.1/2.2 AA where practical.
- Compliance and approval states must be accessible.
- Map workflows need list/table alternatives.
- AI chat and activity timeline must support keyboard/screen-reader use.

## Performance Rules

- Nationwide property search architecture must use PostGIS and search projections.
- DeepSeek eligible warm-request cache-hit SLO: >= 97%.
- Hermes eligible prefix-reuse SLO: >= 97%.
- Token-hit ratio tracked separately.
- Workers handle channel events asynchronously.

## Observability Rules

- Activity logging for every side-effecting action.
- Compliance verdict metrics.
- Provider cost/health metrics.
- LLM cache telemetry.
- Search and worker latency metrics.
- Redacted structured logs.

## Required Tests

- Product mode default test.
- Licensed-agent optional module gating test.
- Provider fallback selection test.
- DNC suppression-only test.
- High-risk approval requirement test.
- Hidden-prefix sanitizer test.
- Activity logging test.

## Acceptance Criteria

- Specs and architecture explicitly preserve investor/acquisitions-first scope.
- No required baseline flow depends on a paid provider.
- Core modules are represented in roadmap and ExecPlans.
- STOP conditions cover legal/security/financial/provider risks.
- Product docs prohibit cloning third-party products.
