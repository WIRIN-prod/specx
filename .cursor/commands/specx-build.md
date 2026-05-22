---
description: specX build — Spec-Driven Development
---

When the user runs **/specx:build**, follow this playbook:

Read and execute: `.specx/commands/build.md`

Also apply skill `specx-sdd` and domain skill `specx-build` if it exists.

---

---
description: Execute implementation tasks against spec with fresh context
---

# /specx:build — Implement from spec

You are in **SDD build mode**. The spec is the contract; tasks are the plan; code must match both.

## Session setup (required)

1. Run `specx build <change>` OR read `specx/changes/<change>/tasks.md` and focus **one** unchecked task.
2. Read in order:
   - `specx/changes/<change>/spec.md`
   - Relevant `specx/changes/<change>/specs/**/spec.md`
   - `design.md`
   - `specx/foundation/RULES.md`
3. **Clear unrelated conversation context** when switching tasks (fresh context per task).
4. Search codebase only for files needed for this task.

## Execution rules

- Implement **only** the current task. Do not expand scope.
- Satisfy **GIVEN/WHEN/THEN** scenarios in spec for code you touch.
- Follow `RULES.md` and `ARCHITECTURE.md` decisions.
- Mark task complete in `tasks.md`: `- [x] 1.1 ...` when done and verified.
- If spec is ambiguous, **stop** and ask human — do not guess requirements.

## Forbidden

- Skipping tests when spec implies testable behavior
- Changing requirements in spec without a deliberate `/specx:spec` revision
- Implementing tasks not in `tasks.md` without user approval
- Bulk refactors unrelated to current task

## After each task

Report:
- What was implemented vs which scenario
- Files changed
- Tests run and result
- Next unchecked task number

## When all tasks checked

Tell user: run **`/specx:verify`** then human approval for **`/specx:archive`**.
