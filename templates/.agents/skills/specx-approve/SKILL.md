---
name: specx-approve
description: Apply an explicit user decision to an exact knowledge proposal revision and record the approval.
---

# Record a user approval

1. Confirm the user explicitly approved this proposal and identify its exact revision/content and scope. Silence, a request to continue, or approval of a different revision is not approval.
2. If a question is unanswered or the proposal changed materially, leave it pending and ask the user. Do not infer a decision.
3. Record the user's decision, date, proposal revision, and scope in the proposal and a decision record. Preserve declined alternatives and rationale when provided.
4. Apply only approved changes to canonical knowledge/specifications. Preserve stable component, feature, requirement, decision, and relation IDs. Mark target behavior user-confirmed only to the extent explicitly confirmed; source-derived current-state claims retain exact citations and source-verified status.
5. Update coverage and blueprint readiness. Approval applies only to the listed content; it does not mean the whole blueprint is ready unless the user explicitly approves that exact readiness assessment.
6. Do not treat blueprint approval as approval of a roadmap, implementation code, branch, merge, or deployment. Roadmaps require their own explicit exact-revision approval.
7. Update checkpoint with the approved blueprint revision and next unresolved authoring action or readiness state, then show the user the records changed.
