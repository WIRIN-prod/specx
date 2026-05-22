---
description: /specx:approve — follow specX skill specx-approve
---

# /specx:approve

**Apply the full specX skill:** `.cursor/skills/specx-approve/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX approve — Discovery gate

**Only when the user explicitly approves** the current discovery phase.

## Checklist

- [ ] Specialist output in `specx/discovery/NN-*.md` is complete (no placeholders)
- [ ] Critic file exists in `specx/discovery/critiques/`
- [ ] User said "approve" or equivalent in chat

## Then

1. Run `specx approve` (updates `.specx/registry.yaml`)
2. Suggest git add: discovery files + registry
3. Tell user next phase: `specx phase <n+1>` or discovery complete → update STEERING

## Never

- Approve without user consent
- Skip critic pass
- Approve empty/template-only outputs
