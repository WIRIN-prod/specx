---
description: /specx:tasks — follow specX skill specx-tasks
---

# /specx:tasks

**Apply the full specX skill:** `.cursor/skills/specx-tasks/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX tasks — Implementation checklist (GSD)

**Element 5:** One of the biggest agent failure modes is too much in one shot. Break work into discrete sub-tasks so agents verify as they go and parallelize when files don't overlap.

Break design into **verifiable** checkboxes. `specx build` implements **all open tasks** by default; use `specx build --task X.Y` only for single-task mode.

## Inputs

- All spec deltas + living specs affected
- `design.md`
- `RULES.md` (tests, lint, conventions)

## Traceability rule

Every `### Requirement:` and critical `#### Scenario:` maps to ≥1 task. Add mapping comment:

```markdown
- [ ] 2.1 Implement email send (spec: Requirement "Confirmation email", scenario "Successful signup")
```

## Format (strict)

```markdown
## 1. Setup

- [ ] 1.1 Add module structure per design §Decisions
- [ ] 1.2 Add env vars documented in design

## 2. Core behavior

- [ ] 2.1 ...
```

**Only** `- [ ] X.Y text` — other formats break tracking.

## Ordering

1. Setup / migrations
2. Domain logic per spec
3. API/UI wiring
4. Tests per scenario (explicit tasks)
5. Docs if spec mandates
6. Enterprise: security/compliance verification tasks

## Sizing (GSD)

- One session (~30 min) per checkbox
- Done = test green or explicit verification step passed
- No "implement entire feature" tasks

## Include

- [ ] Unit/integration tests naming scenario
- [ ] Update OpenAPI/README if spec requires
- [ ] Migration script task if design has migration

## Critic checks

- Orphan requirements without tasks
- Tasks that don't map to spec (scope creep)
- Missing test tasks for new SHALL

## After human approval

**specx-build** — never start build with unapproved task list on enterprise review gate.
