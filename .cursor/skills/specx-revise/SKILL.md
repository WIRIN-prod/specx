---
name: specx-revise
description: >-
  specX revise discovery phase after critic REVISE_REQUIRED. Specialist fixes then critic
  re-runs before human approve.
---

# specX revise — Discovery revision loop

Triggered when Critic verdict is **REVISE_REQUIRED** or human rejects draft.

## Loop

1. `specx revise` — registry status → revision
2. **specx-specialist** — address every numbered item in critique
3. **specx-critic** — re-run on updated output
4. Human reviews both again
5. **specx-approve** only when human satisfied

## Specialist must

- Quote critique items and show how each was resolved
- Mark unresolved items as UNCERTAIN with question for human
- Not delete critic file — add addendum `## Revision N` in critique if helpful

## Do not

- Advance `current_phase` in registry
- Start next phase until approve
- Jump to build to "fix" product disagreements — fix discovery artifact
