# Discovery phases — specialist lenses & gate criteria

Use with **specx-specialist** (write) and **specx-critic** (challenge). One phase per session when possible (GSD context).

## Graph (every phase)

Read **`specx-graph`**. Each phase file must have:

1. YAML frontmatter (`specx.layer: discovery`, `specx.phase`, `specx.status`)
2. Wikilinks in **Output** to all approved prior phases cited
3. Trailing **`## Graph`** table (Hub → [[Home]], Upstream, Downstream, Related)
4. **07 / 08:** wikilink each feature to `[[segment/.../leaf/FEATURE]]` (stub leaf OK before propose)

After approve: update [[Home]] status row + commit with phase file.

## Phase 01 — Problem definition

**Specialist lens:** Product Strategist  
**File:** `specx/discovery/01-problem-statement.md`

**Deliver:**
- Problem statement (who, pain, frequency, cost of problem)
- Evidence table (source, date, finding) or `UNCERTAIN:` with research plan
- Success criteria (measurable, time-bound)
- Constraints (budget, timeline, regulatory, tech)
- Explicit **non-problems** (out of scope for this product)

**Critic focuses:** Vanity metrics, solution disguised as problem, missing segments, unstated assumptions.

**Gate:** Human can explain the problem in one sentence; success criteria are testable.

---

## Phase 02 — Market + competitor research

**Specialist lens:** Market Researcher  
**File:** `02-market-research.md`

**Deliver:**
- TAM/SAM/SOM (ranges + assumptions)
- Competitor matrix (feature, pricing, positioning)
- Differentiation hypothesis
- Risks (market timing, commoditization)
- Citations or UNCERTAIN flags

**Critic focuses:** Stale data, survivor bias, ignoring adjacent competitors, no "why us now."

**Gate:** Clear positioning vs at least 3 alternatives.

---

## Phase 03 — Personas + Jobs To Be Done

**Specialist lens:** UX Researcher  
**File:** `03-personas.md`

**Deliver:**
- 2–5 personas (name, role, goals, frustrations, context)
- JTBD per persona: "When … I want … so I can …"
- Primary vs secondary persona
- Anti-personas (who we do not build for)

**Critic focuses:** Generic personas, missing edge users, JTBD that are features in disguise.

**Gate:** Every later journey maps to a named persona.

---

## Phase 04 — User journeys + edge cases

**Specialist lens:** Service Designer  
**File:** `04-user-journeys.md`

**Deliver:**
- End-to-end journeys per primary persona (steps, touchpoints, emotion)
- Edge cases and failure paths
- Happy path vs recovery path
- Dependencies on external systems

**Critic focuses:** Happy-path only, missing onboarding/offboarding, accessibility gaps.

**Gate:** Journeys cover start → goal → exit without gaps.

---

## Phase 05 — Information architecture

**Specialist lens:** Information Architect  
**File:** `05-information-architecture.md`

**Deliver:**
- Site/app map (sections, hierarchy)
- Core entities and relationships
- Navigation model
- Content types and ownership
- Open IA questions

**Critic focuses:** Orphan screens, duplicate concepts, scale limits unstated.

**Gate:** IA supports all phase 04 journeys.

---

## Phase 06 — User flows + decision trees

**Specialist lens:** Interaction Designer  
**File:** `06-user-flows.md`

**Deliver:**
- Flow per critical journey (nodes, decisions, branches)
- Entry/exit conditions per screen/state
- Error and empty states
- Decision trees for complex logic (auth, permissions, billing)

**Critic focuses:** Missing branches, dead ends, inconsistent back navigation.

**Gate:** Flows implement IA without undefined states.

---

## Phase 07 — Feature inventory + MVP boundary

**Specialist lens:** Product Manager (MVP)  
**File:** `07-feature-inventory.md`

**Deliver:**
- Full feature inventory (ID, name, description, persona)
- MoSCoW or P0/P1/P2
- **MVP boundary** — explicit IN vs OUT list
- Dependencies between features
- This file **binds** `BUILD-ORDER.md` until changed via specX change

**Critic focuses:** No real cut line, hidden scope creep, MVP not viable.

**Gate:** MVP is shippable and testable; OUT list is explicit.

---

## Phase 08 — PRD

**Specialist lens:** Product Manager (PRD)  
**File:** `08-prd.md`

**Deliver:**
- Executive summary
- Goals / non-goals (from 01, 07)
- Functional requirements by feature ID (references 07)
- NFRs (performance, availability, accessibility)
- Release criteria for MVP
- Open questions

**Critic focuses:** Requirements not traceable to personas/journeys, missing NFRs, vague acceptance.

**Gate:** PRD is implementable without guessing intent.

---

## Phase 09 — Technical spec

**Specialist lens:** Solution Architect  
**File:** `09-technical-spec.md`

**Deliver:**
- System context diagram (text/mermaid)
- Key technical decisions (candidates → choice → rationale)
- Data model sketch
- Integration points
- Non-functional technical approach
- ADR seeds for `ARCHITECTURE.md`
- Risks and spikes

**Critic focuses:** Over-engineering, under-specified integrations, security as afterthought.

**Gate:** Build team can estimate; no blocking unknowns without logged spikes.

---

## Phase 10 — Security (enterprise)

**Specialist lens:** Security Architect  
**File:** `10-security.md`

**Deliver:**
- Threat model (STRIDE or equivalent)
- AuthN/AuthZ model
- Data classification
- Secrets, encryption, audit logging
- Security requirements → future spec domains

**Critic focuses:** Missing threat actors, auth bypass paths, PII handling gaps.

**Gate:** Security requirements traceable to PRD features.

---

## Phase 11 — Compliance (enterprise)

**Specialist lens:** Compliance Officer  
**File:** `11-compliance.md`

**Deliver:**
- Applicable frameworks (SOC2, GDPR, HIPAA, etc.)
- Control mapping
- Audit and retention requirements
- Compliance-driven feature flags / gates

**Critic focuses:** Framework name-dropping without controls, conflicts with MVP scope.

**Gate:** Compliance scope agreed or explicitly deferred with risk acceptance.

---

## After all required phases approved

1. Synthesize `specx/foundation/STEERING.md` (03, 04, 08, non-negotiables from 01)
2. Synthesize `specx/foundation/BUILD-ORDER.md` (07, 08)
3. Seed `ARCHITECTURE.md` from 09 (and 10 if enterprise)
4. Commit foundation + discovery
5. Begin build: **specx-propose**
