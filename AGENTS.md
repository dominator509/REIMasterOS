# AGENTS.md

This file is the control plane for coding agents working in this repository.

## 1. Mission

Build the **Real Estate Investor / Acquisitions OS**: a self-hostable, AI-native, provider-agnostic, compliance-gated real estate intelligence, CRM, outreach, negotiation, activity, and automation platform for investors and acquisition teams.

The product is investor/acquisitions-first. Licensed-agent and brokerage workflows are optional modules. Paid SaaS integrations are optional accelerators; core CRM, local AI, SMTP email, manual direct-mail export, activity tracking, follow-ups, dashboard use, and basic automation must work without mandatory paid vendors.

## 2. Source-of-Truth Priority

When instructions conflict, apply this priority order:

1. Current user instruction in the active coding-agent session.
2. `AGENTS.md`.
3. Active ExecPlan under `.agent/execplans/`.
4. Existing repository code and tests.
5. `ARCHITECTURE.md`.
6. Relevant spec under `.agent/specs/`.
7. `ROADMAP.md`.

`ROADMAP.md` is strategic only. Do not implement directly from it.

## 3. Required Workflow

Every coding agent must:

1. Read `AGENTS.md`.
2. Read `COMMANDS.md`.
3. Read `.agent/PLANS.md`.
4. Read exactly one active ExecPlan.
5. Read files listed in the active ExecPlan before editing.
6. Run `sh scripts/preflight.sh`.
7. Complete milestones in the active ExecPlan in order.
8. Validate after every milestone using the command listed for that milestone.
9. Update the active ExecPlan `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds.
10. Continue autonomously through the active ExecPlan.
11. Stop only under the STOP conditions below.
12. Before final response, run required validation, run `git diff --name-only`, compare changed files to expected changed files, and document any justified extra files.

**Do not ask the user for next steps. Proceed autonomously through the active ExecPlan unless a STOP condition applies.**

## 4. STOP Conditions

Stop and report the blocker only when one of these conditions applies:

- A required secret, credential, paid service, external account, DNC credential, MLS license, property-data license, telephony account, SMS account, postage/direct-mail account, or hosted AI key is missing and no local/manual fallback is specified in the active ExecPlan.
- The requested action may destroy user or production data.
- The requested action requires production deployment, live campaign launch, irreversible migration, or destructive migration without explicit permission.
- The task requires legal, security, financial, licensing, real-estate-agency, DNC, TCPA, CAN-SPAM, fair-housing, MLS/RESO, USPS, or brokerage judgment not already specified in repository docs.
- User-visible behavior differs materially from the active spec and the spec does not resolve the choice.
- Required tests cannot run after documented recovery attempts and the active ExecPlan does not allow a narrower validation substitute.
- A dependency license, vendor terms, code provenance, or third-party attribution issue blocks safe implementation.
- An AI or automation path would bypass compliance checks, approval gates, audit logging, tenant isolation, or hidden-prefix sanitization.
- A repository state conflict prevents applying the active ExecPlan without broad unrelated refactoring.
- The agent has reached the anti-fixation third-failure rule and cannot choose a simpler safe path.

When stopping, final output must include:

- Exact blocker.
- Evidence from file contents or terminal output.
- Smallest decision needed.
- Recommended default consistent with specs.
- Files changed before stopping.
- Commands run and results.

## 5. Anti-Drift Rules

- Implement one active ExecPlan only.
- Do not jump between ExecPlans.
- Do not implement directly from `ROADMAP.md`.
- Do not broaden scope beyond the active ExecPlan.
- Do not perform broad refactors, styling rewrites, dependency swaps, file reorganizations, naming overhauls, or unrelated cleanup unless explicitly required by the active ExecPlan.
- Do not convert the product into an agent-only platform.
- Do not make PropStream, Cobras, Mailchimp, Twilio, SignalWire, Lob, Mapbox, Google, Auth0, DeepSeek, or any other paid vendor mandatory.
- Do not create DNC lead-source functionality.
- Do not expose raw DNC data.
- Do not make fully autonomous outbound AI cold calling the default.
- Do not let AI make binding offers, waive contingencies, send purchase agreements, commit to seller credits, or launch high-risk campaigns without deterministic approval checks.

## 6. Anti-Hallucination Rules

- Do not invent package APIs.
- Do not invent command names.
- Do not invent environment variables.
- Do not invent database tables.
- Do not invent routes.
- Do not invent config keys.
- Do not invent provider capabilities.
- Do not invent legal permissions or vendor terms.
- Confirm names by reading repository files.
- Use commands from `COMMANDS.md`.
- If a command is missing or stale, update `COMMANDS.md` first using repository evidence.
- If an interface does not exist, create it only when the active ExecPlan lists it as expected work.
- Record assumptions in the active ExecPlan `Decision Log` and, when durable, in `ASSUMPTIONS.md`.

## 7. Anti-Fixation Rules

For any failing validation command:

1. First failure:
   - Read the exact error.
   - Identify likely cause.
   - Make the smallest targeted fix.
   - Rerun the same or narrower validation command.

2. Second same-root failure:
   - Create or run a narrower diagnostic.
   - Isolate the failure.
   - Avoid broad rewrites.

3. Third same-root failure:
   - Stop the current approach.
   - Record failed hypotheses in `Surprises & Discoveries`.
   - Choose a simpler implementation path if one is safe and inside scope.
   - Continue only if the simpler path has a clear validation command.
   - Otherwise stop under STOP conditions.

Never repeatedly patch around the same error without a new hypothesis.

## 8. Dependency Rules

- Prefer existing dependencies and standard library features.
- Before adding any dependency:
  1. Inspect existing dependency files.
  2. Confirm the active ExecPlan permits the category of dependency.
  3. Check if the behavior can be implemented with existing tools.
  4. Add the smallest necessary dependency.
  5. Pin or lock versions according to repository package manager rules.
  6. Update `COMMANDS.md`, `SECURITY.md`, `DECISIONS.md`, and relevant docs if the dependency changes commands, runtime, license, or security posture.
- GPL/AGPL/copyleft projects must be optional external/sidecar integrations unless legal review approves deeper bundling.
- RTK/Rust Token Killer code or binaries must not be bundled, forked, or modified until license/provenance review is recorded in an ADR.

## 9. File Creation Rules

- Create only files listed in the active ExecPlan or files required by existing framework conventions.
- If an extra file is necessary, record why in the active ExecPlan `Decision Log`.
- Do not commit generated caches, build artifacts, logs, secrets, raw vendor payloads, raw DNC data, call recordings, transcripts, mail proofs, or production exports unless the active ExecPlan explicitly creates safe fixtures.
- Keep fixture data synthetic.

## 10. Testing Rules

- Tests are required for every behavior change.
- Domain logic must have unit tests.
- Persistence must have migration and repository integration tests.
- API/service boundaries must have request validation, authorization-hook, error, and contract tests.
- UI/client work must have component or E2E/acceptance coverage for primary, loading, empty, and error states.
- Compliance gates must have explicit tests for `allowed`, `blocked`, and `needs_approval`.
- AI prompt/cache/sanitizer work must have regression tests for deterministic prefixes, hidden-prefix leakage, streaming sanitization, prefix drift, and cache telemetry.
- Provider adapters must have contract tests with mocked providers and no live paid-service calls in default CI.
- Use `COMMANDS.md` for all validation commands.

## 11. Documentation Update Rules

Update docs in the same change when implementation changes:

- Commands or scripts: update `COMMANDS.md`.
- Environment variables: update `ENVIRONMENT.md`.
- Architecture boundaries: update `ARCHITECTURE.md` and `DECISIONS.md`.
- Security behavior: update `SECURITY.md`.
- Observability behavior: update `OBSERVABILITY.md`.
- Deployment behavior: update `DEPLOYMENT.md`, `RELEASE.md`, and `ROLLBACK.md`.
- Scope/behavior: update the relevant spec in `.agent/specs/`.
- Durable assumptions: update `ASSUMPTIONS.md`.

## 12. Security Rules

- Never commit secrets.
- Never log secrets, provider tokens, DNC raw data, hidden prefixes, raw compiled prompts, call recordings, or sensitive contact details outside approved secure stores.
- Encrypt or strongly protect provider credentials, DNC/compliance data, consent data, communications, call recordings, transcripts, raw prompts, and vendor payloads.
- Enforce tenant isolation at every UI, API, worker, database, MCP, AI, and provider boundary.
- Hosted LLM calls must minimize sensitive data and must be optional.
- Streaming AI output must be buffered and sanitized before user visibility.
- Hidden prefixes must not appear in dashboard chat, Telegram/mobile alerts, voice transcripts, emails, SMS, direct-mail content, activity timelines, ordinary logs, or screenshots.
- National DNC data is suppression-only and must not be shown raw in the dashboard.
- High-risk actions require deterministic policy checks and approval records.

## 13. Production Data Rules

- Do not run destructive commands against production.
- Do not run irreversible migrations without explicit permission.
- Do not use production data in tests.
- Do not export production data unless the active ExecPlan explicitly requires it and a safe export path is documented.
- Do not use real phone numbers, emails, addresses, owners, sellers, or DNC data as fixtures.
- Raw data is authoritative. Token-compressed summaries are never legal/system-of-record data.
- Backups and restore paths must be verified before production migrations.

## 14. Definition of Done

An ExecPlan is done only when:

- All milestones are completed in order.
- All acceptance criteria pass.
- Required validation commands pass.
- Active ExecPlan `Progress` is updated.
- `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` are updated.
- Final diff is reviewed with `git diff --name-only`.
- Changed files match expected files or extras are justified.
- Relevant docs are updated.
- No secrets or production data are present.
- Remaining risks are documented.

## 15. Final Response Requirements

A coding agent final response must include:

- ExecPlan completed.
- Changed files.
- Commands run.
- Command results.
- Acceptance criteria status.
- Decisions made.
- Assumptions confirmed or changed.
- Remaining risks.
- Whether production-readiness criteria passed.
- Any STOP condition, if work stopped early.
