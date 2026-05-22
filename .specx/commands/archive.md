---
description: specX archive — OpenSpec merge deltas into living specs, archive change, product memory. Use only after verify READY and explicit human approval.
---

# specX archive — Merge living specs (OpenSpec + product memory)

**OpenSpec archive cycle:** Merge `changes/<name>/specs/**` deltas into `specx/specs/**`, move change to `changes/archive/YYYY-MM-DD-<name>/`, update changelog.

**Product memory:** Living specs stay delta-compatible forever — next change uses MODIFIED/REMOVED against this truth.

## Preconditions (all required)

- [ ] Human explicitly said to archive
- [ ] **specx-verify** verdict **READY FOR ARCHIVE** (or human documents accepted gaps)
- [ ] All tasks `[x]` or human waived list
- [ ] Enterprise: `review_before_archive` — `specx review` completed if config requires

## Steps

1. Final read of delta specs — no placeholders
2. `specx archive <change>` (CLI merges ADDED/MODIFIED/REMOVED)
3. `specx changelog` if product changelog maintained
4. Update `BUILD-ORDER.md` — mark feature shipped
5. Git commit: `specx/specs/`, `changes/archive/`, code, `.specx/registry.yaml`

Suggested message: `specx: archive <change> — <summary>`

## Post-archive evolution

- **specx retro** optional — learn spec quality gaps
- **specx drift** after large merges
- **specx health** periodic

## Forbidden

- Hand-edit living specs instead of archive merge
- Archive with open critical verify FAIL
- Archive without user words of approval

## What archive does NOT do

- Does not delete history — full change preserved in archive folder
- Does not replace STEERING — update via separate change if product truth shifted

## Next feature

**specx-propose** for following BUILD-ORDER item.
