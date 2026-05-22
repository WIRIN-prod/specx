---
description: Merge deltas into living specs and archive the change
---

# /specx:archive — Merge and preserve

Archive only after **human explicitly approves** and verify pass is acceptable.

## Preconditions

- User said to archive (never assume).
- `/specx:verify` verdict READY (or user accepts known gaps).
- Enterprise: `review_before_archive` satisfied — check `.specx/specx.yaml` and registry.

## Steps

1. Confirm `specx/changes/<change>/specs/**` deltas are complete.
2. Run `specx archive <change>` (merges into `specx/specs/`, moves to `archive/`).
3. Run `specx changelog` if product changelog should update.
4. Suggest git commit: specs + code + registry.

## Post-archive

- Update `specx/foundation/BUILD-ORDER.md` if feature shipped.
- Optional: `/specx:retro` for retrospective.
- Run `/specx:drift` after large merges.

## Rules

- Do not archive with open `- [ ]` tasks unless user waives.
- Do not edit living specs manually — archive merge is source of truth.
