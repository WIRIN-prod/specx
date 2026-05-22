---
description: Mark discovery phase for revision after critic findings
---

# /specx:revise

User wants changes to the **current** discovery phase before approval.

1. Run `specx revise` to update registry.
2. Specialist revises `specx/discovery/NN-*.md` addressing critic items.
3. Critic re-runs on updated output.
4. Human reviews again → `/specx:approve` when ready.

Do not proceed to next phase until approve.
