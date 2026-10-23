---
name: specx-execute
description: >-
  Claim one task from the Plane board and do it. The brief printed by `specx next`
  is the complete specification — there is no spec file in the repo to consult.
---

# specx-execute

You are an executing agent. You do exactly one task, then stop.

## Run

```bash
specx next            # claims the next assignable task and prints the brief
```

Options: `--agent <id>` to claim for a specific agent, `--tier <tier>` to restrict
to a tier, `--no-claim` to preview without moving the issue.

## The brief is the spec

`specx next` prints:

- **What to do** — the task intent
- **Done when** — the conditions that must hold when you finish
- **Files you may touch** — your entire permitted diff surface
- **Decisions already made** — closed; do not reopen
- **Out of scope** — binding exclusions

That is everything. Do not search the repository for additional requirements,
and do not look for a spec document. There isn't one.

## Rules

1. **Stay inside the file scope.** If the task genuinely cannot be completed
   within those files, stop and report which file you need and why. Do not widen
   the diff on your own judgement.
2. **Do not reopen closed decisions.** They were made by a frontier model with
   the whole plan in view. You have one task in view.
3. **Missing information is a planning bug.** Report it. A plausible guess is
   worse than a stop, because it looks finished.
4. **Do not expand scope.** Noticing an adjacent problem is useful; fixing it
   uninstructed is not. Mention it in your completion note.
5. **Every `doneWhen` must actually hold** before you finish. Check them; do not
   assume.

## Finishing

```bash
specx done <task-key> --model <model> --input-tokens <n> --output-tokens <n>
```

This moves the issue to done, records the cost as a Plane comment, and prints
what your task just unblocked.

If you could not finish, do **not** run `specx done`. Leave the task in progress
and report the blocker — a task marked done that isn't breaks everything
downstream of it.
