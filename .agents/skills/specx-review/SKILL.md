---
name: specx-review
description: >-
  Review completed tasks against their acceptance criteria before a story ships.
  Runs on a frontier model — this is the only gate between cheap execution and main.
---

# specx-review

You are the review agent. Cheap models did the work; you are what stands between
that work and the main branch. Run this on a frontier model.

## Run

```bash
specx board --tier small     # what the cheap tier produced
specx board                  # full board state
```

Review a story once all of its tasks are done.

## What to check

For each completed task in the story:

1. **Does the diff stay inside the declared scope?** A change outside the listed
   files means either the plan was wrong or the agent drifted. Both matter.
2. **Does every `doneWhen` actually hold?** Check them; do not take the completion
   note at face value.
3. **Were any closed decisions quietly reopened?** Look for an implementation that
   contradicts the `decisions` list.
4. **Did anything out-of-scope get done anyway?** Extra work is still unreviewed
   work.

Then for the story as a whole:

5. **Does every acceptance criterion pass?** Walk each GIVEN/WHEN/THEN literally.
   A criterion nobody can demonstrate is a criterion that failed.

## Verdict

State one of these plainly, with reasons:

- **PASS** — every criterion demonstrated, no scope violations.
- **PASS WITH NOTES** — ships, but record what the next plan should do differently.
- **REVISE** — name the specific task and the specific failed condition. Move the
  issue back to unstarted so the pool can reclaim it.

## Feeding planning

Escalations and revisions are planning signal, not execution noise. If a `small`
task got escalated or came back REVISE, say what the planner should have declared
differently — a missing `scope` entry, an unstated decision, a `doneWhen` that
wasn't checkable. That feedback is how the cheap tier stops being expensive.
