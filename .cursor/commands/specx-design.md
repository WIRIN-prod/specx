---
description: /specx:design — follow specX skill specx-design
---

# /specx:design

**Apply the full specX skill:** `.cursor/skills/specx-design/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX design — Technical design

Explain **HOW** to satisfy the spec. Design implements requirements; it does not replace them.

## When required

Create `design.md` if any apply:

- Multiple modules/services or new pattern
- New dependency, schema migration, external API
- Security, performance, compliance (enterprise)
- Ambiguity needing decisions before tasks

Skip only trivial single-file changes.

## Steps

1. Read `proposal.md`, `spec.md`, all `specs/**/spec.md` deltas
2. Read `specx/foundation/ARCHITECTURE.md` — align or add ADRs
3. Search codebase for current implementation
4. Write `specx/changes/<change>/design.md`

## Required sections

### Context
Current state, constraints, discovery/PRD links.

### Goals / Non-Goals

### Decisions
Per decision: **Choice**, **Rationale**, **Alternatives considered**.

### Data & API
Only what spec requires.

### Risks / Trade-offs
`[Risk] → Mitigation`

### Migration plan
Deploy, rollback, feature flags.

### Open questions
Blockers before tasks.

## Rules

- Every decision traces to a **Requirement** in spec
- No contradiction with STEERING or approved discovery
- Prefer existing `ARCHITECTURE.md` patterns

## After

Human approves → **specx-tasks** skill.
