---
name: execute
description: Execute one task from an explicitly user-approved SpecX plan within its declared scope.
---

# Execute one approved task

1. Read `AGENTS.md`, `.specx/AGENTS.md`, `specx/Home.md`, the current checkpoint, the approved plan and revision, and all linked accepted knowledge/rules.
2. Verify that this task is approved, unblocked, and its current scope matches the approved revision. If not, stop and ask.
3. Inspect working tree and branch. Preserve unrelated user changes. Do not overwrite or discard user work.
4. Work only within task scope and approved behavior. If implementation requires a new decision, dependency, migration, interface, or scope expansion, stop before that change and ask the user.
5. Run only the checks required by the approved task/project instructions. Report evidence, failures, and unrun checks honestly.
6. Do not silently edit accepted knowledge. If code reveals drift or missing knowledge, draft a separate proposal and await approval.
7. Update task and checkpoint Markdown with actual progress, changed files, evidence, blocker, and next safe action.
8. Present the code diff and results for human review. Never merge or represent code as approved for merge.
