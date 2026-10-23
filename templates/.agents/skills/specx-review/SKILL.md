---
name: specx-review
description: Review an approved task's code diff, acceptance evidence, scope, and knowledge changes before human merge approval.
---

# Review before merge

1. Read the approved plan revision, accepted requirements/rules, task acceptance criteria, and checkpoint.
2. Inspect the complete diff, not just the completion summary. Check scope, correctness, security, compatibility, tests, and regressions relevant to the task.
3. Verify every acceptance condition with concrete evidence. Clearly identify checks not run.
4. Confirm no unapproved knowledge was added and no proposal was silently promoted. Any accepted-knowledge change must have an exact matching user approval record.
5. Report findings first, sorted by severity, with file/line references. Give PASS only when evidence supports every criterion; otherwise request revision or user decision.
6. Human approval is still required before merge. Do not merge, deploy, or claim user review occurred.
7. Update checkpoint with review outcome and next safe action.
