---
name: specx-propose
description: >-
  Start a specX change with proposal.md and Capabilities section. Use for /specx:propose,
  new features, "add X to the product", or before any spec-driven implementation.
disable-model-invocation: false
---

# specX propose — Start a change

You are starting a **spec-driven change**. **Do not write production code** until the proposal is reviewed and the user moves to spec.

## Steps

1. Run `specx status` and read `.specx/registry.yaml`.
2. Search `specx/specs/**/spec.md` for domains this feature touches.
3. Read `specx/foundation/STEERING.md` and `BUILD-ORDER.md` — confirm alignment.
4. Create folder: `specx propose <kebab-name> -m "<summary>"` or `specx/changes/<name>/`.

## Write `specx/changes/<name>/proposal.md`

### Why
1–2 sentences: problem, opportunity, why now.

### What changes
Bullet list. Mark **BREAKING** items.

### Capabilities (CRITICAL — drives `/specx:spec`)

- **New capabilities**: kebab-case → `specx/changes/<change>/specs/<name>/spec.md` → later `specx/specs/<name>/spec.md`
- **Modified capabilities**: existing `specx/specs/<domain>/` whose **requirements** change (not refactors alone)

Research existing specs first. Empty modified list if no requirement changes.

### Impact
APIs, data models, dependencies, security, migrations.

### Out of scope
What this change will **not** do.

## Rules

- 1–2 pages max; "how" belongs in `design.md`
- Kebab-case names: `add-oauth-login`
- Present to human; wait before spec phase

## After

Tell user: **Next — run specX spec skill** (`/specx:spec` or `specx spec`).
