---
description: /specx:discover — follow specX skill specx-discover
---

# /specx:discover

**Apply the full specX skill:** `.cursor/skills/specx-discover/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX discover — Layer 1 (pre-product design)

Discovery answers **what to build and why** — not how to code. This is specX's defining layer; no other framework runs this chain before specs.

**Read:** `phases.md` in this folder for **per-phase specialist lens, deliverables, critic focus, and gate criteria.**

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
7. **Git commit** — Ralph Loop: git is memory; registry + discovery files committed

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

## Commands

- `specx discover` — status
- `specx discover quick` — track 07–09
- `specx phase <n>` — scaffold
- `/specx:specialist` `/specx:critic` `/specx:approve` `/specx:revise`

## Anti-patterns

- Skipping phases without user consent on standard/enterprise
- Single-agent discovery (no critic file)
- Building STEERING from unapproved drafts
- Technical implementation detail in PRD (belongs in 09 / design)
