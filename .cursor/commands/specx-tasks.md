---
description: specX tasks — Spec-Driven Development
---

When the user runs **/specx:tasks**, follow this playbook:

Read and execute: `.specx/commands/tasks.md`

Also apply skill `specx-sdd` and domain skill `specx-tasks` if it exists.

---

---
description: Break design into checkbox tasks for specx build
---

# /specx:tasks — Implementation checklist

Produce `tasks.md` that `/specx:build` can execute **one checkbox at a time** with fresh context.

## Steps

1. Read `spec.md`, `design.md`, and delta specs.
2. Map each requirement/scenario to at least one task (traceability).
3. Order by dependency: setup → core → integration → polish.

## Format (strict)

```markdown
## 1. <group name>

- [ ] 1.1 <verifiable task>
- [ ] 1.2 <verifiable task>

## 2. <group name>

- [ ] 2.1 ...
```

**CRITICAL**: Every task MUST be `- [ ] X.Y description`. Other formats break build tracking.

## Task sizing

- Completable in one agent session (~30 min scope).
- Verifiable: you know when done (test passes, file exists, endpoint returns X).
- Reference spec scenario IDs in description when useful.

## Include when applicable

- [ ] Tests for new scenarios
- [ ] Update docs if spec mandates
- [ ] Migration script task if design.md has migration
- [ ] Security/compliance checklist items (enterprise)

## Do not

- Bundle unrelated requirements in one task
- Skip test tasks for new SHALL requirements
- Write vague tasks ("implement feature")

## After completion

Human reviews task list. Then: **`/specx:build`** (one task per session recommended).
