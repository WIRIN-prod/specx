---
description: /specx:spec — follow specX skill specx-spec
---

# /specx:spec

**Apply the full specX skill:** `.cursor/skills/specx-spec/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX spec — Behavior specification (OpenSpec delta model)

Translate **Capabilities** into testable requirements. Living truth path: `specx/specs/<domain>/spec.md`. Work path: `specx/changes/<change>/specs/<domain>/spec.md`.

**GSD:** Write each spec as the **only** instructions an implementer will receive for that domain.

Read **`specx-sdd/six-elements.md`** — every change must cover all six before design/tasks/build.

## Six elements → where you write them

| Element | You write |
|---------|-----------|
| **1 Outcomes** | `### Requirement:` + `#### Scenario:` — outcome statements, not feature names ("auth flow" → sign-up, verify email, login, session persists) |
| **2 Scope** | Pull from proposal; add `## In scope` / `## Out of scope` at top of change `spec.md` — **out-of-scope is mandatory** (e.g. "OAuth out of scope") |
| **3 Constraints** | `## Assumptions and constraints` in spec — stack, APIs, perf, limits not obvious from code alone; cite STEERING/RULES |
| **4 Decisions made** | `## Decisions already made` in spec — schema, libraries, patterns already chosen; rest goes to design.md |
| **5 Task breakdown** | Not in spec file — **specx-tasks** maps each requirement/scenario → checkbox |
| **6 Verification** | Every scenario = testable acceptance; add `## Verification criteria` summary listing tests + edge cases for **specx-verify** |

## Change-level `spec.md` header (required)

At `specx/changes/<change>/spec.md` before domain deltas:

```markdown
## In scope
- ...

## Out of scope
- OAuth / social login (not this change)
- ...

## Assumptions and constraints
- ...

## Decisions already made
- ...

## Verification criteria
- Tests: ...
- Edge cases: expired token, duplicate email, ...
```

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

## Critic must validate (six elements)

- [ ] **1** Outcomes are testable outcome statements, not feature labels
- [ ] **2** Out-of-scope list is explicit and closes common agent expansions
- [ ] **3** Constraints/assumptions stated (not only in chat)
- [ ] **4** Decisions made are listed — agent won't re-decide schema/library
- [ ] **5** (after tasks) Every requirement maps to a task — flag if missing
- [ ] **6** Verification criteria name tests and edge cases
- Every SHALL has scenario; MODIFIED full blocks; REMOVED has Migration

## Common failures (avoid)

- Bullet scenarios with 3 hashtags
- MODIFIED with only the delta sentence
- Implementation steps disguised as requirements
- Duplicate capability folders (check proposal list twice)

## After human approval

**specx-design** → **specx-tasks** → **specx-build**
