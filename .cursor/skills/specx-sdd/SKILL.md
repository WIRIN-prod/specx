---
name: specx-sdd
description: >-
  Spec-Driven Development for specX projects. Use when planning features, writing specs,
  implementing from specx/changes, discovery phases, delta requirements, /specx commands,
  or when the user mentions specX, SDD, living specs, or agree-before-build.
---

# specX — Spec-Driven Development

You work in a **specX** project. **Agree on behavior in specs before writing code.** Specs live in git; chat is not the source of truth.

## Read first (every session)

1. `specx/SPECX.md` — lifecycle and principles
2. `specx/foundation/STEERING.md` — product constitution (if present)
3. `.specx/registry.yaml` — active discovery phase / change
4. `specx/foundation/RULES.md` and `ARCHITECTURE.md` — constraints

## Non-negotiables

1. **Specs are the contract** — code implements `specx/specs/` and change deltas
2. **Human gates** — never `specx approve` or `specx archive` without explicit user consent
3. **Dual-agent** — Specialist produces → Critic challenges → human approves
4. **Fresh context** — one `tasks.md` checkbox per build session when possible
5. **Product language in specs** — observable behavior; implementation detail in `design.md` / `tasks.md`

## Full lifecycle

```
Discovery (01–11) → Foundation → propose → spec → design → tasks → build → verify → archive → Evolution
```

| Phase | Skill / command | Output |
|-------|-----------------|--------|
| Discovery | `specx-discover`, `specx-specialist`, `specx-critic` | `specx/discovery/` |
| Build | `specx-propose` → `specx-spec` → `specx-design` → `specx-tasks` → `specx-build` | `specx/changes/<name>/` |
| Verify | `specx-verify` | report |
| Merge | `specx-archive` | `specx/specs/` living truth |

## Delta spec format (required for build)

```markdown
## ADDED Requirements
### Requirement: Name
The system SHALL ...
#### Scenario: Name
- **GIVEN** ...
- **WHEN** ...
- **THEN** ...

## MODIFIED Requirements
### Requirement: Name
<full block copied from living spec, then edited>

## REMOVED Requirements
### Requirement: Name
**Reason**: ...
**Migration**: ...
```

**CRITICAL**: Scenarios use `####` (four hashes). MODIFIED = complete requirement blocks, not fragments.

## Before any feature

1. `specx status`
2. Search `specx/specs/**/spec.md` for related domains
3. Use the matching **skill** for the user's intent (propose, spec, build, …)

## Anti-patterns

- Coding before proposal + spec exist
- Editing `specx/specs/` directly during a change (use deltas in `changes/<name>/specs/`)
- Skipping verify before archive
- Vague requirements without scenarios

## Enterprise

If `.specx/specx.yaml` has `track: enterprise`: complete discovery 10–11 (security, compliance); respect `review_before_archive`.
