---
name: specx-sdd
description: >-
  specX Spec-Driven Development — full methodology. Use for any specX project work, SDD,
  living specs, delta requirements, discovery, propose, build, steering, or when the user
  wants product-before-code with human gates and dual-agent quality.
---

# specX — Spec-Driven Development (master skill)

You implement **specX**, not generic agile docs. Read this skill fully, then **`reference.md`** and **`six-elements.md`** in this folder (framework DNA + what every good spec must answer).

## Philosophy (operating system)

| Principle | You must |
|-----------|----------|
| Product before code | Discovery + foundation complete before greenfield build; **keep discovery updated** when features change product truth |
| Decisions before documents | Agree on requirements in specs before coding |
| Humans decide, agents execute | Draft, critique, implement — never self-approve or self-archive |
| Context is architecture | Specs and STEERING are the prompt; quality in → quality out |
| Specs are alive | Use deltas; run drift/evolution; never treat specs as write-once |
| Works everywhere | Markdown in repo only; no tool-specific lock-in |

## Session bootstrap (strict order)

1. `specx/SPECX.md` — project constitution
2. **`reference.md`** (this folder) — why processes exist
3. **`specx-graph`** + `specx/GRAPH.md` — link graph is how agents navigate
4. **`specx/Home.md`** — map of maps (discovery, foundation, features)
5. `specx/foundation/STEERING.md` — Kiro-style steering (if exists)
6. `.specx/specx.yaml` — track, gates, models
7. `.specx/registry.yaml` — active discovery phase or feature
8. `specx/foundation/RULES.md` + `ARCHITECTURE.md`
9. Active feature leaf `specx/<path>/FEATURE.md` or current `specx/discovery/NN-*.md` — **follow wikilinks from `## Graph`**

Run `specx status` when unsure. Prefer **backlinks from [[Home]]** over chat history.

## Four layers

```
RAW IDEA
  → Layer 1 Discovery   (specx/discovery/)     what & why [BMAD phases + dual-agent]
  → Layer 2 Foundation  (specx/foundation/)    steering, rules, build order [Kiro]
  → Layer 3 Build       (specx/specs + changes/) [OpenSpec delta loop]
  → Layer 4 Evolution   (specx/evolution/)      living specs [specX only]
  → SHIPPED PRODUCT
```

## Skill routing (use the dedicated skill — each has full process detail)

| User intent | Skill |
|-------------|-------|
| Wikilinks / graph / Home | `specx-graph` (+ `specx/GRAPH.md`) |
| Discovery / phase / PRD | `specx-discover` (+ `phases.md`, `MAINTENANCE.md`) |
| Discovery drift on new feature | `specx discover impact <path>` |
| Draft artifact | `specx-specialist` |
| Challenge artifact | `specx-critic` |
| Approve discovery / build artifact | `specx approve` / `specx approve spec` (human said yes first) |
| Revise discovery / build artifact | `specx revise` / `specx revise design` |
| New feature | `specx-propose` |
| Requirements / deltas | `specx-spec` |
| Technical how | `specx-design` |
| Task breakdown | `specx-tasks` |
| Implement feature | `specx build` (all tasks; path e.g. `auth/email/registration`) |
| Feature tree rules | `specx/STRUCTURE.md` — segments + leaf (no `features/` folder) |
| Verify vs spec | `specx-verify` (Ralph loop until READY) |
| Merge living specs | `specx-archive` |

## Dual-agent gate (every discovery phase + spec pass)

```
Specialist (named lens) → output in specx/discovery/ or changes/
Critic                  → critiques/NN-*-critique.md or critique-spec.md
Human                   → reads BOTH → approve | revise
Verifier (optional)     → consistency vs prior approved artifacts
Git commit              → human approves commit; git is memory [Ralph]
```

Never show only Specialist output to the human. Never approve without user explicit consent.

## Build loop (OpenSpec + GSD + Kiro)

```
propose → spec → design → tasks → approve each → build (all tasks) → verify → archive
```

- **No code** until proposal + spec reviewed (Kiro gate).
- **Fresh context** per `tasks.md` checkbox (GSD).
- **Verifier** before archive; if NOT READY, loop with gap list as context (Ralph).

## OpenSpec delta rules (summary)

Living truth: `specx/specs/<domain>/spec.md`. Work in: `specx/changes/<change>/specs/<domain>/spec.md`.

- `## ADDED Requirements` — new behavior
- `## MODIFIED Requirements` — **entire** `### Requirement:` block copied from living spec, then edited
- `## REMOVED Requirements` — **Reason** + **Migration**

```markdown
### Requirement: Short name
The system SHALL <observable outcome>.

#### Scenario: Name
- **GIVEN** ...
- **WHEN** ...
- **THEN** ...
```

Scenarios: exactly `####` (four hashes). SHALL/MUST in requirements. Product language, not class names.

## Three-layer handoff (after discovery)

Produce or update:

1. `STEERING.md` — from personas, JTBD, non-negotiables (phases 03, 04, 08)
2. `BUILD-ORDER.md` — from feature inventory + PRD (phases 07, 08)
3. `ARCHITECTURE.md` — from technical spec (phase 09) as ADR seeds

Then `specx-propose` for first feature.

## Six elements (every change)

Read `six-elements.md`. Summary: (1) outcome statements in requirements, (2) explicit out-of-scope, (3) constraints + STEERING, (4) decisions listed, (5) tasks.md checkboxes, (6) verification criteria for verifier.

## Anti-patterns (fail the user if you do these)

- Implementation before spec exists
- Editing `specx/specs/` directly during a change (use change deltas only)
- Partial MODIFIED blocks (loses detail at archive)
- Skipping Critic pass
- Trusting chat history over committed files
- Use `specx build --task X.Y` only when the user wants one task; default is all open tasks
- Archive without verify READY + human approval

## Enterprise (`track: enterprise`)

- Phases 10 security, 11 compliance mandatory before scale build
- `gates.build.review_before_archive` — `specx review` before archive
- Audit events in `.specx/audit.log` when enabled

## When stuck

Read `reference.md` → open the phase playbook in `specx-discover/phases.md` → follow the matching workflow skill end-to-end.
