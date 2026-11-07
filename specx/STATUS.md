# Status

Where the project stands, for the user to read at a glance. The main session updates this file whenever a task, milestone, or decision changes. Task details live in the specs; if this file and a spec disagree, the spec is the record, and the difference is a problem to fix.

## Now

ROOT-T8 (rule 10: write in ASD-STE100) is in progress on `specx/delivery-ROOT-T8`.

ROOT-T4 merged in [#4](https://github.com/WIRIN-prod/specx/pull/4) (plugin 0.5.3; Windows unverified). ROOT-T5, the sample run in [specx-example](https://github.com/WIRIN-prod/specx-example), is paused before `/specx:plan`; it resumes after ROOT-T8.

## Waiting on you

Nothing right now.

## Roadmap

SpecX itself has no stages or phases yet; its work is tracked as single items.

| Stage | Phase | Milestone | Progress | Version |
|---|---|---|---|---|
| — | — | ROOT-T3 | done | 0.5.1 |
| Ongoing | — | ROOT-T4 to T7 | T4 done; T5 in progress; T6, T7 approved; T8 in progress | 0.6.0 planned |

## Assumptions to check

| Assumption | Why | Task |
|---|---|---|
| The fallback and warning live in two small scripts run with `bash`, not inline in `hooks.json` | easier to read and test | ROOT-T4 |

## Latest review

[2026-11-07-ROOT-T4.md](_reviews/2026-11-07-ROOT-T4.md), after [2026-11-05-ROOT-T3.md](_reviews/2026-11-05-ROOT-T3.md) and [2026-11-03-ROOT-T3.md](_reviews/2026-11-03-ROOT-T3.md)
