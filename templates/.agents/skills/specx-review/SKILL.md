---
name: specx-review
description: Review an approved task's code diff, acceptance evidence, scope, and knowledge changes before human merge approval.
---

# Review before merge

1. Read the approved blueprint and roadmap revisions, linked requirements/specifications/decisions, engineering rules, task acceptance criteria, branch/base, and checkpoint.
2. Inspect the complete branch diff against its approved base. Check scope, conformance to target behavior, correctness, security/privacy, compatibility, required tests, and relevant regressions.
3. Verify each task acceptance check and linked spec acceptance criterion with concrete evidence. Clearly identify checks not run and any requirement that is not verifiable.
4. Confirm the diff did not silently change accepted knowledge, expand the approved task, add unapproved dependencies, or promote a proposal. Any specification change must have an exact matching user approval record.
5. Report findings first, sorted by severity, with file/line references. Give PASS only when evidence supports every criterion; otherwise request a scoped revision or user decision.
6. On PASS, mark the task as review-ready and provide merge guidance. A human explicitly approves merge. Do not merge, deploy, or claim that user review occurred.
7. Update checkpoint with review outcome, branch/PR state, evidence, and next dependency-ready task.
