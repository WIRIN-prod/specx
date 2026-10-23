---
name: "source-command-specx-init"
description: "Initialize specX in this project — config, agent pool, and agent wiring"
---

# source-command-specx-init

Use this skill when the user asks to run the migrated source command `specx-init`.

## Command Template

Initialize specX here.

1. Run `specx init`.
2. Report what it created.
3. Check whether `.env` exists with a `PLANE_API_KEY`. If it does not, tell the
   user to add one from **Plane → Workspace Settings → API Tokens** and stop —
   do not ask them to paste the key into chat, and do not write a key you were
   given in chat into any tracked file.
4. Once the key is in place, the next step is `/specx:link`.

Do not create a spec tree, a `specx/` directory, or any local spec files. Work
items live in Plane by design.
