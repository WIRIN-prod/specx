---
description: specX discover — Spec-Driven Development
---

When the user runs **/specx:discover**, follow this playbook:

Read and execute: `.specx/commands/discover.md`

Also apply skill `specx-sdd` and domain skill `specx-discover` if it exists.

---

---
description: Discovery layer — pre-product SDD from idea to PRD and technical spec
---

# /specx:discover — Discovery layer

Discovery produces **committed product truth** before build loops. Run `specx discover` for status.

## SDD role

Discovery answers: **what to build and why** — not how to code it. Outputs feed `specx/foundation/STEERING.md` and `BUILD-ORDER.md`.

## Tracks

| Track | Phases |
|-------|--------|
| quick | 07–09 |
| standard | 01–09 |
| enterprise | 01–11 (+ security, compliance) |

## Phase loop (every phase)

1. `specx phase <n>` — scaffold output + critique files
2. **Specialist** fills `specx/discovery/NN-*.md` (see `/specx:specialist`)
3. **Critic** fills `specx/discovery/critiques/NN-*-critique.md` (see `/specx:critic`)
4. Human reads **both** → approve | revise
5. `specx approve` — only after human consent
6. Git commit approved artifacts

## Rules

- Never skip phases on standard/enterprise without user approval.
- Each phase must reference prior **approved** phases — no contradictions.
- Cite research sources in market/competitor phases.
- MVP boundary (phase 07) is binding for BUILD-ORDER unless later revised via change.

## Commands

- `/specx:discover quick` — phases 07–09 only
- `/specx:phase <n>` — scaffold specific phase
- `/specx:approve` / `/specx:revise` — gate control

## After discovery complete

Regenerate or update `STEERING.md` from discovery outputs. Then begin **Build** with `/specx:propose`.
