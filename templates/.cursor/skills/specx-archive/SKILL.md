---
name: specx-archive
description: >-
  Deprecated. Features are persistent leaf folders under specx/<path>/ — update in place.
---

# specX archive — Deprecated

Features are **leaf folders** under `specx/`, not under `specx/features/`:

```text
specx/auth/email/registration/
  FEATURE.md
  spec.md
  design.md
  tasks.md
```

When done: **specx-verify** → human approve → **git commit** that path.

`specx archive` only prints a deprecation notice.
