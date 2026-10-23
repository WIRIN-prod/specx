---
name: specx-specify
description: Research and collaboratively author a complete, hierarchical target project blueprint with the user before implementation planning. Use after discovery or when defining a new project/component/feature.
---

# Specify the project with the user

This is a frontier-model design and writing stage. Its deliverable is a reviewed text blueprint, not application code. Research informs options; the user decides product behavior, architecture trade-offs, and the technical stack.

## Required inputs

1. Read `AGENTS.md`, `.specx/AGENTS.md`, `specx/Home.md`, the current checkpoint, the knowledge coverage index, relevant discovery proposals, approved decisions, existing specifications, and applicable project instructions.
2. Verify which discovery claims are source-verified and what repositories, services, environments, or areas were not inspected. Do not use proposed discovery claims as facts.
3. Confirm the requested product outcome and intended scope with the user. For an existing application, explicitly ask how observed behavior relates to desired target behavior; never assume the current implementation is the desired design.

## Research and collaboration

4. Research only questions that materially affect requirements, architecture, stack, security, operations, or delivery. Prefer primary documentation, standards, and source repositories. Cite source links, publication/version/date when available, what the source establishes, and its limitations. Label comparisons and recommendations as proposed; do not copy another project's design without user fit review.
5. Work through the specification tree with the user: product outcomes and actors; component/subcomponent/feature boundaries; functional and failure behavior; contracts and data; authorization/security/privacy; quality targets; runtime/operations; constraints/non-goals; and dependencies. Use stable IDs such as `IAM`, `AUTH`, `LOGIN`, but let the user validate taxonomy and naming.
6. Ask focused questions where answers change behavior or architecture. Present viable options and consequences. Keep unanswered items explicitly unresolved and state which component, requirement, or milestone they block. Never fill gaps with conventional defaults.
7. Capture the complete target stack with versions/ranges, compatibility constraints, operational/security/support considerations, alternatives, and decision records. Where the user has not selected a technology, leave it unresolved and do not call the blueprint ready.
8. For each component/feature, produce bounded Markdown with purpose, scope, actors/permissions, preconditions, main/alternate/error flows, states/invariants, interfaces, data ownership/lifecycle, quality/security/operational constraints, dependencies, and testable acceptance criteria as applicable. Link by stable IDs and avoid duplicated contracts.
9. For a partially built project, record (a) current behavior with direct source evidence, (b) desired target behavior confirmed by the user, and (c) the gap/migration. Do not conflate these three.

## Proposal and approval boundary

10. Create or revise a proposal in `specx/proposals/` containing the exact specification files/claims, sources, decisions, alternatives, conflicts, unresolved questions, impacts, and blueprint coverage/readiness result. Draft candidate records under `specx/specifications/` or `specx/knowledge/` only as clearly labeled proposed content, or attach proposed files to the proposal; never represent them as accepted.
11. Do not write application code, implementation tasks, or an executable roadmap during this stage. Do not modify accepted knowledge or decision records. Do not declare readiness on the user's behalf.
12. Update `specx/work/CHECKPOINT.md` with blueprint revision, component/feature being authored, sources reviewed, decisions resolved/unresolved, coverage status, proposal revision, and next question/action.
13. Present the exact proposal and readiness blockers to the user. Wait for explicit approval of that exact revision. After approval, `/specx:approve` applies only the approved scope. A changed revision requires renewed approval.

## Readiness discipline

Use `specx/specifications/README.md#blueprint-readiness`. Assess product scope, hierarchy, behavior/acceptance, architecture/contracts, data, identity/security, stack, operations/quality, decisions/constraints, traceability, and current-to-target transition where relevant. File existence and generated architecture maps are not evidence of readiness. A user-approved exception is recorded as an accepted risk, not a solved decision.
