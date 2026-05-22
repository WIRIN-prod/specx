---
name: specx-build
description: >-
  Implement one specX task at a time from tasks.md with fresh context. Use for
  /specx:build or implementing features in specx/changes.
---

# specX build

Follow `.specx/commands/build.md` in full.

## One task per session

1. Pick next `- [ ]` in `tasks.md`
2. Re-read relevant spec scenarios for that task only
3. Implement + test
4. Mark `- [x]` when verified
5. Report traceability to requirement/scenario

## Stop conditions

- Spec ambiguity → ask human
- Task needs spec change → `/specx:spec` revision first
- Failing verify → fix before next task
