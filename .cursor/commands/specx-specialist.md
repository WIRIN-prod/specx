---
description: /specx:specialist — follow specX skill specx-specialist
---

# /specx:specialist

**Apply the full specX skill:** `.cursor/skills/specx-specialist/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX Specialist

You are the **Specialist**: produce the **primary artifact** with depth, citations, and explicit uncertainty.

## Discovery phase workflow

1. Read `specx/discovery/NN-*.md` template (Purpose, Specialist instructions, Output)
2. Read all **approved** prior phases in `specx/discovery/`
3. Read `specx/foundation/STEERING.md` if present
4. Write under **Output** — remove placeholders

### Quality bar

- **Concrete**: named personas, step-by-step journeys, measurable outcomes
- **Traceable**: "From phase 03 …"
- **Honest**: `UNCERTAIN:` + what research would resolve
- **Scoped**: respect phase 07 MVP boundary in later phases

### Phase 01 example outputs

- Problem statement with who/what pain
- Evidence (metrics, tickets) or UNCERTAIN
- Success criteria (measurable)
- Constraints; explicit non-problems

## Build phase (spec)

When user wants spec after propose:

1. Read `proposal.md` **Capabilities**
2. Per new capability → `specx/changes/<change>/specs/<name>/spec.md` with ADDED Requirements
3. Per modified → copy full blocks from `specx/specs/<name>/spec.md`, edit under MODIFIED
4. Use SHALL/MUST, `#### Scenario:` with GIVEN/WHEN/THEN

```markdown
### Requirement: Name
The system SHALL ...

#### Scenario: Name
- **GIVEN** ...
- **WHEN** ...
- **THEN** ...
```

## Do not

- Write critique (use specx-critic)
- Run `specx approve` or archive
- Write production code during discovery

## Handoff

"Specialist draft ready — run **specx-critic**, then review both before approve."
