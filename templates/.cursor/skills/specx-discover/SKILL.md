---
name: specx-discover
description: >-
  specX Layer 1 Discovery — nine BMAD-style phases with named specialist lenses, dual-agent
  gates, PRD and technical spec before code. Use for /specx:discover, /specx:phase, greenfield,
  MVP, personas, problem statement, enterprise security compliance phases.
---

# specX discover — Layer 1 (pre-product design)

Discovery answers **what to build and why** — not how to code. This is specX's defining layer; no other framework runs this chain before specs.

**Read:** `phases.md` in this folder for **per-phase specialist lens, deliverables, critic focus, and gate criteria.**

**Graph:** Every phase output is Obsidian-native wikilinks + `specx/GRAPH.md`. Maintain `specx/Home.md` as the hub. Skill: **`specx-graph`**.

## BMAD influence: tracks + personas

| Track | Phases | When |
|-------|--------|------|
| **quick** | 07, 08, 09 | Feature on existing product |
| **standard** | 01–09 | New product |
| **enterprise** | 01–11 | Team, security, compliance |

Each phase uses a **named specialist lens** (Strategist, Researcher, PM, Architect, etc.) — not generic documentation.

## GSD: context per phase

- Run **one phase per agent session** when possible.
- Read only approved prior phases + STEERING draft.
- Summarize decisions in the markdown file, not only in chat.

## Dual-agent loop (mandatory)

For phase `N`:

1. `specx phase N` — scaffold `specx/discovery/NN-*.md` + `critiques/`
2. **specx-specialist** — apply lens from `phases.md`; fill Output section
3. **specx-critic** — challenge assumptions; write `critiques/NN-*-critique.md`; verdict APPROVE_WITH_NOTES | REVISE_REQUIRED
4. Present **both files** to human
5. Human: approve | revise
6. **specx-approve** only after human explicitly approves
7. Set `specx.status: approved` in phase frontmatter; update **[[Home]]** discovery table
8. **Git commit** — Ralph Loop: git is memory; registry + discovery + Home committed

If REVISE_REQUIRED → **specx-revise** → Specialist fixes → Critic re-runs.

## Verifier (consistency)

Before approve, check:

- [ ] References prior **approved** phases only (no forward references)
- [ ] MVP boundary (07) respected in 08–09 if those exist
- [ ] No placeholder comments left in Output
- [ ] Enterprise: 10–11 complete before large build if track is enterprise

## Phase index

| # | Lens | File |
|---|------|------|
| 01 | Product Strategist | `01-problem-statement.md` |
| 02 | Market Researcher | `02-market-research.md` |
| 03 | UX Researcher | `03-personas.md` |
| 04 | Service Designer | `04-user-journeys.md` |
| 05 | Information Architect | `05-information-architecture.md` |
| 06 | Interaction Designer | `06-user-flows.md` |
| 07 | PM (MVP) | `07-feature-inventory.md` |
| 08 | PM (PRD) | `08-prd.md` |
| 09 | Solution Architect | `09-technical-spec.md` |
| 10 | Security Architect | `10-security.md` |
| 11 | Compliance Officer | `11-compliance.md` |

## Three-layer handoff (specX only)

After discovery (per track), synthesize **Foundation**:

| Output | Source phases |
|--------|----------------|
| `STEERING.md` | 01, 03, 04, 08 (+ non-negotiables) |
| `BUILD-ORDER.md` | 07, 08 (ordered P0 features) |
| `ARCHITECTURE.md` | 09 (+ 10 ADRs if enterprise) |
| `RULES.md` | stack + conventions (human/agent) |

Then feature work: **specx-propose** — never jump to code from discovery alone.

## Living discovery (after initial setup)

Discovery is **golden truth** and must stay current when features change the product.

**Every new or materially changed feature:**

1. Run **`specx discover impact <feature-path>`** — which phases to update (07–08 always).
2. Edit affected `specx/discovery/NN-*.md` (add dated addendum sections).
3. Specialist → Critic → human **`specx approve <n>`** per changed phase.
4. Refresh **foundation** (`STEERING.md`, `BUILD-ORDER.md`, `ARCHITECTURE.md`).
5. Commit **discovery + foundation + feature leaf** together.

Read `specx/discovery/MAINTENANCE.md` for the full matrix.

| Trigger | Phases |
|---------|--------|
| Any feature | **07**, **08** (required); **09** (recommended) |
| New persona / journey | 03, 04, 06 |
| New screens / IA | 05, 06 |
| Auth / security | 10 |
| Compliance | 11 |

## Commands

- `specx discover` — status
- `specx discover impact [path]` — maintenance checklist for a feature
- `specx discover quick` — track 07–09
- `specx phase <n>` — scaffold
- `/specx:specialist` `/specx:critic` `/specx:approve` `/specx:revise`

## Anti-patterns

- Skipping phases without user consent on standard/enterprise
- Single-agent discovery (no critic file)
- Building STEERING from unapproved drafts
- Technical implementation detail in PRD (belongs in 09 / design)
