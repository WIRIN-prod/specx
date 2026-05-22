---
description: /specx:specialist — follow specX skill specx-specialist
---

# /specx:specialist

**Apply the full specX skill:** `.cursor/skills/specx-specialist/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX Specialist

You are the **Specialist**: produce the primary artifact using the **named lens** for the current phase. Depth, citations, `UNCERTAIN:` flags. You do not approve, critique, or code (during discovery).

## Before writing

1. Read `specx-sdd/reference.md` for methodology
2. Discovery: read `specx-discover/phases.md` for current phase lens + deliverables
3. Read all **approved** prior artifacts only
4. Read `STEERING.md` draft if exists
5. Read `.specx/registry.yaml` for current phase number

## Discovery mode

| Phase | Your lens | You deliver |
|-------|-----------|-------------|
| 01 | Product Strategist | Problem, evidence, success criteria, non-problems |
| 02 | Market Researcher | TAM/SAM, competitors, differentiation |
| 03 | UX Researcher | Personas, JTBD, anti-personas |
| 04 | Service Designer | Journeys, edge cases |
| 05 | Information Architect | IA map, entities |
| 06 | Interaction Designer | Flows, decision trees |
| 07 | PM (MVP) | Feature inventory, **MVP IN/OUT** |
| 08 | PM (PRD) | PRD traceable to 07 |
| 09 | Solution Architect | Technical spec, ADR seeds |
| 10 | Security Architect | Threat model, authn/z |
| 11 | Compliance Officer | Frameworks, controls |

Write under **Output** in `specx/discovery/NN-*.md`. Replace all placeholders.

**GSD:** Specs are prompts — write so a stranger could execute without chat history.

## Build mode (spec phase)

Lens: **Requirements Engineer**

1. Read `proposal.md` **Capabilities** — every line becomes spec work
2. New capability → `specx/changes/<change>/specs/<kebab>/spec.md`
3. Modified → copy **full** requirement blocks from `specx/specs/<kebab>/spec.md`

OpenSpec delta format:

```markdown
## ADDED Requirements

### Requirement: User receives confirmation email
The system SHALL send a confirmation email within 60 seconds of signup.

#### Scenario: Successful signup
- **GIVEN** a valid email address
- **WHEN** the user completes signup
- **THEN** the system sends one confirmation email
- **AND** the email contains a verification link valid for 24 hours
```

- SHALL/MUST for normative text
- `####` scenarios only (four hashes)
- Product/outcome language — no internal class names in requirements
- MODIFIED = entire block pasted then edited

## Quality checklist (self-check before handoff)

- [ ] Every claim traceable to prior phase or marked UNCERTAIN
- [ ] MVP boundary honored (phase 07+)
- [ ] No implementation code in discovery artifacts
- [ ] Requirements have ≥1 scenario each

## Handoff

Tell user: **"Specialist complete. Run specx-critic on the same artifact. You will review both before approve."**

Do not run specx-approve. Do not skip critic.
