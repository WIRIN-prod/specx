# Status

Where the project stands, for the user to read at a glance. The main session updates this file whenever a task, milestone, or decision changes. Task details live in the specs; if this file and a spec disagree, the spec is the record, and the difference is a problem to fix.

## Now

ROOT-T8 (rule 10: ASD-STE100) merged in [#5](https://github.com/WIRIN-prod/specx/pull/5). The plugin version is 0.5.4. ROOT-T5, the sample run in [specx-example](https://github.com/WIRIN-prod/specx-example), is done. Its NOTES phase merged as [pull request #1](https://github.com/WIRIN-prod/specx-example/pull/1). The findings report is [2026-11-19-ROOT-T11.md](_reviews/2026-11-19-ROOT-T11.md), after [2026-11-18-ROOT-T5.md](_reviews/2026-11-18-ROOT-T5.md). Your answers to the eight decisions ROOT-D35 to D42 are recorded. Seventeen findings map to twelve draft tasks (ROOT-T9 to T20). Finding F12 was already fixed in ROOT-T8. The spec is approved as version 14. The user approved every remaining task. ROOT-T11 merged in [#8](https://github.com/WIRIN-prod/specx/pull/8). ROOT-T12 merged in [#9](https://github.com/WIRIN-prod/specx/pull/9). ROOT-T13 merged in [#10](https://github.com/WIRIN-prod/specx/pull/10). ROOT-T14 merged in [#11](https://github.com/WIRIN-prod/specx/pull/11). ROOT-T15 merged in [#12](https://github.com/WIRIN-prod/specx/pull/12). ROOT-T16 merged in [#13](https://github.com/WIRIN-prod/specx/pull/13) with a Milestones table in the root spec. Two open points remain: which copy of a milestone is the record, and what "first-phase" means.

## Waiting on you

- Decide whether a 204 response with no body passes the literal-body check (ROOT-T10 item 1).
- Decide whether to change the spec template's error section (ROOT-T10 finding F6).
- Decide what execute does when no candidate main branch exists (ROOT-T13 open point).
- Decide whether to clarify `specx/RULES.md` line 11 about logged assumptions (ROOT-T12 review).

## Roadmap

SpecX itself has no stages or phases yet; its work is tracked as single items.

| Stage | Phase | Milestone | Progress | Version |
|---|---|---|---|---|
| — | — | ROOT-T3 | done | 0.5.1 |
| Ongoing | — | ROOT-T4 to T7 | T4 done; T5 done; T6, T7 todo; T8 done | 0.6.0 planned |
| Ongoing | — | ROOT-T9 to T20 | ROOT-T9 to T17 done; ROOT-T18 in progress; T19 and T20 todo | 0.6.x planned |

## Assumptions to check

| Assumption | Why | Task |
|---|---|---|
| The fallback and warning live in two small scripts run with `bash`, not inline in `hooks.json` | easier to read and test | ROOT-T4 |

## Latest review

[2026-11-18-ROOT-T5.md](_reviews/2026-11-18-ROOT-T5.md), after [2026-11-08-ROOT-T8.md](_reviews/2026-11-08-ROOT-T8.md), after [2026-11-07-ROOT-T4.md](_reviews/2026-11-07-ROOT-T4.md), after [2026-11-05-ROOT-T3.md](_reviews/2026-11-05-ROOT-T3.md) and [2026-11-03-ROOT-T3.md](_reviews/2026-11-03-ROOT-T3.md)
