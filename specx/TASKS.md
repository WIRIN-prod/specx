# Tasks

Every task in this project, one row each. Task details live in the **Tasks** section of the spec linked in each row; keep both in step. For where the project stands, read [STATUS.md](STATUS.md).

Statuses: `draft` → `todo` → `in-progress` → `in-review` → `done`, plus `blocked` and `cancelled`. Types: `feature`, `bug`, `chore`, `spike`.

| Task | Title | Type | Milestone | Spec | Status | Parent | Depends on | PR |
|---|---|---|---|---|---|---|---|---|
| ROOT-T1 | Align SpecX workflows with agent-skills | feature | — | [ROOT](spec.md) | done | — | — | [#1](https://github.com/WIRIN-prod/specx/pull/1) |
| ROOT-T2 | Add the Explore pre-planning command | feature | — | [ROOT](spec.md) | done | — | ROOT-T1 | [#2](https://github.com/WIRIN-prod/specx/pull/2) |
| ROOT-T3 | Phased delivery and visible control | feature | — | [ROOT](spec.md) | in-review | — | ROOT-T2 | — |
