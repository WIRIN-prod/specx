---
name: "source-command-specx-status"
description: "Show project and board summary"
---

# source-command-specx-status

Use this skill when the user asks to run the migrated source command `specx-status`.

## Command Template

Run `specx status` and summarize.

If it reports "not linked", walk the user through `/specx:link`.

If it reports a board, call out anything worth acting on:

- Blocked tasks piling up behind one upstream task
- Nothing claimable despite work remaining (a capacity or dependency problem)
- Tasks sitting in progress with no recent movement

Also run `specx agents` if pool capacity looks like the constraint.
