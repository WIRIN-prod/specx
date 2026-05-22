---
description: specX propose — Spec-Driven Development
---

When the user runs **/specx:propose**, follow this playbook:

Read and execute: `.specx/commands/propose.md`

Also apply skill `specx-sdd` and domain skill `specx-propose` if it exists.

---

---
description: Start a spec-driven change — proposal with capabilities and scope
---

# /specx:propose — Start a change

You are starting a **spec-driven change**. Do not write production code until the proposal is reviewed.

## Steps

1. Run `specx status` and read `.specx/registry.yaml`.
2. Search `specx/specs/**/spec.md` for domains this feature touches.
3. Read `specx/foundation/STEERING.md` and `BUILD-ORDER.md` — confirm feature aligns with product direction.
4. If the change folder does not exist, run `specx propose <kebab-name> -m "<summary>"` or create under `specx/changes/<name>/`.

## Write `proposal.md`

Use this structure:

### Why
1–2 sentences: problem, opportunity, why now.

### What changes
Bullet list of concrete changes. Mark **BREAKING** items.

### Capabilities (CRITICAL)
This section drives the spec phase.

- **New capabilities**: kebab-case names → each becomes `specx/changes/<change>/specs/<name>/spec.md` and eventually `specx/specs/<name>/spec.md`.
- **Modified capabilities**: existing folders under `specx/specs/` whose **requirements** change (not refactors alone).

Research existing specs before listing. Empty modified list if only new code paths with no requirement change.

### Impact
APIs, data models, dependencies, security, migrations.

### Out of scope
Explicitly list what this change will **not** do.

## Rules

- Keep proposal 1–2 pages. "How" belongs in `design.md`.
- Kebab-case change names: `add-user-auth`, not `Add User Auth`.
- Present proposal to human before `/specx:spec`.

## After completion

Tell the user: **Next: `/specx:spec`** to generate behavior contracts from Capabilities.
