---
description: /specx:tasks — follow specX skill specx-tasks
---

# /specx:tasks

**Apply the full specX skill:** `.cursor/skills/specx-tasks/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX tasks — Implementation checklist

Produce `tasks.md` for **one-checkbox-at-a-time** execution in specx-build.

## Steps

1. Read `spec.md`, `design.md`, delta specs
2. Map each requirement/scenario → ≥1 task (traceability)
3. Order: setup → core → integration → polish

## Format (strict)

```markdown
## 1. Setup

- [ ] 1.1 Create module structure
- [ ] 1.2 Add dependencies

## 2. Core

- [ ] 2.1 Implement export per spec scenario "Successful export"
```

**CRITICAL**: Only `- [ ] X.Y description` — other formats break `specx build`.

## Task sizing

- One session (~30 min) per task
- Verifiable done state (test, file, API response)
- Reference scenario names in descriptions

## Include when needed

- Tests per new SHALL requirement
- Docs if spec mandates
- Migration from design.md
- Enterprise security/compliance checks

## Do not

- Vague tasks ("implement feature")
- Skip tests for new requirements
- Bundle unrelated requirements

## After

Human reviews → **specx-build** (one task per session).
