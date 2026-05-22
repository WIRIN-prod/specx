# The six elements of a good spec (agent contract)

A spec for an AI agent must answer **six questions**. Leave any open and the agent will answer them for you — in ways you won't like.

specX maps each element to **concrete artifacts**. Do not skip an element because it "feels obvious."

| # | Element | Bad (agent fills the gap) | Good | specX artifact |
|---|---------|---------------------------|------|----------------|
| **1** | **Outcomes when done** | "Build auth flow" | "User signs up with email/password, receives verification email, logs in without error; session persists across refresh" | `### Requirement:` + `#### Scenario:` (GIVEN/WHEN/THEN) in `specs/**/spec.md` |
| **2** | **In-scope & out-of-scope** | Only in-scope listed | Explicit **out-of-scope**: "OAuth is out of scope for this change" | `proposal.md` **Out of scope** + repeat in change `spec.md` header |
| **3** | **Constraints & assumptions** | Agent assumes stack/API limits | "Must use existing Postgres; SendGrid rate limit 100/s; p95 < 200ms" | `proposal.md` Impact; `design.md`; `STEERING.md` + `RULES.md`; `## Assumptions` in spec |
| **4** | **Decisions already made** | Agent picks library/schema | "bcrypt for passwords; sessions in Redis; no new tables beyond X" | `design.md` Decisions; `ARCHITECTURE.md` ADRs; `## Decisions already made` in spec |
| **5** | **Task breakdown** | "Implement the feature" one shot | Discrete checkboxes, one session each, parallel-safe file boundaries | `tasks.md` (`- [ ] X.Y`) — **specx-tasks** / **specx-build** |
| **6** | **Verification criteria** | "Does it work" | Named tests + edge cases: "signup.spec.ts passes; expired token returns 401" | Scenarios in spec + **specx-verify** traceability table |

## Pairing with persistent context (element 3)

**AGENTS.md / STEERING** = project-wide constraints the agent reads every session.  
**Change spec** = task-specific outcomes, scope, and verification.

Never write a change spec without reading `STEERING.md` + `RULES.md` first.

## Critic + Verifier use this list

**specx-critic:** flag any missing element → REVISE_REQUIRED.  
**specx-verify:** element 6 is the literal checklist (PASS/FAIL per scenario + tests).

## Anti-pattern

Feature names without outcome statements. Replace "Add dark mode" with requirements a stranger could test without reading the codebase.
