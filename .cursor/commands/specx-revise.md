---
description: /specx:revise — follow specX skill specx-revise
---

# /specx:revise

**Apply the full specX skill:** `.cursor/skills/specx-revise/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX revise — Revision loop (discovery + build)

Triggered when Critic verdict is **REVISE_REQUIRED** or human rejects a draft.

## Targets

| Command | Marks |
|---------|--------|
| `specx revise` | Active change artifact in revision, or current discovery phase |
| `specx revise discovery` | Current discovery phase |
| `specx revise 5` | Discovery phase 05 |
| `specx revise spec` | `spec.md` on active change |
| `specx revise design` | `design.md` |
| `specx revise tasks` | `tasks.md` |
| `specx revise change` | Whole active change |
| `specx revise spec -m "reason"` | Spec with reason in registry + `revision.md` |
| `specx revise --change foo spec` | Named change |

## Loop

1. `specx revise [target]` — registry → `revision`, writes/updates `specx/changes/<change>/revision.md` when build
2. **specx-specialist** or author — fix artifact
3. **specx-critic** — re-run on discovery; for build, human reviews diff
4. **specx-approve** the same artifact when human satisfied

## Do not

- Advance `current_phase` on discovery until re-approved
- Start `specx build` to bypass spec disagreements — revise the spec
