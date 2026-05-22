---
description: Implement one tasks.md checkbox against spec with fresh context. Use for /specx:build, implement feature, execute tasks, coding from specx/changes.
---

# specX build — Implement from spec

**SDD build mode**: spec = contract; tasks = plan; code must match both.

## Session setup (required)

1. `specx build <change>` OR open `specx/changes/<change>/tasks.md` — pick **one** unchecked `- [ ]` task
2. Read in order:
   - `spec.md` + `specs/**/spec.md` deltas
   - `design.md`
   - `specx/foundation/RULES.md`
3. **Clear unrelated chat context** when switching tasks
4. Search codebase only for files this task needs

## Execution rules

- Implement **only** the current task
- Satisfy **GIVEN/WHEN/THEN** for touched scenarios
- Follow RULES.md and ARCHITECTURE.md
- Mark done: `- [x] 1.1 ...` after verify
- Ambiguous spec → **stop and ask** — never guess requirements

## Forbidden

- Skip tests when spec implies testability
- Change spec without specx-spec revision
- Tasks not in tasks.md without user approval
- Drive-by refactors

## After each task

Report:

- Implementation vs requirement/scenario
- Files changed
- Tests run
- Next task number

## When all `[x]`

User runs **specx-verify**, then **specx-archive** after explicit approval.
