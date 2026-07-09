# SPEC-005: Auth and Permissions

## Status

Draft baseline.

## Owner

Security/Platform.

## Linked Roadmap Phase

Phase 5: Auth, Permissions, and Security.

## Linked ExecPlans

- `EP-006-auth-security-and-permissions.md`
- `EP-004-api-or-service-layer.md`
- `EP-005-user-interface-or-client.md`

## User-Visible Goal

Users can securely access only their tenant/team data and perform only actions allowed by their role, permissions, compliance prerequisites, and approval state.

## Non-Goals

- Anonymous tenant data access.
- Hard dependency on a commercial SSO provider.
- Bypassing RBAC through workers/MCP/AI.
- AI agent privileges broader than the user/session.
- Raw DNC access permission for ordinary users.

## Terms

- **Tenant**: Isolated customer/workspace.
- **Team**: Group inside tenant.
- **Role**: Named permission bundle.
- **Permission**: Specific allowed action.
- **Integration scope**: Provider-specific credential/action scope.
- **High-risk action**: Action requiring approval and/or 2FA.
- **2FA step-up**: Additional verification before high-risk action.

## Required Behavior

Authentication:

- Built-in auth by default.
- Keycloak/authentik optional self-host SSO.
- Ory/Auth0/WorkOS/Okta optional adapters.
- Sessions/tokens expire and refresh according to config.
- Production cookies/tokens use secure settings.

Authorization:

- Deny by default.
- Tenant scope required.
- RBAC enforced on API, workers, MCP tools, provider settings, exports, campaigns, AI actions, Telegram/mobile commands.
- Integration scopes restrict provider credential use.
- Workers must recheck authorization-relevant policy before side effects when job state may be stale.

High-risk actions requiring approval and/or 2FA:

- Sending purchase agreement.
- Changing offer price.
- Waiving contingencies.
- Committing to close date.
- Committing to seller credits.
- Launching cold call campaigns.
- Launching mass direct mail/email/SMS campaigns.
- Enabling outbound AI voice.
- Provider credential changes.
- DNC/provider compliance setting changes.
- Telegram account linking.
- Hosted AI enablement for tenant where sensitive data may be sent.

## Inputs

- Login credentials.
- SSO assertions where configured.
- Session/token.
- Tenant ID.
- Role/permission assignment.
- Approval request.
- 2FA challenge result.
- Telegram/mobile linking challenge.

## Outputs

- Authenticated session.
- Permission verdict.
- Approval state.
- Audit event.
- Denial error.
- Step-up requirement.

## Error States

- Invalid credentials.
- Expired session.
- Missing tenant.
- Permission denied.
- 2FA required.
- Approval required.
- Approval expired.
- Account/linking token expired.
- Cross-tenant access attempted.
- Provider scope denied.

## Data Rules

- Store password hashes only if built-in auth uses passwords.
- Store sessions securely.
- Store provider credentials encrypted.
- Store approval/audit logs.
- Store Telegram account links tenant/user scoped.
- Do not store raw 2FA secrets unencrypted.
- Do not expose permission internals beyond necessary UI states.

## Security Rules

- Strong password policy if passwords used.
- Rate-limit auth attempts.
- CSRF protection if cookie sessions.
- Secure cookies in production.
- Token audience/issuer validation for SSO.
- 2FA for high-risk actions.
- Audit all auth, permission, and approval events.
- Deny disabled users.
- Deny users outside tenant.
- Do not allow AI/MCP/tool path to exceed user permissions.

## Accessibility Rules

- Auth forms have labels and errors.
- 2FA flows are keyboard accessible.
- Permission denied and approval required messages are clear.
- High-risk confirmation text is readable and not color-only.

## Performance Rules

- Permission checks must be efficient and cacheable per request.
- Permission cache must be invalidated on role/permission changes.
- Auth rate limiting must not block ordinary valid session checks.

## Observability Rules

- Log auth failures with redacted identifiers.
- Log permission denials with reason code.
- Log approval lifecycle events.
- Metrics for auth failures, 2FA failures, permission denials, high-risk approvals.
- Do not log passwords, tokens, 2FA secrets, or provider credentials.

## Required Tests

- Login success/failure.
- Session expiration.
- RBAC allowed/denied.
- Cross-tenant denial.
- Integration scope denial.
- High-risk action requires 2FA/approval.
- Telegram linking requires 2FA and expires.
- Worker/MCP action permission scope test.
- Audit event creation.
- Secure cookie/header config test.

## Acceptance Criteria

- Auth works in built-in mode.
- RBAC denies unauthorized actions.
- Tenant isolation tests pass.
- High-risk action approval/2FA tests pass.
- AI/MCP cannot exceed user permissions.
- Security docs and env vars updated.
