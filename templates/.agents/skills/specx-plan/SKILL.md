---
name: specx-plan
description: Use a frontier model to create a phased, milestone-based delivery roadmap with small traceable tasks from an approved, ready blueprint; smaller agents execute tasks only after separate user approval.
---

# Plan a ready blueprint

1. Read the approved blueprint revision and readiness assessment, product requirements, hierarchical component/feature specs, technical stack, architecture, interfaces/data/security, decisions, engineering rules, checkpoint, and any approved current-state survey. Never use proposed knowledge as implementation authority.
2. Confirm the user wants a build roadmap from this exact blueprint revision. If readiness has unresolved required gaps or conflicting decisions, stop before executable tasks; identify affected scope and route questions to `/specx:specify` or `/specx:propose`. Do not fill gaps with defaults. A roadmap with blocked placeholders is allowed only if clearly non-executable and the user asks to see sequencing options.
3. Decompose the target into ordered phases and outcome-based milestones. Each milestone has an observable exit condition and traces to approved product outcomes and spec IDs. Show cross-component dependencies and critical path.
4. Break milestones into small, independently reviewable tasks suitable for a lower-capability implementation model. Each task has stable ID, exact scope, prerequisites, linked requirement/spec/decision IDs, acceptance criteria, verification commands or method, risk/rollback, explicit non-goals, and stop conditions.
5. Check relevant source layout to suggest file scopes without changing code. Distinguish migration/build order from architecture dependency. Record any mismatch between the approved target and existing source as an explicit task or decision, not an assumed design change.
6. Recommend `small`, `mid`, `frontier`, or human capability per task with a reason based on boundedness, ambiguity, risk, and architectural judgment. Recommendations are advisory; no agent is dispatched automatically.
7. Save the exact roadmap under `specx/plans/` using the plan template. Validate stable IDs, requirement traceability, dependency references, DAG cycles, milestone exit conditions, task scope, and that every task is downstream of its blocking decisions.
8. Present the exact roadmap revision, blueprint revision, readiness evidence, milestones, critical dependencies, and agent-fit recommendations. Wait for explicit user approval of the roadmap before any task is executable. Record approval on that exact revision; material changes require renewed approval.

## Keep the stages distinct

- Specification: what the product must do and the approved technical design.
- Roadmap: in what milestones and dependency order to build the approved design.
- Task: one small bounded implementation/review unit.

Do not conduct product discovery by inventing behavior during planning. Route missing target decisions back to specification authoring with the user.

