---
name: specx-build
description: >-
  specX build — implement all open tasks.md items against spec scenarios (default), or one
  task with --task. Kiro: spec is contract. Use /specx:build or coding from changes.
---

# specX build — Implement from spec (Kiro + Ralph)

**Kiro:** Spec is the contract — if it's not in spec, don't build it without spec revision.  
**Default:** `specx build` implements **all** unchecked tasks in order in one run.  
**Ralph:** Git is memory — commit logical units; don't rely on chat.

## Session setup (mandatory)

1. Start at **[[Home]]** → active feature `[[.../FEATURE]]` (or `specx status`)
2. Follow **`## Graph`** upstream: [[spec]], [[design]], [[foundation/STEERING]], linked discovery phases
3. Run `specx build` — brief lists **every** open `- [ ]` task
4. Load each linked artifact via wikilinks (not chat memory)
5. Implement **all** open tasks unless user explicitly asked for one task

### Single-task mode (only when user asks)

```bash
specx build --task 1.2
```

One checkbox per session — use for huge changes or context limits only.

## Implementation rules

| Rule | Action |
|------|--------|
| Scope | All open tasks in brief (default) or one task with `--task` |
| Spec | Satisfy GIVEN/WHEN/THEN for referenced scenarios |
| Patterns | Follow ARCHITECTURE + RULES |
| Done | Mark each `- [x] X.Y` only after that task is verified |
| Ambiguity | Stop — ask human or `specx revise spec` |
| Scope creep | New **specx-propose** |

## Per-task report (when doing multiple)

After each task or at end of run:

```markdown
## Tasks complete
- [x] 1.1 ...
- [x] 1.2 ...
```

## When all tasks `[x]`

1. **specx-verify** — until READY
2. Human approval
3. **specx-archive**

## Forbidden

- Stopping after one task when user ran `specx build` without `--task`
- Editing living `specx/specs/` before archive
- Changing requirements without spec revision + **specx-approve spec**
