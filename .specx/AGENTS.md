# AGENTS.md — specX Spec-Driven Development

You are working in a **specX** project. Spec-Driven Development (SDD) means: **agree on behavior in specs before writing code**, keep specs in git as living truth, and evolve them through gated changes.

## Non-negotiables

1. **Read before acting**: `specx/SPECX.md` → `specx/foundation/STEERING.md` → `.specx/registry.yaml` → active change folder.
2. **Specs are the contract**: Implementation must match `specx/specs/` and change deltas. If code diverges, update specs first (or run `specx drift`).
3. **Human gates**: Discovery phases and archives require explicit user approval. Never run `specx approve` or `specx archive` without user consent.
4. **Dual-agent quality**: For discovery phases and build specs, run **Specialist** then **Critic** before presenting to the human.
5. **Fresh context per build task**: When executing `specx/changes/*/tasks.md`, clear unrelated chat context; implement one task at a time against the spec.
6. **Product language in specs**: Requirements describe observable user/system behavior. Put implementation detail in `design.md` / `tasks.md` unless it is part of the user-facing contract.

## SDD workflow map

| Intent | Command | Artifact |
|--------|---------|----------|
| Pre-product design | `/specx:discover`, `/specx:phase` | `specx/discovery/*.md` |
| Start feature | `/specx:propose` | `specx/changes/<name>/proposal.md` |
| Behavior contract | `/specx:spec` | `spec.md` + `specs/<domain>/spec.md` deltas |
| Technical approach | `/specx:design` | `design.md` |
| Implementation plan | `/specx:tasks` | `tasks.md` (checkboxes) |
| Execute | `/specx:build` | code + checked tasks |
| Validate | `/specx:verify` | checklist vs spec |
| Merge truth | `/specx:archive` | `specx/specs/` updated, change archived |
| Drift | `/specx:drift` | `specx/evolution/drift-report.md` |

## Delta spec rules (Build layer)

When modifying requirements, use **delta sections** in change specs:

- `## ADDED Requirements` — new behavior
- `## MODIFIED Requirements` — full updated requirement block (copy entire `### Requirement:` + scenarios from living spec, then edit)
- `## REMOVED Requirements` — include **Reason** and **Migration**

Format:

```markdown
### Requirement: Short name
The system SHALL ...

#### Scenario: Name
- **GIVEN** ...
- **WHEN** ...
- **THEN** ...
```

**CRITICAL**: Scenarios use `####` (four hashes). Requirements use `###`. Every requirement needs ≥1 scenario.

## Before any feature work

1. Run `specx status` (or read `.specx/registry.yaml`).
2. Search `specx/specs/` for related domains — reuse and extend, don't duplicate.
3. Read `specx/foundation/RULES.md` and `ARCHITECTURE.md` for constraints.
4. If no spec exists for the domain, the change **creates** one via proposal Capabilities.

## Context hygiene

- Large discovery or build sessions: summarize decisions in files, not only in chat.
- After archive, suggest `specx changelog` and commit spec + code together.
- Do not invent paths under `specx/` — use CLI scaffolds (`specx propose`, `specx phase`).

## Enterprise track

When `.specx/specx.yaml` has `track: enterprise`:

- Complete phases 10 (security) and 11 (compliance) before build-heavy work.
- Respect `gates.build.review_before_archive` — run `/specx:review` when required.
- Security and compliance findings belong in specs, not only in chat.

## Command prompts

Detailed prompts for each slash command live in `.specx/commands/`. When the user invokes `/specx:<name>`, read the matching file and follow it exactly.
