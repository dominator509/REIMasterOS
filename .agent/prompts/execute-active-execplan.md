# Prompt: Execute Active ExecPlan

Read `AGENTS.md`, `COMMANDS.md`, `.agent/PLANS.md`, and `[EXECPLAN_PATH]`.

Optional user request/context:

`[OPTIONAL_USER_REQUEST]`

Implement `[EXECPLAN_PATH]` to completion.

Rules:

- Run `sh scripts/preflight.sh` before editing.
- Read all files listed in the ExecPlan.
- Complete milestones in order.
- Validate after every milestone using the command listed in the ExecPlan.
- Update the ExecPlan `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as you work.
- Use only commands from `COMMANDS.md`.
- Do not ask for next steps.
- Do not implement from `ROADMAP.md` directly.
- Do not broaden scope.
- Do not invent commands, APIs, env vars, routes, tables, or config keys.
- Stop only for STOP conditions in `AGENTS.md`.
- Before final response, run required verification, run `git diff --name-only`, compare changed files to expected changed files, and update the ExecPlan.
- Final response must include changed files, commands run, command results, decisions, assumptions, risks, and acceptance status.
