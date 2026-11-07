# Status

Where the project stands, for the user to read at a glance. The main session updates this file whenever a task, milestone, or decision changes. Task details live in the specs; if this file and a spec disagree, the spec is the record, and the difference is a problem to fix.

## Now

ROOT-T4 (guard without `python3`) is built on `specx/delivery-ROOT-T4` and in independent review.

## Waiting on you

Nothing right now.

## Roadmap

SpecX itself has no stages or phases yet; its work is tracked as single items.

| Stage | Phase | Milestone | Progress | Version |
|---|---|---|---|---|
| — | — | ROOT-T3 | done | 0.5.1 |
| Ongoing | — | ROOT-T4 to T7 | T4 in progress; T5 to T7 approved | 0.6.0 planned |

## Assumptions to check

| Assumption | Why | Task |
|---|---|---|
| The fallback and warning live in two small scripts run with `bash`, not inline in `hooks.json` | easier to read and test | ROOT-T4 |
| The no-Python warning checks only the folder the session starts in | a cheap check; a session started in a subfolder gets no warning | ROOT-T4 |

## Latest review

[2026-11-05-ROOT-T3.md](_reviews/2026-11-05-ROOT-T3.md), after [2026-11-03-ROOT-T3.md](_reviews/2026-11-03-ROOT-T3.md)
