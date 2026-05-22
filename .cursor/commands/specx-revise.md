---
description: /specx:revise — follow specX skill specx-revise
---

# /specx:revise

**Apply the full specX skill:** `.cursor/skills/specx-revise/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX revise — Discovery revision

User wants changes before approving the current discovery phase.

## Steps

1. Run `specx revise` (registry → revision status)
2. **specx-specialist** revises `specx/discovery/NN-*.md` addressing critic recommendations
3. **specx-critic** re-runs on updated output
4. Human reviews again → **specx-approve** when ready

## Do not

- Advance to next phase until approve
- Approve while status is revision
