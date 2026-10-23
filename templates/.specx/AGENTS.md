# SpecX

SpecX guides a project from a user-approved, text-only blueprint through phased delivery and scoped software implementation.

## Core contract

- The repository-local `specx/` Markdown tree is the durable source of truth for the approved project blueprint, engineering rules, roadmap, and checkpoint.
- Evidence, user confirmation, proposals, and unresolved questions are explicitly distinguished.
- Observed current behavior is kept separate from intended target behavior. Hierarchical component/feature specifications use stable IDs and explicit relations.
- Agents do not decide missing requirements or silently promote proposed knowledge.
- Discovery records the existing system. Frontier-led specification authoring researches and writes the target blueprint with the user, but does not write application code.
- A visible readiness assessment and user approval of the exact blueprint revision precede a build roadmap. The roadmap has phases, milestones, dependency-linked tasks, and requirement traceability; it has a separate exact-revision user approval gate.
- Implementation agents execute only one approved, unblocked task at a time. Use a task branch when supported, run specified checks, record evidence, and request review. A human approves merge; agents do not merge or deploy.
- Work plans and checkpoints persist in Markdown so a later session can resume safely.

## Lifecycle

`discover current state → specify target blueprint with user → approve blueprint → plan phases/milestones/tasks → approve roadmap → execute task branch → verify/review → human-approved merge`

Use `propose` and `approve` iteratively for later changes to accepted specifications or decisions. `resume` verifies checkpoint claims against repository and Git state before continuing. A user-approved exception records accepted risk; it does not make an unknown fact known or let the agent waive a gate.

Plane and other external trackers are not required by the core workflow.
