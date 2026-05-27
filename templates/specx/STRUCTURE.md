# specX feature tree (Next.js App Router style)

There is **no** `specx/features/` folder. The tree starts at **`specx/<domain>/.../<leaf>/`**, like `app/` in Next.js.

## What is what

| Folder | Role |
|--------|------|
| `specx/auth/` | **Segment** — groups related capabilities (only `SEGMENT.md` until a leaf exists) |
| `specx/auth/email/` | **Segment** — sub-area |
| `specx/auth/email/registration/` | **Feature (leaf)** — contains `FEATURE.md`, `spec.md`, `design.md`, `tasks.md`, `specs/` |

The **leaf folder is the feature**. Parent folders are organization only.

## Examples

```text
specx/
  STRUCTURE.md          ← this file
  features.yaml         ← catalog + depends_on (M→M)
  _template/            ← private scaffold (not a feature)
  discovery/            ← reserved (Layer 1)
  foundation/           ← reserved
  auth/                 ← segment
    SEGMENT.md
    email/
      registration/     ← feature leaf
        FEATURE.md
        spec.md
        design.md
        tasks.md
      forgot-password/  ← another feature leaf
```

## Segment naming

| Pattern | Kind | Example |
|---------|------|---------|
| `kebab-case` | Route segment | `auth`, `email`, `forgot-password` |
| `(name)` | Route group | `(platform)` |
| `[param]` | Dynamic | `[id]` |
| `_name` | Private | `_template` only |

## Agents

```bash
specx propose auth/email/registration -m "Email signup"
specx dep add auth/email/forgot-password auth/email/registration
specx feature list
specx feature structure
```

Update work **in the same leaf path** — do not create a new top-level folder for every iteration.

## Catalog

Paths in `specx/features.yaml` match the folder path: `auth/email/registration`.
