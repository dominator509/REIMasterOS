# SPEC-001: Core Domain

## Status

Draft baseline.

## Owner

Domain Architecture.

## Linked Roadmap Phase

Phase 1: Core Domain.

## Linked ExecPlans

- `EP-002-core-domain.md`
- `EP-006-auth-security-and-permissions.md`
- `EP-007-testing-hardening.md`

## User-Visible Goal

Users can manage real estate acquisition workflows around properties, owners, contacts, lead lists, campaigns, offers, negotiations, compliance, follow-ups, and activity without vendor lock-in.

## Non-Goals

- Database persistence.
- UI rendering.
- Provider SDK calls.
- Live outreach.
- AI model calls.
- MLS/provider-specific normalization beyond domain interfaces.
- Legal advice.

## Terms

- **Property**: Canonical real property record with address, parcel, geospatial, valuation, and source references.
- **Owner**: Person or entity linked to one or more properties.
- **Contact**: Reachable person/entity related to an owner/property.
- **Contact point**: Phone, email, mailing address, Telegram/mobile/device, or other channel endpoint.
- **Lead list**: Tenant-scoped collection of properties/owners/contacts with list-stacking metadata.
- **Campaign**: Outreach workflow through a channel.
- **Compliance verdict**: `allowed`, `blocked`, or `needs_approval` plus reason codes and evidence references.
- **Offer ladder**: Opening, target, stretch, walk-away, and concession strategy.
- **Activity event**: Append-only record of meaningful user/system/provider/AI activity.

## Required Behavior

Domain must model:

- Tenants and tenant IDs.
- Users, teams, roles, and permissions as domain concepts or contracts.
- Properties with canonical address, parcel/APN, location, property type, valuation assumptions, listing/source signals.
- Owners with mailing address, ownership links, ownership length, entity/person type.
- Contacts and contact points with verification/consent/suppression state.
- Lead lists with membership, stacking sources, deduplication keys, tags, stages, scores.
- Notes, tasks, due dates, follow-ups, assignments.
- Universal activity events for all side effects.
- Campaign definitions and channel types.
- Compliance verdicts and reason codes.
- Internal DNC, opt-out, unsubscribe, consent, quiet-hours, call-recording consent flags.
- Offers, counteroffers, negotiation events, approval states.
- Deal math: ARV, repairs, holding, closing, fees, profit, MAO, target, stretch, walk-away.
- Negotiation guidance safety:
  - tactical empathy patterns are allowed as communication style.
  - misrepresentation, invented offers, false funds, protected-class use, confidential motivation misuse, unauthorized commitments, and impersonation are blocked/warned.
- Provider capability and fallback concepts.
- AI action policy classifications.

## Inputs

- Raw normalized facts supplied by application layer.
- User commands validated by API.
- Time/clock injected into domain services.
- Tenant policy settings.
- Provider capability snapshots.
- Compliance facts.
- Deal assumption values.
- Negotiation transcript snippets passed as data.

## Outputs

- Domain entities/value objects.
- Validation results.
- Compliance verdicts.
- Approval requirements.
- Activity event descriptors.
- Deal math results.
- Negotiation strategy objects.
- Provider fallback decisions.
- AI action policy decisions.

## Error States

- Invalid tenant ID.
- Invalid address/contact point.
- Invalid campaign channel.
- Missing compliance evidence.
- Missing approval.
- High-risk action blocked.
- Unsupported provider capability.
- Invalid deal assumptions.
- Cross-tenant entity relationship attempted.
- Attempt to use DNC as lead source.
- Attempt to treat compressed context as authoritative.

## Data Rules

- All domain objects include tenant scope when tenant-owned.
- IDs are opaque.
- Contact points track status and consent/suppression facts.
- Compliance verdicts include reason codes and evidence references, not raw DNC data.
- Activity events are append-only.
- Deal math stores assumptions separately from source facts.
- AI outputs cannot alter authoritative values without explicit user/system action and approval where needed.

## Security Rules

- Domain denies unsafe action by default.
- Domain does not rely on model output for compliance decisions.
- Domain classifies high-risk actions deterministically.
- Domain never stores or exposes hidden prefixes.
- Domain has no access to secrets.

## Accessibility Rules

Not directly applicable to pure domain. Domain must return structured states that UI can present accessibly.

## Performance Rules

- Domain operations must be deterministic and fast for single-entity workflows.
- Bulk list scoring/deduping must be designed as pure functions that can run in workers.
- Avoid O(n^2) behavior for list stacking where hash/map-based dedupe is possible.

## Observability Rules

Domain does not log directly. It returns reason codes and event descriptors that application/worker layers log.

## Required Tests

- Entity/value object validation tests.
- Lead list dedupe/list stacking tests.
- Compliance verdict tests for DNC, opt-out, unsubscribe, consent, quiet hours, call recording, approval requirements.
- AI action policy tests.
- Deal math tests.
- Negotiation safety tests.
- Activity event generation tests.
- Provider fallback decision tests.
- Tenant relationship guard tests.

## Acceptance Criteria

- Domain package imports no app, UI, database, provider SDK, environment, queue, or telemetry modules.
- Unit tests cover required behaviors.
- All high-risk actions produce `blocked` or `needs_approval` unless explicit safe prerequisites are supplied.
- DNC cannot be modeled as a lead source.
- Manual/self-host fallback rules are represented.
