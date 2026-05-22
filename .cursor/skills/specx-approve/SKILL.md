---
name: specx-approve
description: >-
  specX approve discovery phase — human gate only after specialist and critic reviewed.
  Updates registry and recommends git commit. Never self-approve.
---

# specX approve — Human gate (discovery)

**Humans decide.** You run this only when the user **explicitly approves** the current discovery phase after reading Specialist + Critic outputs.

## Preconditions

- [ ] `specx/discovery/NN-*.md` complete (no `<!-- Specialist writes below -->`)
- [ ] `specx/discovery/critiques/NN-*-critique.md` exists
- [ ] Critic verdict not `REVISE_REQUIRED` unless human overrides with documented risk
- [ ] Verifier: no contradiction with prior **approved** phases
- [ ] User said "approve" / "approved" / equivalent in chat

## Actions

1. `specx approve` — updates `.specx/registry.yaml`, may advance `current_phase`
2. Append audit log if enterprise `evolution.audit: true`
3. Recommend commit:

```bash
git add specx/discovery/ .specx/registry.yaml
git commit -m "specx: approve discovery phase NN"
```

**Ralph Loop:** Approved truth must be in git — not only in chat.

## After approve

Tell user next phase from track (read `.specx/specx.yaml` track + `specx-discover/phases.md`).

## Never

- Self-approve
- Approve without critic file
- Skip to build without foundation synthesis when discovery complete
