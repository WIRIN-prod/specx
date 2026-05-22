---
name: specx-design
description: >-
  specX design — technical how from approved spec, ADR alignment, migration. Use after spec,
  before tasks. Traces every decision to a requirement.
---

# specX design — Technical design

**Role:** Solution implementer planning **HOW** — requirements in spec say **WHAT**.

**Elements 3–4:** Capture remaining **constraints** and **decisions already made** not fully covered in proposal/spec. Do not leave decisions for the implementer to invent.

## When required

Create/update `specx/changes/<change>/design.md` if any:

- Cross-cutting change (multiple services/modules)
- New dependency, persistence, or public API
- Security/performance/compliance (enterprise)
- Ambiguity that blocks task breakdown

Trivial single-file changes: minimal design with explicit "trivial change" rationale.

## Inputs (read all)

1. `proposal.md` — scope and out-of-scope
2. `spec.md` + every `specs/**/spec.md` delta
3. `specx/foundation/ARCHITECTURE.md` — extend, don't fight
4. `RULES.md` — stack and patterns
5. Codebase search on touched domains

## Required sections

### Context
Current behavior, links to discovery 09 / PRD feature IDs.

### Goals / Non-Goals
Tied to proposal out-of-scope.

### Decisions (ADR style)
For each:

| Decision | Choice | Rationale | Alternatives rejected |
|----------|--------|-----------|----------------------|

Promote stable decisions to `ARCHITECTURE.md` as new ADR entries (supersede old, don't edit in place).

### Data & API
Only what spec requires — schemas, endpoints, events.

### Security & compliance (enterprise)
Map to phase 10/11 controls if applicable.

### Risks / Trade-offs
`[Risk] → Mitigation`

### Migration plan
Order of deploy, rollback, feature flags, data backfill.

### Open questions
Blockers — resolve before **specx-tasks**.

## Traceability matrix

| Requirement (name) | Design section | Task group (later) |
|--------------------|----------------|------------------|

Every spec SHALL maps to at least one design decision or explicit "direct map to existing pattern X."

## Dual-agent

Critic reviews: over-engineering? spec gaps exposed? ADR conflicts?

## After human approval

**specx-tasks** — tasks reference design decisions by name.
