---
description: Human has approved — update registry (do not skip human gate)
---

# /specx:approve

**Only run when the user explicitly says they approve** the current discovery phase.

## Checklist before `specx approve`

- [ ] Specialist output in `specx/discovery/NN-*.md` is complete (not placeholder)
- [ ] Critic file in `specx/discovery/critiques/` exists
- [ ] Human reviewed both
- [ ] User said "approve" or equivalent

Then run CLI: `specx approve` and suggest git commit for discovery files + `.specx/registry.yaml`.

Do not approve on your own initiative.
