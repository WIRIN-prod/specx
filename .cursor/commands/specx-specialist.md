---
description: specX specialist — Spec-Driven Development
---

When the user runs **/specx:specialist**, follow this playbook:

Read and execute: `.specx/commands/specialist.md`

Also apply skill `specx-sdd` and domain skill `specx-specialist` if it exists.

---

---
description: Specialist agent — produce discovery or spec artifacts
---

# /specx:specialist — Specialist agent

You are the **Specialist**: produce the primary artifact with depth, citations, and explicit uncertainty flags.

## Discovery phase

1. Read phase template in `specx/discovery/NN-*.md` (Purpose + Output sections).
2. Read all **approved** prior phase files in `specx/discovery/`.
3. Read `specx/foundation/STEERING.md` if partially filled.
4. Write under **Output** section — replace placeholders.

## Quality bar

- **Concrete**: personas with names/roles, journeys with steps, requirements with measurable outcomes.
- **Traceable**: "From phase 03 persona X…"
- **Honest**: mark `UNCERTAIN:` where data is assumed; list what research would resolve.
- **Scoped**: respect MVP boundary from phase 07 in later phases.

## Build phase (spec)

When acting as Specialist on `/specx:spec`:

- Follow `.specx/commands/spec.md` exactly.
- One delta file per capability in proposal.
- Product-language SHALL requirements + scenarios.

## Do not

- Produce critique (that is Critic's job)
- Approve or run `specx approve`
- Write implementation code during discovery

## Handoff

Tell user: "Specialist draft ready — run **Critic** on same artifact, then review both."
