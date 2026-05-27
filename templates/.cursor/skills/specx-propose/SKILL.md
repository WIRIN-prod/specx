---
name: specx-propose
description: >-
  specX propose — create a feature leaf under specx/<domain>/.../<leaf>/ (no features/ folder).
  Read specx/STRUCTURE.md. Example: specx propose auth/email/registration.
---

# specX propose — Segmented feature leaf

## Mental model

- **No `specx/features/` directory.** The product tree lives directly under `specx/`.
- **`auth`**, **`email`** = **segments** (organizational; optional `SEGMENT.md`).
- **`registration`** = **feature leaf** — the folder that contains all spec artifacts.

```text
specx/
  auth/                 ← segment (not a feature)
    email/              ← segment
      registration/     ← FEATURE (leaf)
        FEATURE.md
        spec.md
        design.md
        tasks.md
        specs/...
```

Same idea as Next.js `app/auth/email/...` — folders are segments until the leaf holds the “page” (here: `FEATURE.md`).

**Read:** `specx/STRUCTURE.md`, `specx/GRAPH.md`, `specx-graph` skill.

## CLI

```bash
specx propose auth/email/registration -m "Email signup"
specx propose auth/email/forgot-password
specx dep add auth/email/forgot-password auth/core-session
```

Re-run `specx propose` on the **same path** to continue work — do not invent a new folder per iteration.

## Before writing

1. `specx status` + `specx feature list`
2. `specx/STRUCTURE.md`
3. `STEERING.md`, `BUILD-ORDER.md`, `RULES.md`
4. Upstream deps: read `specx/<dep-path>/spec.md` first

## Write `specx/<segment>/.../<leaf>/FEATURE.md`

Frontmatter: `specx.layer: feature`, `specx.feature: <full-path>`, `specx.status: proposed`.

**Graph:**

- Link to PRD / inventory: `[[discovery/08-prd#FR-…]]`, `[[discovery/07-feature-inventory]]`
- Dependencies as wikilinks: `[[auth/core-session/FEATURE]]`
- Trailing `## Graph` table; add leaf to **[[Home]]** Features list
- Add row to **[[foundation/BUILD-ORDER]]** as wikilink when sequenced

### Capabilities (OpenSpec)

Drives `specx/<path>/specs/<capability>/spec.md` under the **same leaf**.

### Dependencies

List in FEATURE.md and in `specx/features.yaml` via `specx dep add`.

## Discovery maintenance (same PR)

After FEATURE.md / spec are drafted, run **`specx discover impact <path>`**.

- Update phases **07–08** at minimum (feature inventory + PRD).
- Update other phases the impact report lists.
- Re-approve changed phases; refresh foundation files.

**Never** ship a feature whose discovery/PRD still describes the old product.

## Never

- Create `specx/features/...` (legacy only)
- Put `FEATURE.md` at `specx/auth/` — only at the **leaf**
- Flat ids like `slice-1` unless truly a single-segment feature
- Feature-only commits that skip discovery when product truth changed
