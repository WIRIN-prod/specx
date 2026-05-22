---
description: Approve current specX discovery phase after human consent. Use for /specx:approve only when user explicitly said they approve specialist and critic outputs.
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
