---
description: specX spec — Spec-Driven Development
---

When the user runs **/specx:spec**, follow this playbook:

Read and execute: `.specx/commands/spec.md`

Also apply skill `specx-sdd` and domain skill `specx-spec` if it exists.

---

---
description: Generate behavior specs and delta specs from the proposal
---

# /specx:spec — Behavior specification

Translate the **proposal Capabilities** into testable requirements. This is the SDD contract for implementation.

## Prerequisites

- `specx/changes/<change>/proposal.md` exists and Capabilities are filled.
- Run **Specialist** pass on specs, then **Critic** pass (see `/specx:specialist` and `/specx:critic`).

## Steps

1. Read `proposal.md` Capabilities section line by line.
2. For each **new** capability: create `specx/changes/<change>/specs/<capability>/spec.md`.
3. For each **modified** capability: open `specx/specs/<capability>/spec.md`, copy full requirement blocks being changed.
4. Update root `specx/changes/<change>/spec.md` as index/summary if helpful.

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
<full updated requirement + all scenarios>

## REMOVED Requirements

### Requirement: <name>
**Reason**: ...
**Migration**: ...
```

## SDD rules

- Use **SHALL/MUST** for normative requirements.
- **Product language**: user-visible outcomes, not internal class names.
- Every `### Requirement:` has ≥1 `#### Scenario:`.
- MODIFIED must include **complete** requirement blocks — partial deltas lose detail at archive.
- If behavior is new and old requirement unchanged, use ADDED not MODIFIED.
- Cross-check `specx/foundation/RULES.md` for conventions (auth, errors, i18n).

## Critic must verify

- Orphan requirements with no scenario
- Contradictions with `specx/specs/` living specs
- Missing REMOVED migration for breaking changes
- Implementation leakage (SQL, framework) in requirements

## After completion

Human reviews spec + critique. Then: **`/specx:design`**.
