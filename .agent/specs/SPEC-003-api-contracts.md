# SPEC-003: API Contracts

## Status

Draft baseline.

## Owner

API Architecture.

## Linked Roadmap Phase

Phase 3: API or Service Layer.

## Linked ExecPlans

- `EP-004-api-or-service-layer.md`
- `EP-006-auth-security-and-permissions.md`
- `EP-007-testing-hardening.md`

## User-Visible Goal

Users and approved clients can perform CRM, property, lead list, campaign, compliance, activity, AI, and provider configuration workflows through stable, validated, tenant-scoped service contracts.

## Non-Goals

- Direct database API.
- Direct provider SDK exposure.
- AI direct backend API access.
- Live provider calls in default tests.
- Public unauthenticated access to tenant data.

## Terms

- **API/BFF**: Backend for frontend and external clients.
- **Contract**: Request/response schema shared through `packages/contracts`.
- **Command endpoint**: Endpoint that changes state.
- **Query endpoint**: Endpoint that reads state.
- **MCP tool**: AI-callable action exposed through MCP Gateway, not arbitrary API.

## Required Behavior

API must provide or plan contracts for:

- Auth/session.
- Tenant selection.
- Properties search/list/detail/create/update where applicable.
- Owners/contacts/contact points.
- Lead lists and memberships.
- CSV import preview/commit.
- Notes/tasks/follow-ups.
- Activity timeline.
- Campaigns and channel events.
- Compliance verdict check.
- Approval requests.
- Manual email export.
- Manual direct-mail PDF/CSV export.
- Voice/manual call task event logging.
- Provider settings and health/cost.
- AI chat request through LLM gateway.
- MCP tool audit records.
- Deal analysis and negotiation copilot.
- WebSocket/SSE activity feed.

## Inputs

- JSON API requests.
- Multipart CSV/file uploads where applicable.
- Webhook payloads from providers.
- WebSocket/SSE connection requests.
- MCP gateway internal calls.
- Telegram/mobile command API calls.

## Outputs

- JSON responses with stable schema.
- Export files/artifact references.
- Activity events.
- Approval states.
- Compliance verdicts.
- Error envelopes.
- Real-time events.

## Standard Response Envelope

Success:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_123",
    "tenantId": "ten_123"
  }
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The request is invalid.",
    "details": []
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

Compliance verdict:

```json
{
  "data": {
    "verdict": "blocked",
    "reasonCodes": ["MISSING_DNC_PROVIDER"],
    "evidenceRefs": ["evidence_hash_or_id"],
    "requiredApprovals": [],
    "userMessage": "Outbound calling is blocked until DNC suppression is configured."
  },
  "meta": {
    "requestId": "req_123",
    "tenantId": "ten_123"
  }
}
```

## Error States

- `VALIDATION_FAILED`
- `UNAUTHENTICATED`
- `FORBIDDEN`
- `TENANT_NOT_FOUND`
- `NOT_FOUND`
- `CONFLICT`
- `COMPLIANCE_BLOCKED`
- `APPROVAL_REQUIRED`
- `PROVIDER_NOT_CONFIGURED`
- `PROVIDER_UNAVAILABLE`
- `RATE_LIMITED`
- `IMPORT_FAILED`
- `EXPORT_FAILED`
- `AI_ROUTE_DISABLED`
- `AI_SANITIZER_BLOCKED`
- `INTERNAL_ERROR`

## Data Rules

- All tenant-owned requests require tenant context.
- Responses must not include raw DNC data.
- Responses must not include secrets.
- Artifact downloads require signed/authorized access.
- API must not return hidden prefixes or raw compiled prompts.
- Pagination required for list endpoints.
- Bulk endpoints must use job IDs for long-running work.

## Security Rules

- Auth required except health/public metadata.
- RBAC required for every operation.
- CSRF/session protection if cookie sessions used.
- Rate limits on critical endpoints.
- Webhook signature verification where supported.
- High-risk endpoints must call compliance/approval policy.
- MCP endpoints are internal/policy-gated, not public arbitrary tools.

## Accessibility Rules

API must return structured status/reason fields so UI can present accessible messages. Error messages must be clear and not depend on color/icon-only UI.

## Performance Rules

- Search endpoints must support pagination and indexed filters.
- Bulk imports and campaign launches must be asynchronous.
- Webhooks must acknowledge quickly and defer processing to workers.
- AI requests must use deterministic prefixes for eligible workflows.
- Long-running operations return job IDs/status.

## Observability Rules

- Include request IDs.
- Log route, status, latency, tenant ID, user ID, error code.
- Emit metrics for request counts, errors, latency, compliance verdicts, provider errors, and AI route/cache metrics.
- Audit high-risk and AI/MCP actions.

## Required Tests

- Request validation tests.
- Auth/RBAC denial tests.
- Tenant isolation tests.
- Error envelope tests.
- Compliance verdict endpoint tests.
- Approval-required endpoint tests.
- Export endpoint tests with synthetic data.
- Webhook verification tests.
- Real-time activity event tests.
- AI sanitizer block tests.

## Acceptance Criteria

- API contracts are defined in shared schemas.
- Core endpoints use standard response envelope.
- High-risk paths cannot bypass compliance/approval.
- Raw DNC, secrets, and hidden prefixes are not returned.
- Contract/integration tests pass.
