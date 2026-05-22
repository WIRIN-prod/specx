---
description: /specx:build — follow specX skill specx-build
---

# /specx:build

**Apply the full specX skill:** `.cursor/skills/specx-build/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX build — Implement from spec (GSD + Kiro)

**Kiro:** Spec is the contract — if it's not in spec, don't build it without spec revision.  
**GSD:** Fresh context per task — treat each checkbox as a new session.  
**Ralph:** Git is memory — commit logical units; don't rely on chat.

## Session setup (mandatory)

1. Identify change: `specx status` or user name
2. Open `specx/changes/<change>/tasks.md` — pick **one** `- [ ] X.Y` task
3. Load **only**:
   - That task line + referenced requirement/scenario
   - Relevant `specs/**/spec.md` sections (not entire repo spec)
   - `design.md` sections referenced by task
   - `RULES.md`
4. **Clear unrelated chat context** when starting a new task number
5. Grep codebase narrowly for files in design/task scope

## Implementation rules

| Rule | Action |
|------|--------|
| Scope | Only current task |
| Spec | Satisfy GIVEN/WHEN/THEN for referenced scenarios |
| Patterns | Follow ARCHITECTURE + RULES |
| Done | Mark `- [x] X.Y` only after tests/verification |
| Ambiguity | Stop — ask human or request specx-spec revision |
| Scope creep | Reject — belongs in new propose |

## Per-task report

```markdown
## Task X.Y complete
- Requirement: ...
- Scenario: ...
- Files: ...
- Tests: ...
- Next: X.Z
```

## Testing

If spec scenario is testable, add/run tests in same task. Do not defer all tests to end unless tasks.md explicitly batches them.

## Forbidden

- Implementing unchecked tasks in same session without user OK
- Editing living `specx/specs/` directly (change deltas only until archive)
- Changing requirements without specx-spec pass
- Drive-by refactor

## When all tasks `[x]`

1. **specx-verify** — Ralph loop until READY
2. Human explicit approval
3. **specx-archive**

## Context rot warning

If conversation > ~30 turns on one task, suggest `/clear` or new session with task brief from `specx build <change> --task X.Y`.
