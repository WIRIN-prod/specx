---
name: specx-plan
description: >-
  Decompose a goal into epics, stories, and tiered tasks, then push them to Plane.
  Run this on a frontier model — decomposition quality decides whether every
  downstream cheap model succeeds or flails.
---

# specx-plan

You are the planning agent. Your output is a work breakdown that cheaper models
will execute without you present to answer questions.

## Run

```bash
specx plan "<goal>"
```

That prints the contract and the target path (default `.specx/plan.json`). Write
the plan there, then:

```bash
specx plan apply --dry-run   # validate and see tier escalations
specx plan apply             # push to Plane
```

## Before you write anything

1. Read the codebase enough to name real files. A task whose `scope` lists paths
   that do not exist cannot be executed by a small model.
2. Run `specx agents` to see actual capacity per tier. Do not plan 40 frontier
   tasks against one frontier slot.
3. If a Plane board already exists, run `specx board` — do not re-plan work that
   is already tracked.

## The shape

```
Epic    a shippable capability            -> Plane module
Story   user-visible behaviour            -> Plane issue
Task    one agent session of work         -> Plane sub-issue
```

## Tier assignment

Assign the **cheapest tier that can do the job**, then check it against the rule:

- `small` — mechanical work. MUST declare `scope` as ≤5 explicit real file paths,
  no globs, and ≤2 `dependsOn` entries. The router enforces this; anything failing
  gets escalated to `mid` and costs more than planning it correctly would have.
- `mid` — the default. Multi-file changes, judgement inside a bounded area.
- `frontier` — schema/architecture decisions, cross-module work, anything where a
  wrong call is expensive to unwind. Scarce. Do not spend it on typing.

## What makes a task executable

Every task needs all five:

| Field | Test |
|-------|------|
| `intent` | Could a competent stranger start from this sentence alone? |
| `doneWhen` | Can each condition be checked without asking a human? |
| `scope` | Do these paths exist, and do they bound the whole change? |
| `decisions` | Is every choice you made written down, so nobody reopens it? |
| `outOfScope` | Have you named the adjacent thing an agent would drift into? |

If you cannot fill `decisions`, you have not actually made the decisions yet —
make them now. Deferring a decision into execution is how a cheap model ends up
inventing architecture.

## Dependencies

`dependsOn` refers to other task `key`s. Keep the graph shallow: deep chains
serialize your pool and leave agents idle. Prefer several independent tasks over
one long chain. Cycles are rejected outright.

## Self-check before applying

- [ ] Every story has ≥1 GIVEN/WHEN/THEN acceptance criterion
- [ ] Every task has ≥1 checkable `doneWhen`
- [ ] Every `small` task lists ≤5 real, glob-free paths
- [ ] No task depends on a key that does not exist
- [ ] No dependency cycles
- [ ] Keys are unique across the whole plan
- [ ] `specx plan apply --dry-run` reports zero escalations you did not intend
