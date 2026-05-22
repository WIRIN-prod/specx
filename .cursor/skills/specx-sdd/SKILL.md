---
name: specx-sdd
description: >-
  Spec-Driven Development discipline for specX projects. Use when planning features,
  writing specs, implementing from specx/changes, or when user mentions specX, SDD,
  living specs, or delta requirements.
---

# specX SDD discipline

## When to apply

- User invokes `/specx:*` or mentions spec-driven, specX, living specs
- Work touches `specx/specs/`, `specx/changes/`, or `specx/discovery/`
- Planning before coding on a specX-initialized repo

## Read order

1. `specx/SPECX.md`
2. `specx/foundation/STEERING.md`
3. `.specx/registry.yaml`
4. `.specx/AGENTS.md`
5. Active `specx/changes/<name>/` if build in progress

## Core loop

```
propose → spec → design → tasks → build (per task) → verify → archive
```

Agree on **behavior in specs** before code. After archive, living specs in `specx/specs/` are truth.

## Delta requirements

Use ADDED / MODIFIED / REMOVED sections. MODIFIED = full requirement block copied then edited. Scenarios use `####` headers.

## Dual-agent

Specialist produces → Critic critiques → Human approves. See skills `specx-specialist` and `specx-critic`.

## Command details

Read `.specx/commands/<name>.md` for the exact workflow when user runs a slash command.

## Anti-patterns

- Coding before proposal/spec exists
- Editing `specx/specs/` directly during a change (use change deltas)
- Skipping verify before archive
- Vague requirements without scenarios
