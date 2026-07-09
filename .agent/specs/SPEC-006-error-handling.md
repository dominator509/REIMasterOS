# SPEC-006: Error Handling

## Status

Draft baseline.

## Owner

Architecture/QA.

## Linked Roadmap Phase

Phases 1-8.

## Linked ExecPlans

- `EP-002-core-domain.md`
- `EP-003-data-and-persistence.md`
- `EP-004-api-or-service-layer.md`
- `EP-007-testing-hardening.md`

## User-Visible Goal

Users receive clear, safe, actionable errors while operators receive structured, redacted diagnostics for debugging.

## Non-Goals

- Exposing stack traces to users.
- Logging secrets or sensitive raw data.
- Retrying non-idempotent live sends blindly.
- Masking compliance blocks as generic errors.
- Letting AI decide error classification.

## Terms

- **Typed error**: Internal structured error with code and metadata.
- **User message**: Safe message for UI/API clients.
- **Retryable**: Error can be retried safely.
- **Non-retryable**: Error should fail and require correction.
- **Blocked-by-policy**: Action blocked by compliance/security policy.
- **Needs-approval**: Action paused until approval.

## Required Behavior

Error taxonomy:

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
- `AI_POLICY_BLOCKED`
- `MIGRATION_FAILED`
- `DEPENDENCY_UNAVAILABLE`
- `INTERNAL_ERROR`

Domain:

- Return typed domain errors/verdicts.
- Do not throw framework-specific errors.

API:

- Map typed errors to stable error envelopes.
- Include request ID.
- Avoid stack traces in production.

Workers:

- Classify job failures as retryable, non-retryable, blocked-by-policy, or needs-approval.
- Use idempotency keys.
- Do not retry compliance-blocked sends.

Provider adapters:

- Normalize provider errors.
- Distinguish auth/config/quota/rate limit/transient/provider validation.

UI:

- Display accessible, actionable messages.
- Preserve compliance reason visibility.
- Avoid raw technical details.

## Inputs

- Validation failures.
- Domain policy failures.
- Repository/provider errors.
- Worker job exceptions.
- AI sanitizer/policy blocks.
- User cancellation/approval expiration.

## Outputs

- Typed errors.
- API error envelope.
- UI error state.
- Worker retry/failure state.
- Activity/audit events for side-effecting failures.
- Redacted structured logs.

## Error States

See taxonomy above.

## Data Rules

- Error metadata must not include secrets, raw DNC, hidden prefixes, raw prompts, raw provider payloads, or production data.
- Activity events can reference entities and reason codes.
- Compliance blocks must include reason codes/evidence refs without raw DNC data.

## Security Rules

- Do not leak stack traces or internals to users.
- Do not log sensitive payloads.
- Treat prompt-injection and hidden-prefix leakage attempts as security-relevant events.
- Rate-limit repeated abuse errors.

## Accessibility Rules

- UI error text must be readable by screen readers.
- Error messages must not rely on color-only indicators.
- Form errors must be associated with fields.

## Performance Rules

- Error handling must not block worker queues.
- Retry backoff must prevent provider hammering.
- Bulk import errors must aggregate row errors without excessive payload sizes.

## Observability Rules

- Error logs include code, request/job ID, tenant ID where applicable, route/operation, status, retry classification.
- Metrics count errors by code and service.
- Alerts for high error rates, compliance service failures, sanitizer blocks, provider failure spikes.

## Required Tests

- Domain typed error tests.
- API error envelope tests.
- UI error state tests.
- Worker retry/non-retry tests.
- Provider error normalization tests.
- Redaction tests.
- Compliance block visibility tests.
- Hidden-prefix sanitizer error tests.

## Acceptance Criteria

- Error taxonomy implemented in contracts/domain.
- API returns stable envelopes.
- UI renders accessible errors.
- Workers do not retry policy-blocked live sends.
- Logs redact sensitive fields.
- Tests pass.
