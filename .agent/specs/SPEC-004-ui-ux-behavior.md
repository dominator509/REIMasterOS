# SPEC-004: UI/UX Behavior

## Status

Draft baseline.

## Owner

Product/Frontend.

## Linked Roadmap Phase

Phase 4: UI or Client Layer.

## Linked ExecPlans

- `EP-005-user-interface-or-client.md`
- `EP-007-testing-hardening.md`
- `EP-010-production-readiness.md`

## User-Visible Goal

Users can operate the platform from an accessible dashboard/PWA with clear CRM, property, search, campaign, compliance, activity, AI, cost, and provider workflows.

## Non-Goals

- Native mobile app in initial release.
- PropStream UI clone.
- Cobras UI copy.
- Map-only workflows.
- AI output displayed before sanitizer.
- Live campaign launch without compliance/approval UI.

## Terms

- **Dashboard shell**: Main authenticated web UI.
- **Universal timeline**: Activity feed for property, owner, contact, list, campaign, negotiation, or tenant.
- **Compliance block**: UI state showing action is blocked and reason.
- **Approval state**: UI state showing high-risk action requires human approval.
- **Cost Optimization Center**: UI for provider/fallback health, cost, and route selection.

## Required Behavior

Initial UI must provide:

- Authenticated dashboard shell after auth exists.
- Tenant/mode indicator.
- Navigation for:
  - Dashboard overview.
  - Properties.
  - Owners/contacts.
  - Lead lists.
  - Tasks/follow-ups.
  - Campaigns.
  - Activity timeline.
  - Compliance.
  - AI assistant.
  - Cost Optimization Center.
  - Provider settings.
- Property search/list view.
- Property detail view.
- Owner/contact detail view.
- Lead list detail with stacking/deduping status.
- CSV import flow with preview, validation errors, and commit.
- Task/follow-up create/update.
- Universal activity timeline.
- Campaign setup with channel/fallback selection.
- Compliance verdict display.
- Approval request display.
- Manual direct-mail export action.
- Manual email export action.
- AI assistant shell for Hermes/local mode.
- Provider health/cost display.
- MapLibre map with list/table alternative.

## Inputs

- User form input.
- Search filters.
- CSV uploads.
- Button/menu actions.
- AI chat messages.
- Approval clicks.
- Provider setting fields.
- Real-time events.

## Outputs

- Accessible rendered pages/components.
- API requests using contracts.
- Toasts/alerts where appropriate.
- Export download links.
- Approval tasks.
- Sanitized AI responses.
- Real-time timeline updates.

## UI States

Every primary screen must handle:

- Loading.
- Empty.
- Populated.
- Validation error.
- Permission denied.
- Compliance blocked.
- Approval required.
- Provider not configured.
- Offline/retry where PWA supports it.

## Error States

- Network error.
- API validation error.
- Auth expired.
- Forbidden.
- Tenant not selected.
- Import failed.
- Export failed.
- Provider disabled.
- AI route disabled.
- AI sanitizer blocked.
- Real-time disconnected.

## Data Rules

- Do not store secrets in browser local storage.
- Do not display raw DNC data.
- Do not display hidden prefixes.
- Use signed/authorized artifact downloads.
- Use API contracts, not ad hoc response shapes.
- Avoid unnecessary hosted calls in local-only mode.

## Security Rules

- UI must not implement compliance decisions.
- UI must not call provider APIs directly.
- UI must not call MCP tools directly.
- UI must show compliance/approval states returned by API.
- High-risk buttons must require explicit approval state and 2FA where specified.
- Expiring approval links/buttons for Telegram/mobile must show expiration where surfaced.

## Accessibility Rules

- WCAG 2.1/2.2 AA target where practical.
- Keyboard navigation for major workflows.
- Semantic headings and landmarks.
- Form labels, descriptions, validation messages.
- Clear accessible button names.
- Color not sole status indicator.
- Screen-reader friendly tables/lists.
- Compliance blocks and due dates announced/accessibly labelled.
- Real-time updates must be polite and not interruptive unless critical.
- AI chat keyboard accessible.
- Voice console transcript text available.
- Charts include textual/table summaries.
- Map workflows include list/table alternative.

## Performance Rules

- Paginate large lists.
- Debounce search input.
- Use server-side filters for property search.
- Do not render huge timelines without virtualization/pagination.
- Real-time updates should patch visible views without full reload.
- AI streaming must buffer/sanitize before visibility.

## Observability Rules

- Include client-side error reporting with redaction where configured.
- Track route load errors, API errors, real-time disconnects, and sanitizer blocks.
- Do not log PII, secrets, hidden prefixes, or raw DNC data from the browser.

## Required Tests

- Dashboard shell renders.
- Navigation works.
- Property search empty/populated/error states.
- CSV import validation state.
- Compliance block state.
- Approval required state.
- Manual direct-mail export flow.
- Manual email export flow.
- AI sanitizer block display.
- Accessibility checks for critical pages.
- Keyboard navigation smoke tests.
- Map workflow table alternative test.

## Acceptance Criteria

- UI implements primary initial flows.
- All primary screens handle required states.
- Accessibility requirements are tested for critical flows.
- No raw DNC/secrets/hidden prefixes shown.
- UI calls API contracts only.
- E2E/acceptance tests pass.
