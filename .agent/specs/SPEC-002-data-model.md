# SPEC-002: Data Model

## Status

Draft baseline.

## Owner

Data Architecture.

## Linked Roadmap Phase

Phase 2: Data and Persistence.

## Linked ExecPlans

- `EP-003-data-and-persistence.md`
- `EP-007-testing-hardening.md`
- `EP-010-production-readiness.md`

## User-Visible Goal

Users can rely on consistent, tenant-isolated, auditable records for properties, owners, contacts, lists, communications, compliance, offers, negotiations, activities, and artifacts.

## Non-Goals

- Search engine as source of truth.
- Raw DNC dashboard exposure.
- Graph database mandatory in initial release.
- Provider-specific schemas leaking into domain.
- Token-compressed summaries replacing raw records.

## Terms

- **Canonical table**: Normalized authoritative table.
- **Raw payload table/artifact**: Original import/provider payload retained for audit/debug.
- **Projection**: Derived search/index/read model that can be rebuilt.
- **Tenant-scoped row**: Row containing `tenant_id` and protected by query constraints.
- **Evidence reference**: Hash/key/ID pointing to protected compliance evidence without exposing raw data.

## Required Behavior

Authoritative persistence must include tenant-scoped entities:

- `tenants`
- `users`
- `teams`
- `roles`
- `permissions`
- `team_memberships`
- `properties`
- `property_addresses`
- `property_source_records`
- `owners`
- `owner_property_links`
- `contacts`
- `contact_points`
- `lead_lists`
- `lead_list_memberships`
- `tags`
- `entity_tags`
- `stages`
- `notes`
- `tasks`
- `follow_ups`
- `activity_events`
- `campaigns`
- `campaign_members`
- `channel_events`
- `email_events`
- `direct_mail_batches`
- `direct_mail_pieces`
- `call_events`
- `sms_events` if SMS enabled
- `opt_outs`
- `email_unsubscribes`
- `internal_dnc_entries`
- `external_dnc_verdicts`
- `consent_records`
- `quiet_hour_rules`
- `call_recording_rules`
- `compliance_verdicts`
- `approval_requests`
- `offers`
- `counteroffers`
- `negotiation_events`
- `deal_analyses`
- `provider_credentials`
- `provider_health_events`
- `llm_prompt_prefixes`
- `llm_cache_metrics`
- `ai_tool_calls`
- `object_artifacts`
- `audit_events`

Initial implementation may create a subset in EP-003 if the ExecPlan states a milestone boundary, but schema names must not conflict with this spec.

## Inputs

- Domain objects.
- Validated API requests.
- CSV imports.
- Provider payloads.
- Webhook events.
- Worker outputs.
- AI/MCP tool audit records.
- Compliance evidence/verdicts.

## Outputs

- Tenant-scoped repository results.
- Activity/audit records.
- Search projection documents.
- Export manifests.
- Backup/restore artifacts.
- Migration status.

## Error States

- Tenant ID missing.
- Unique constraint violation.
- Foreign key violation.
- Invalid migration state.
- Search projection lag/unavailable.
- Object storage artifact missing.
- Duplicate import row.
- Raw DNC access attempted.
- Cross-tenant relationship attempted.
- Encryption/decryption failure.

## Data Rules

- Every tenant-owned table must include `tenant_id`.
- All queries for tenant-owned data must filter by `tenant_id`.
- Use foreign keys for canonical relationships.
- Use immutable audit/activity IDs.
- Use created/updated timestamps.
- Store raw provider payloads in object storage or raw tables with tenant scope.
- Store search projections as rebuildable derived state.
- Store DNC external verdicts as status/reason/evidence refs, not raw public DNC data.
- Store contact point hashes for suppression matching where appropriate.
- Store encrypted credential payloads.
- Store LLM prompt prefix metadata by hash/version; do not store hidden prefix text in ordinary logs or user-visible tables.
- Store retention policy metadata for sensitive artifacts.

## Relationships

- Tenant has many users, teams, properties, owners, contacts, lead lists, campaigns, activities, providers.
- Owner links to properties through ownership links.
- Contact links to owners/properties through relationship tables when needed.
- Lead list membership can reference property, owner, contact, or composite lead entity.
- Campaign members reference lead list members and channel events.
- Offers/counteroffers link to property, owner/contact, and negotiation.
- Compliance verdicts link to campaign/contact point/action and evidence references.
- Activity events link polymorphically through typed entity references.

## Constraints

- Tenant-scoped uniqueness for external IDs.
- Contact point uniqueness should be tenant-scoped and normalized/hashing-aware.
- Lead list membership unique by list and normalized entity key.
- Activity events append-only.
- Approval state transitions auditable.
- Provider credentials unique by tenant/provider/kind.
- Search documents include source canonical IDs and version.

## Retention

Configurable retention required for:

- Call recordings.
- Transcripts.
- AI prompts/responses.
- Provider payloads.
- Campaign logs.
- Exports.
- Mail PDFs/proofs.
- Raw imports.

Deletion must preserve legally required audit records where applicable and avoid raw DNC exposure.

## Migrations

- Use migrations for every schema change.
- Prefer additive migrations.
- Include rollback or restore plan.
- Test migrations on synthetic data.
- Do not run production migrations without explicit permission.

## Security Rules

- Encrypt sensitive credential/compliance/communication data.
- Object artifacts tenant-scoped.
- No raw DNC data in dashboard-readable tables.
- Audit access to sensitive artifacts.
- Prevent cross-tenant joins in repositories.

## Accessibility Rules

Not directly applicable. Data must expose status/reason fields that UI can render accessibly.

## Performance Rules

- Use PostGIS indexes for geospatial property search.
- Use indexes for tenant ID, external source IDs, contact hashes, lead list memberships, campaign status, task due dates, activity timeline entity refs.
- Use search projections for large free-text/filter search.
- Avoid synchronous provider calls inside transactions.
- Batch imports and projections.

## Observability Rules

- Migration status logged.
- Repository errors include request/job ID and redacted identifiers.
- Projection lag measured.
- Backup/restore status measured.
- Query latency tracked for critical paths.

## Required Tests

- Migration applies from empty database.
- Migration is idempotent according to tool conventions.
- Tenant scope tests for repositories.
- Constraint violation tests.
- Search projection rebuild test.
- Object artifact tenant key test.
- DNC raw-data non-exposure test.
- Backup/restore dry-run test where applicable.

## Acceptance Criteria

- Schema implements required initial subset and has path to full entity list.
- Migrations pass integration tests.
- Tenant isolation tests pass.
- Raw data, search projection, and compressed LLM context are separated.
- Sensitive records have protection strategy documented.
