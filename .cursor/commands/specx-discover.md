---
description: /specx:discover — follow specX skill specx-discover
---

# /specx:discover

**Apply the full specX skill:** `.cursor/skills/specx-discover/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX discover — Discovery layer

Discovery = **committed product truth** before build. Answers **what to build and why**, not how to code.

Run `specx discover` for status. Read `.specx/registry.yaml` for current phase.

## Tracks

| Track | Phases |
|-------|--------|
| quick | 07–09 (feature inventory, PRD, technical spec) |
| standard | 01–09 |
| enterprise | 01–11 (+ 10 security, 11 compliance) |

## Phase files

| # | File | Focus |
|---|------|-------|
| 01 | `01-problem-statement.md` | Problem, evidence, success criteria |
| 02 | `02-market-research.md` | Market, competitors |
| 03 | `03-personas.md` | Personas, JTBD |
| 04 | `04-user-journeys.md` | Journeys, edge cases |
| 05 | `05-information-architecture.md` | IA |
| 06 | `06-user-flows.md` | Flows, decision trees |
| 07 | `07-feature-inventory.md` | Features, MVP boundary |
| 08 | `08-prd.md` | PRD |
| 09 | `09-technical-spec.md` | Technical spec |
| 10 | `10-security.md` | Threat model, authn/z (enterprise) |
| 11 | `11-compliance.md` | Regulatory, audit (enterprise) |

## Phase loop (every phase)

1. `specx phase <n>` — scaffolds output + critique paths
2. **specx-specialist** — fill `specx/discovery/NN-*.md`
3. **specx-critic** — fill `specx/discovery/critiques/NN-*-critique.md`
4. Human reads **both** → approve | revise
5. **specx-approve** — only after human says approve
6. Git commit approved artifacts

## Rules

- No skipping phases on standard/enterprise without user OK
- Each phase references prior **approved** phases only
- Cite sources in research phases; mark `UNCERTAIN:` when assuming
- Phase 07 MVP boundary binds BUILD-ORDER until changed via propose

## Quick track

`specx discover quick` or phases 07–09 only for brownfield features.

## After discovery

Synthesize `specx/foundation/STEERING.md` and `BUILD-ORDER.md` from outputs → **specx-propose** for features.
