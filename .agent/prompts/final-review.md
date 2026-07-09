# Prompt: Final Review

Read `AGENTS.md`, `COMMANDS.md`, `.agent/PLANS.md`, and `[EXECPLAN_PATH]`.

Perform final review for `[EXECPLAN_PATH]`.

Required actions:

1. Run the validation commands required by the ExecPlan.
2. Run `sh scripts/verify.sh` unless the ExecPlan explicitly scopes final verification to a narrower command.
3. Run `sh scripts/production-readiness-check.sh` if the ExecPlan affects deployment, security, production readiness, observability, data, or release behavior.
4. Run `git diff --name-only`.
5. Compare changed files with the ExecPlan `Files to Change`.
6. Verify acceptance criteria.
7. Verify docs are updated.
8. Verify no secrets, production data, raw DNC data, or hidden prefixes are present.
9. Update `Outcomes & Retrospective`.
10. Produce a final report.

Do not ask for next steps. Stop only for STOP conditions in `AGENTS.md`.

Final report must include:

- ExecPlan completed.
- Changed files.
- Commands run and results.
- Acceptance criteria status.
- Decisions made.
- Assumptions confirmed or changed.
- Remaining risks.
- Production-readiness status.
