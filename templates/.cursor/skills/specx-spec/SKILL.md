---
name: specx-spec
description: >-
  specX spec — OpenSpec delta requirements ADDED MODIFIED REMOVED with scenarios. GSD: specs
  are prompts. Use after propose, for requirements, behavior contracts, SHALL GIVEN WHEN THEN.
---

# specX spec — Behavior specification (OpenSpec delta model)

Translate **Capabilities** into testable requirements. Living truth path: `specx/specs/<domain>/spec.md`. Work path: `specx/changes/<change>/specs/<domain>/spec.md`.

**GSD:** Write each spec as the **only** instructions an implementer will receive for that domain.

## Prerequisites

- Approved `proposal.md` with Capabilities filled
- Specialist pass → **specx-critic** → human review

## Per capability workflow

For each **new** capability in proposal:

1. Create `specx/changes/<change>/specs/<capability>/spec.md`
2. Start with `## Purpose` (1 short paragraph)
3. Add `## ADDED Requirements` with all new behavior

For each **modified** capability:

1. Open `specx/specs/<capability>/spec.md`
2. Identify which `### Requirement:` blocks change
3. Copy **entire** block (requirement + all `#### Scenario:`) into `## MODIFIED Requirements`
4. Edit to new behavior — header text must match living spec (whitespace-insensitive)

For **removed** behavior:

```markdown
## REMOVED Requirements

### Requirement: Legacy export format
**Reason**: Replaced by CSV export v2
**Migration**: Use endpoint /api/v2/export; v1 removed 2026-Q2
```

## Format (strict — archive parser expects this)

```markdown
## ADDED Requirements

### Requirement: <imperative name>
The system SHALL <observable behavior>.

#### Scenario: <outcome name>
- **GIVEN** <precondition>
- **WHEN** <trigger>
- **THEN** <outcome>
- **AND** <additional outcome optional>

## MODIFIED Requirements

### Requirement: <exact name from living spec>
<full updated requirement + all scenarios>

## REMOVED Requirements
...
```

| Rule | Detail |
|------|--------|
| Headers | `###` requirement, `####` scenario — never `###` for scenarios |
| Modality | SHALL/MUST normative; avoid should/may unless intentional |
| Language | User/system observable — not "AuthService validates" |
| MODIFIED | Full blocks only — partial deltas lose detail at archive |
| ADDED vs MODIFIED | New concern on unchanged requirement → ADDED |

## Traceability

Add optional table in change `spec.md`:

| Capability | Requirement | PRD ref | Feature ID |
|------------|-------------|---------|------------|

## Critic must validate

- Every SHALL has scenario
- No contradiction with living specs (list conflicts)
- Breaking changes have REMOVED + Migration
- Enterprise security requirements from phase 10 reflected if applicable

## Common failures (avoid)

- Bullet scenarios with 3 hashtags
- MODIFIED with only the delta sentence
- Implementation steps disguised as requirements
- Duplicate capability folders (check proposal list twice)

## After human approval

**specx-design** → **specx-tasks** → **specx-build**
