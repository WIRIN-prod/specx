# Tasks

Every task in this project, one row each. Task details live in the **Tasks** section of the spec linked in each row; keep both in step. For where the project stands, read [STATUS.md](STATUS.md).

Statuses: `draft` → `todo` → `in-progress` → `in-review` → `done`, plus `blocked` and `cancelled`. Types: `feature`, `bug`, `chore`, `spike`.

| Task | Title | Type | Milestone | Spec | Status | Parent | Depends on | PR |
|---|---|---|---|---|---|---|---|---|
| ROOT-T1 | Align SpecX workflows with agent-skills | feature | — | [ROOT](spec.md) | done | — | — | [#1](https://github.com/WIRIN-prod/specx/pull/1) |
| ROOT-T2 | Add the Explore pre-planning command | feature | — | [ROOT](spec.md) | done | — | ROOT-T1 | [#2](https://github.com/WIRIN-prod/specx/pull/2) |
| ROOT-T3 | Phased delivery and visible control | feature | — | [ROOT](spec.md) | done | — | ROOT-T2 | [#3](https://github.com/WIRIN-prod/specx/pull/3) |
| ROOT-T4 | Run the guard without `python3` | chore | — | [ROOT](spec.md) | done | — | ROOT-T3 | [#4](https://github.com/WIRIN-prod/specx/pull/4) |
| ROOT-T5 | End-to-end sample run | spike | — | [ROOT](spec.md) | in-progress | — | ROOT-T4 | — |
| ROOT-T6 | Launch README | chore | — | [ROOT](spec.md) | todo | — | ROOT-T5 | — |
| ROOT-T7 | Release v0.6.0 | chore | — | [ROOT](spec.md) | todo | — | ROOT-T5, ROOT-T6 | — |
| ROOT-T8 | Write SpecX documents in Simplified Technical English | chore | — | [ROOT](spec.md) | done | — | ROOT-T4 | [#5](https://github.com/WIRIN-prod/specx/pull/5) |
| ROOT-T9 | Add new TASKS.md columns on upgrade | bug | — | [ROOT](spec.md) | in-progress | — | ROOT-T8 | — |
| ROOT-T10 | Require exact error bodies in specs | feature | — | [ROOT](spec.md) | in-progress | — | ROOT-T9 | — |
| ROOT-T11 | Require a check that fails before the change | feature | — | [ROOT](spec.md) | todo | — | ROOT-T10 | — |
| ROOT-T12 | Forbid pattern kills and limit build assumptions | chore | — | [ROOT](spec.md) | todo | — | ROOT-T11 | — |
| ROOT-T13 | Ask for a branch only when several exist; commit the rule files | bug | — | [ROOT](spec.md) | todo | — | ROOT-T12 | — |
| ROOT-T14 | Block pattern kills in SpecX worktrees | feature | — | [ROOT](spec.md) | todo | — | ROOT-T12 | — |
| ROOT-T15 | Record delegated choices | feature | — | [ROOT](spec.md) | todo | — | ROOT-T14 | — |
| ROOT-T16 | Place milestones in the root spec | chore | — | [ROOT](spec.md) | todo | — | ROOT-T15 | — |
| ROOT-T17 | Make rule 10 hold for long requirements | chore | — | [ROOT](spec.md) | todo | — | ROOT-T16 | — |
| ROOT-T18 | Stop plan from filling in behavior | bug | — | [ROOT](spec.md) | todo | — | ROOT-T17 | — |
| ROOT-T19 | Group questions into rounds | chore | — | [ROOT](spec.md) | todo | — | ROOT-T18 | — |
| ROOT-T20 | Use the installed version when a lookup times out | chore | — | [ROOT](spec.md) | todo | — | ROOT-T19 | — |
