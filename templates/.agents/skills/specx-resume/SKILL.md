---
name: specx-resume
description: Resume long-running SpecX work safely from the Markdown checkpoint across sessions and agent hosts.
---

# Resume SpecX work

1. Read `AGENTS.md`, `.specx/AGENTS.md`, `specx/Home.md`, `specx/work/CHECKPOINT.md`, the active plan, its approval record, and relevant accepted knowledge.
2. Verify branch and working-tree state before acting. Reconcile checkpoint claims against files and Git; preserve unrelated changes.
3. Confirm the active task and plan revision remain approved and in scope. If checkpoint and repository disagree, report the mismatch and ask rather than guessing.
4. Continue only the next safe action already covered by approved scope. Ask for user input on unresolved decisions or changes to accepted knowledge.
5. Update the checkpoint with completed evidence, current task, blockers, and one precise next action before ending the session.
