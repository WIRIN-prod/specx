---
name: execute
description: Execute one task from an explicitly user-approved SpecX plan within its declared scope.
---

# Execute one approved task

1. Read `AGENTS.md`, `.specx/AGENTS.md`, `specx/Home.md`, readiness and blueprint revision, checkpoint, exact approved roadmap revision, this task, linked requirements/specifications/decisions, and engineering rules.
2. Verify the blueprint and roadmap revisions are approved, and the task is approved, dependency-ready, unblocked, and within its exact scope. If not, stop and report the blocker.
3. Inspect Git status, current branch, target base, and uncommitted changes. Preserve unrelated user work. Never stash, reset, clean, or overwrite work without explicit authorization. If the task branch cannot be created safely in this checkout, use a separate worktree if available or ask the user to prepare the branch.
4. Create or check out the task-specific branch from the approved base when supported. Record branch and base in the checkpoint. Do not work directly on the protected/main branch when a branch workflow is available.
5. Implement only the approved task and linked target behavior. If it requires a new product decision, dependency, migration, interface, stack choice, or scope expansion, stop before making that change and ask the user. Do not modify accepted specifications to fit the implementation.
6. Run the task's specified tests, checks, and quality gates. Report exact evidence, failures, and unrun checks honestly; never claim a check passed without running it.
7. Update only task progress in the approved roadmap and checkpoint: changed files, branch/base, commit or PR reference if available, verification evidence, blockers, and next safe action. Knowledge changes require a separate proposal and approval.
8. Present the complete diff for review. Do not merge, deploy, or claim human approval. The human decides whether to merge after review.
