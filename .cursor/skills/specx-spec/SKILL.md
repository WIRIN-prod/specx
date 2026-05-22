---
name: specx-spec
description: >-
  Write behavior specs and ADDED/MODIFIED/REMOVED delta specs from proposal Capabilities.
  Use for /specx:spec, requirements, scenarios, GIVEN WHEN THEN, or after propose.
---

# specX spec — Behavior specification

Translate **proposal Capabilities** into testable requirements. This is the **SDD contract** for all implementation.

## Prerequisites

- `specx/changes/<change>/proposal.md` with Capabilities filled
- After this pass: run **specx-critic** skill, then human review

## Steps

1. Read `proposal.md` Capabilities line by line.
2. **New** capability → `specx/changes/<change>/specs/<capability>/spec.md`
3. **Modified** capability → copy full blocks from `specx/specs/<capability>/spec.md`, edit under MODIFIED
4. Optional index in `specx/changes/<change>/spec.md`

## Delta format (required)

```markdown
## ADDED Requirements

### Requirement: <name>
The system SHALL <observable behavior>.

#### Scenario: <name>
- **GIVEN** <precondition>
- **WHEN** <action>
- **THEN** <outcome>

## MODIFIED Requirements

### Requirement: <existing name>
<entire requirement + all scenarios, edited>

## REMOVED Requirements

### Requirement: <name>
**Reason**: ...
**Migration**: ...
```

## SDD rules

- **SHALL/MUST** for normative requirements
- **Product language** — user-visible outcomes, not class names
- Every `### Requirement:` has ≥1 `#### Scenario:`
- MODIFIED = **complete** blocks — partial deltas lose detail at archive
- New behavior only → ADDED, not MODIFIED
- Check `specx/foundation/RULES.md`

## Critic checklist (for specx-critic)

- Orphan requirements without scenarios
- Contradictions with living specs
- Missing REMOVED migration for breaking changes
- Implementation leakage in requirements

## After

Human approves spec + critique → **specx-design** skill next.
