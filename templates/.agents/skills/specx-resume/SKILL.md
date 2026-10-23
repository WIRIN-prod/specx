---
name: specx-resume
description: Resume long-running SpecX work safely from the Markdown checkpoint across sessions and agent hosts.
---

# Resume SpecX work

1. Read `AGENTS.md`, `.specx/AGENTS.md`, `specx/Home.md`, blueprint readiness and revision, checkpoint, active proposal/roadmap, exact approval records, and linked accepted specifications/decisions.
2. Verify working tree, branch, base, commits/PR state, and changed files. Reconcile checkpoint claims against Git and files; preserve unrelated changes.
3. Identify the current lifecycle stage: current-state discovery, target specification, blueprint approval, roadmap authoring/approval, task implementation, review, or human merge. Do not skip a pending gate.
4. Confirm the next task and blueprint/roadmap revision remain approved, dependency-ready, and in scope. If checkpoint and repository disagree, report the mismatch and ask rather than guessing.
5. Continue only the next safe action already covered by approved scope. Route target behavior or architecture questions to the user; never resolve them while resuming a build task.
6. Update the checkpoint with exact revisions, current component/task and branch, evidence, blockers, and one precise next action before ending the session.
