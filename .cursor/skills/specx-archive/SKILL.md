---
name: specx-archive
description: >-
  Archive specX change — merge deltas into living specs. Use for /specx:archive after verify
  and explicit user approval only.
---

# specX archive — Merge and preserve

Merge deltas into `specx/specs/`. **Only when user explicitly approves.**

## Preconditions

- User said "archive" or equivalent — never assume
- specx-verify verdict **READY** (or user accepts gaps)
- Enterprise: `review_before_archive` — check `.specx/specx.yaml`

## Steps

1. Confirm `specx/changes/<change>/specs/**` complete
2. `specx archive <change>`
3. Optional `specx changelog`
4. Suggest git commit: specs + code + registry

## Post-archive

- Update `BUILD-ORDER.md` if feature shipped
- Optional retrospective
- `specx drift` after large merges

## Rules

- No open `- [ ]` tasks unless user waives
- Do not hand-edit living specs — CLI merge is truth
