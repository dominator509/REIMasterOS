# EP-XXX: [Title]

## 1. Purpose / Big Picture

[Explain why this change exists and what user/system outcome it enables. A new agent with no prior conversation must understand the goal.]

## 2. Scope

- [In-scope item 1]
- [In-scope item 2]

## 3. Non-goals

- [Out-of-scope item 1]
- [Out-of-scope item 2]
- No broad refactors unless explicitly listed.
- No roadmap-only implementation.

## 4. Context and Orientation

[Describe current repository state, relevant architecture layer(s), and key constraints.]

## 5. Files to Read First

- `AGENTS.md`
- `COMMANDS.md`
- `.agent/PLANS.md`
- `[relevant spec]`
- `[existing source file]`

## 6. Files to Change

Expected changed files/directories:

- `[file or directory]`

Any extra file must be justified in the Decision Log.

## 7. Interfaces and Contracts

[Describe APIs, schemas, functions, database tables, events, provider interfaces, UI contracts, or command outputs.]

## 8. Milestones

### Milestone 1: [Name]

- **Goal:** [Specific goal]
- **Files to read:** `[files]`
- **Files to change:** `[files]`
- **Exact edits expected:** [Concrete edits]
- **Validation command:** `[command from COMMANDS.md]`
- **Expected result:** [Exact success condition]
- **Recovery instruction:** [Bounded recovery]

## 9. Concrete Steps

### Milestone 1 Steps: [Name]

1. Read listed files.
2. Inspect existing patterns.
3. Apply exact edits.
4. Run validation.
5. Update Progress.

## 10. Validation and Acceptance

Required final validation:

```sh
sh scripts/verify.sh
```

Acceptance criteria:

- [Criterion 1]
- [Criterion 2]
- Required validation commands pass.
- Diff contains only expected files or justified extras.

## 11. Idempotence and Recovery

- Prefer additive changes.
- Use deterministic fixtures.
- Apply bounded retry.
- Stop only for STOP conditions in `AGENTS.md`.

## 12. Progress

- [ ] Milestone 1 complete.

## 13. Surprises & Discoveries

- [Add dated entries as work proceeds.]

## 14. Decision Log

- [Add dated decisions with reason and files affected.]

## 15. Outcomes & Retrospective

- Status:
- Completed milestones:
- Validation summary:
- Changed files summary:
- Remaining risks:
