---
name: specx-approve
description: >-
  specX approve — human gate for discovery phases and build artifacts (proposal, spec,
  design, tasks). Updates registry. Never self-approve.
---

# specX approve — Human gate (discovery + build)

**Humans decide.** Run only when the user **explicitly approves** after reviewing Specialist + Critic (discovery) or change artifacts (build).

## Targets

| Command | Approves |
|---------|----------|
| `specx approve` | Next unapproved artifact on **active change**, or current **discovery** phase if no change work pending |
| `specx approve discovery` | Current discovery phase |
| `specx approve 9` | Discovery phase 09 |
| `specx approve proposal` | `proposal.md` on active change |
| `specx approve spec` | `spec.md` |
| `specx approve design` | `design.md` |
| `specx approve tasks` | `tasks.md` (task list gate) |
| `specx approve change` | All artifacts on active change |
| `specx approve <change-name>` | Whole change |
| `specx approve spec --change foo` | Artifact on named change |

## Preconditions (discovery)

- [ ] `specx/discovery/NN-*.md` complete (no placeholder comments)
- [ ] Critic reviewed; user said "approve"
- [ ] No contradiction with prior **approved** phases

## Preconditions (build)

- [ ] Artifact file exists and is complete
- [ ] User said "approve" for that artifact (spec / design / tasks / proposal)
- [ ] Do not approve implementation code — approve **documents** only

## Actions

1. Run the appropriate `specx approve …` — updates `.specx/registry.yaml`
2. Recommend commit (Ralph: approved truth in git):

```bash
git add specx/ .specx/registry.yaml
git commit -m "specx: approve <phase or artifact>"
```

## After approve (build)

- Next artifact hint printed by CLI (e.g. `spec` → `design` → `tasks`)
- When all artifacts approved: `specx build` (implements **all** open tasks by default)

## Never

- Self-approve
- Skip critic on discovery
- Approve build while artifacts still in `revision` without human sign-off
