# Agent Readiness Checklist

Use before handing an ExecPlan to a coding agent.

- [ ] Exactly one active ExecPlan is selected.
- [ ] Active ExecPlan is self-contained.
- [ ] Active ExecPlan lists exact files to read.
- [ ] Active ExecPlan lists expected files to change.
- [ ] Active ExecPlan lists explicit non-goals.
- [ ] Active ExecPlan lists STOP conditions through `AGENTS.md`.
- [ ] Active ExecPlan milestones are ordered.
- [ ] Every milestone has goal, files to read, files to change, exact edits, validation command, expected result, and recovery instruction.
- [ ] Commands come from `COMMANDS.md`.
- [ ] Expected command outputs are stated.
- [ ] Acceptance criteria are observable.
- [ ] Recovery rules include bounded retry.
- [ ] Diff review requirement is present.
- [ ] No hidden context is required.
- [ ] No vague requirements such as "make it better" or "best practices" remain.
- [ ] No roadmap-only implementation is requested.
- [ ] No production deployment or destructive migration is requested without explicit permission.
- [ ] No live provider credentials are required unless fallback exists.
- [ ] No PropStream/Cobras copying is requested.
- [ ] No raw DNC exposure is requested.
