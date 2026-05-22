---
description: Technical design from approved spec — decisions before code
---

# /specx:design — Technical design

Explain **HOW** to satisfy the spec. Design does not replace requirements — it implements them.

## When design is required

Create or update `design.md` if any apply:

- Multiple modules/services or new architectural pattern
- New dependency, schema migration, or external API
- Security, performance, or compliance constraints (enterprise)
- Ambiguity that needs decisions before tasks

Skip only for trivial, single-file changes with obvious implementation.

## Steps

1. Read `proposal.md`, `spec.md`, and all `specs/**/spec.md` deltas.
2. Read `specx/foundation/ARCHITECTURE.md` — align or add ADR entries.
3. Search codebase for current implementation of touched domains.
4. Write `design.md` sections below.

## Required sections

### Context
Current state, constraints, links to discovery/PRD if relevant.

### Goals / Non-Goals
What this design achieves; explicit exclusions.

### Decisions
For each decision: **Choice**, **Rationale**, **Alternatives considered**.

### Data & API
Schemas, endpoints, events — only what spec requires.

### Risks / Trade-offs
`[Risk] → Mitigation` format.

### Migration plan
Deploy order, rollback, feature flags.

### Open questions
Blockers needing human input before `/specx:tasks`.

## Rules

- Every design decision must trace to a **Requirement** in spec.
- Do not contradict approved discovery or STEERING non-negotiables.
- Prefer extending existing patterns from `ARCHITECTURE.md` and codebase.

## After completion

Human approves design. Then: **`/specx:tasks`**.
