# AGENTS.md — specX Spec-Driven Development

You are working in a **specX** project. Spec-Driven Development (SDD): **agree on behavior in specs before writing code**.

## Primary agent instructions (OpenCode-style skills)

Full workflows live in **Cursor skills** — read the entire `SKILL.md`:

```
.cursor/skills/
  specx-sdd/           # Master SDD discipline
  specx-discover/      # Discovery phases 01–11
  specx-specialist/    # Produce artifacts
  specx-critic/        # Challenge artifacts
  specx-approve/       # Gate: human approved
  specx-revise/        # Gate: revision
  specx-propose/       # Start change
  specx-spec/          # Delta requirements
  specx-design/        # Technical design
  specx-tasks/         # Checkbox tasks
  specx-build/         # Implement one task
  specx-verify/        # Verifier pass
  specx-archive/       # Merge to living specs
```

Mirrors also copied to `.specx/commands/` for non-Cursor tools.

## Non-negotiables

1. Read `specx/SPECX.md` → `STEERING.md` → `.specx/registry.yaml` → active change
2. Specs in `specx/specs/` are truth; changes use deltas in `specx/changes/<name>/specs/`
3. Human gates on approve and archive
4. Dual-agent: Specialist then Critic before human review
5. Fresh context per build task

## Delta spec rules

- `## ADDED|MODIFIED|REMOVED Requirements`
- `### Requirement:` + `#### Scenario:` with GIVEN/WHEN/THEN
- MODIFIED = copy full block from living spec, then edit

## Enterprise

`track: enterprise` in `.specx/specx.yaml` → phases 10–11, audit log, review before archive.
