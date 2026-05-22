---
description: Mark discovery phase for revision after critic REVISE_REQUIRED. Use for /specx:revise when user wants changes before approval.
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
