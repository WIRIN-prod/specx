# Work plan: Blueprint-first SpecX lifecycle

- ID: project-blueprint-lifecycle
- State: review required
- Revision: 1
- Created: 2026-10-24
- Goal: Make SpecX guide a project from research and user-approved, build-ready written specifications through a phased implementation roadmap and controlled software delivery lifecycle.
- Approved knowledge revision(s): User direction in chat, 2026-10-24: SpecX should help users plan a complete project in text before coding; a frontier model collaborates with the user on research, requirements, complete architecture, technical stack, components and decisions; implementation agents then follow small explicit tasks through branch, build, test, review and human-approved merge.
- Supersedes: None

## Success criteria and boundaries

- Existing-app onboarding distinguishes the observed current system from the intended target system. Discovery produces an evidence-linked current-state survey and explicit gaps; it does not imply that existing behavior is desired behavior.
- Users can author a hierarchical specification tree, for example `Identity and Access Management / Authentication / Login`, with stable IDs, parent-child relationships, component and feature boundaries, behavior, interfaces, data, permissions, failure paths, constraints, and observable acceptance criteria.
- A frontier-model specification workflow researches relevant primary sources and comparable public systems where useful, collaborates with the user on decisions, and records sources, alternatives, rationale, and unresolved questions. It does not write application code.
- The project blueprint captures product outcomes and journeys; system boundaries and architecture; components and their relations; APIs/events; data ownership and flows; security/privacy; operational/runtime design; quality attributes; constraints; and a selected technical stack with versions/selection rationale where those are knowable and approved.
- A visible readiness assessment blocks build-roadmap approval while required decisions or critical specification coverage remain unresolved. Exceptions must be explicitly accepted by the user and recorded with scope and consequences; the model cannot waive the gate.
- The build roadmap maps approved specs to phases, milestones, dependencies, and small implementation tasks. Every task traces to approved requirements and includes scope, prerequisites, acceptance criteria, verification, risk, and a suggested model capability with rationale.
- Build agents receive only an explicitly approved task. The workflow requires syncing with the target base, a task branch, implementation, task-relevant tests/checks, a diff/acceptance review, and a human merge decision. Agents do not merge or deploy without a separately approved policy.
- Checkpoints preserve blueprint revision, roadmap revision, approved scope, task/branch state, evidence, blockers, and next action so another session or host can resume safely.
- Existing knowledge-approval, plan-approval, and human code-review boundaries remain explicit. This plan changes product behavior only within the listed artifacts and does not introduce an external tracker or autonomous coding before blueprint readiness.

## User decisions required before execution

None required to implement this workflow foundation. Unspecified product requirements remain questions for the future SpecX user during specification authoring; this implementation plan does not answer them.

## Phases

### Phase 1: Define a hierarchical, build-ready blueprint model

Purpose and outcome: Give initialized projects a clear canonical structure for product intent, nested component/feature specifications, decisions, stack, and cross-cutting architecture, while preserving provenance and separating current state from target state.

Tasks:

#### BLUEPRINT-1: Add the hierarchical specification templates and indexes

- State: done
- Intent: Define index and record templates for product blueprint readiness, nested components/features, requirements and acceptance criteria, system architecture, technical stack, interfaces/data, quality attributes, and traceability. Specify stable IDs, parent links, relations, source citations, decision links, lifecycle state, and current-versus-target distinctions. Keep records navigable in Markdown and suitable for incremental review.
- Depends on: None
- Scope (explicit files or subtrees): `templates/specx/Home.md`, `templates/specx/knowledge/**`, new `templates/specx/specifications/**`, `templates/specx/knowledge/decisions/**`, matching runtime `specx/**` product documentation and templates where needed
- Acceptance checks (observable and verifiable): An example hierarchy expresses product → component → subcomponent → feature → requirement; every target behavior has provenance/state and acceptance evidence; existing implementation is recorded separately; dependency/interface relations can be traced both ways; unresolved questions are not mistaken for approved requirements; blueprint readiness criteria are explicit and auditable.
- Risk and rollback: A new structure can duplicate or conflict with existing knowledge files. Keep a single canonical location per fact and provide links/migration guidance instead of copying records.
- Affected knowledge/components: Product model, knowledge schema, architecture, component catalog, decision records.
- Suggested agent capability: frontier
- Fit score (0–100) and rationale: 88 — the record model drives all downstream workflows and needs careful synthesis of requirements, architecture, provenance, and user gates.
- Out of scope: Automatically deciding project-specific behavior or migrating user-owned project records without approval.
- User decisions: None for the generic schema; project-specific decisions remain unresolved until authoring.

#### BLUEPRINT-2: Define blueprint readiness and traceability rules

- State: done
- Intent: Establish required coverage and a readiness report that checks unknowns, conflicting decisions, component hierarchy, requirement acceptance criteria, stack choices, interfaces/data, security, operations, quality attributes, and requirement-to-milestone/task traceability. Specify explicit user-approved exceptions and their limits.
- Depends on: BLUEPRINT-1
- Scope (explicit files or subtrees): `templates/specx/knowledge/README.md`, `templates/specx/knowledge/engineering-rules.md`, `templates/.specx/AGENTS.md`, README lifecycle documentation
- Acceptance checks (observable and verifiable): Readiness cannot be claimed based only on file existence; gaps and evidence are listed; required unresolved decisions block affected planning; an exception is explicit, scoped, dated, and does not silently resolve the unknown; each planned task traces to approved spec IDs.
- Risk and rollback: An overly rigid checklist could block valid projects. Define applicability and allow user-approved, documented exceptions rather than treating irrelevant sections as mandatory.
- Affected knowledge/components: Blueprint readiness policy, engineering rules, task traceability.
- Suggested agent capability: frontier
- Fit score (0–100) and rationale: 85 — readiness must be rigorous without falsely claiming automated completeness.
- Out of scope: Automated proof that architecture is exhaustive.
- User decisions: None.

### Phase 2: Add the frontier-led specification authoring workflow

Purpose and outcome: Add a dedicated, research-capable authoring stage that turns discovery and user conversations into reviewed specifications without implementing application code.

Tasks:

#### BLUEPRINT-3: Add the specify skill and host command wiring

- State: done
- Intent: Add `/specx:specify` as a dedicated workflow. It reads the current-state survey, researches relevant sources when needed, interviews the user about outcomes and unresolved decisions, authors or revises the hierarchical target blueprint, checks coverage and traceability, presents exact changes for approval, and stops before code or build tasks. Document that research can inform options but cannot make decisions for the user.
- Depends on: BLUEPRINT-1, BLUEPRINT-2
- Scope (explicit files or subtrees): `templates/.agents/skills/`, `src/lib/agents.ts`, host command/integration generation, `plugins/specx/skills/`, `README.md`, relevant tests
- Acceptance checks (observable and verifiable): All supported hosts expose consistent specify instructions and command; it distinguishes current and target state; citations and alternatives accompany research-derived recommendations; missing decisions remain unresolved; it writes proposed specs only and does not create code tasks or code changes; exact revision approval is required before canonical acceptance.
- Risk and rollback: Skill wiring can drift across bundled plugin and generated host adapters. Generate from a canonical template or verify parity in integration coverage.
- Affected knowledge/components: Agent workflow, command generation, installable plugin.
- Suggested agent capability: frontier
- Fit score (0–100) and rationale: 92 — the authoring skill defines the product’s core value and must reliably coordinate research, collaboration, and approval.
- Out of scope: Running unattended research or selecting requirements/stack without user review.
- User decisions: None.

#### BLUEPRINT-4: Adapt discover, propose, approve, and resume to blueprint-first onboarding

- State: done
- Intent: Update discovery to inventory the existing system and create a current-state proposal with component hierarchy and gaps; adapt proposal/approval to exact hierarchical blueprint revisions; update resume to preserve authoring stage, research sources, unresolved decisions, and readiness state.
- Depends on: BLUEPRINT-1, BLUEPRINT-2, BLUEPRINT-3
- Scope (explicit files or subtrees): `templates/.agents/skills/specx-discover/`, `templates/.agents/skills/specx-propose/`, `templates/.agents/skills/specx-approve/`, `templates/.agents/skills/specx-resume/`, mirrored plugin skills, templates for proposals/checkpoints, README
- Acceptance checks (observable and verifiable): Discovering a half-built project yields current-state evidence, target-state unknowns, and coverage gaps; approval promotes only the exact reviewed revision; accepted requirements preserve their user approval/source evidence; resume reopens the same component/spec/decision and does not treat proposals as approved.
- Risk and rollback: Existing users may have flat component records. Provide an additive migration path and preserve all existing files and links.
- Affected knowledge/components: Discovery, proposal approval, checkpoints, project knowledge migration.
- Suggested agent capability: frontier
- Fit score (0–100) and rationale: 87 — this reconciles the new target blueprint with existing-app evidence and prior SpecX trust rules.
- Out of scope: Automatically rewriting existing accepted records.
- User decisions: None.

### Phase 3: Generate a dependency-aware build roadmap from a ready blueprint

Purpose and outcome: Make plan a roadmap stage that starts only from approved, sufficiently ready specs and connects project milestones to executable small tasks.

Tasks:

#### BLUEPRINT-5: Expand plan model to phases, milestones, and traced tasks

- State: done
- Intent: Define milestones as verifiable product/architecture outcomes and phases as ordered delivery groupings. Map dependencies across components and milestones, then decompose into small tasks linked to approved spec IDs, files, prerequisites, acceptance criteria, test strategy, risk, and model capability fit. Add a roadmap approval gate distinct from specification approval.
- Depends on: BLUEPRINT-1, BLUEPRINT-2
- Scope (explicit files or subtrees): `templates/.agents/skills/specx-plan/`, `templates/specx/plans/**`, `specx/plans/**` documentation, mirrored plugin skill, README, tests
- Acceptance checks (observable and verifiable): Planning refuses or clearly blocks where required blueprint decisions are unresolved; every milestone has measurable exit criteria; every task has spec traceability, bounded scope, dependencies, acceptance checks, and agent recommendation rationale; DAG has no cycles; no task is executable before exact roadmap revision approval.
- Risk and rollback: Existing plans may use a simpler phase/task structure. Retain backward-readable fields or document versioned migration without rewriting approved plan history.
- Affected knowledge/components: Roadmaps, milestone and task schema, dependency validation.
- Suggested agent capability: frontier
- Fit score (0–100) and rationale: 90 — dependency ordering and task granularity determine whether small models can execute reliably.
- Out of scope: Automatic agent dispatch or external project-board synchronization.
- User decisions: None.

### Phase 4: Make execution follow a controlled SDLC handoff

Purpose and outcome: Ensure implementation agents can operate cheaply and safely from the approved blueprint and small task contracts, while preserving user control over merge and deployment.

Tasks:

#### BLUEPRINT-6: Specify branch, implementation, verification, review, and merge handoffs

- State: done
- Intent: Update execute, review, and resume workflows for one approved task per branch: verify base and clean task scope while preserving user changes; create/use a task branch; inspect relevant approved specs; implement only that task; run required checks; record evidence and branch/commit/PR details; review diff against requirement/task acceptance criteria; resolve findings in scope; then wait for explicit human approval to merge. Record any new decisions as blocked questions/proposals. Document host/git capabilities and safe fallback if branch creation or PR tooling is unavailable.
- Depends on: BLUEPRINT-5
- Scope (explicit files or subtrees): `templates/.agents/skills/specx-execute/`, `templates/.agents/skills/specx-review/`, `templates/.agents/skills/specx-resume/`, mirrored plugin skills, `templates/specx/work/**`, engineering rules, README, tests
- Acceptance checks (observable and verifiable): A low-capability agent can identify the one approved task, its linked spec, dependencies, branch, checks, and stop conditions from Markdown; it cannot exceed scope or resolve missing decisions; task completion records concrete verification; review compares code to both task acceptance and parent spec; human merge approval remains explicit; resume verifies actual Git state against checkpoint.
- Risk and rollback: Git workflows differ by host/repository. Make branch and PR operations explicit where supported and require a safe documented user action where unavailable; never fake a successful merge or check.
- Affected knowledge/components: Implementation SDLC, checkpoints, host integration limits, code review boundary.
- Suggested agent capability: frontier
- Fit score (0–100) and rationale: 86 — workflow must be precise across different Git hosts and agent capabilities while keeping the human merge gate.
- Out of scope: Autonomous merge, deployment, or unbounded multi-task agent runs.
- User decisions: None.

#### BLUEPRINT-7: Align onboarding, documentation, and workflow integration checks

- State: done
- Intent: Explain the end-to-end path for greenfield and existing applications, the frontier-versus-small-agent responsibility split, readiness/approval gates, artifacts created at each stage, branch/review lifecycle, and host enforcement limits. Add tests ensuring init, update, plugin and host command bundles expose the same lifecycle.
- Depends on: BLUEPRINT-3, BLUEPRINT-4, BLUEPRINT-5, BLUEPRINT-6
- Scope (explicit files or subtrees): `README.md`, `src/lib/agents.ts`, `test/**`, relevant templates and plugin skills
- Acceptance checks (observable and verifiable): Documentation shows existing-app onboarding from survey to target blueprint to roadmap to task branches and human merge; no stale wording implies discovery alone is the complete spec or that plan invents product behavior; tests detect missing or divergent specify wiring and ensure other existing user-selected host behaviors remain intact.
- Risk and rollback: Documentation and shipped integrations may get out of sync. Derive host artifacts from shared templates and cover generated outputs with tests.
- Affected knowledge/components: Public product documentation, command wiring, regression coverage.
- Suggested agent capability: mid
- Fit score (0–100) and rationale: 90 — integration and documentation are straightforward once the canonical workflows are settled.
- Out of scope: Publishing a new CLI/plugin release or changing remote repositories.
- User decisions: None.

## Dependency graph

```text
BLUEPRINT-1 → BLUEPRINT-2 → BLUEPRINT-3 → BLUEPRINT-4
                  │             │              │
                  └─────────────┴──────────────┴→ BLUEPRINT-5 → BLUEPRINT-6
                                                └───────────────┬→ BLUEPRINT-7
BLUEPRINT-3 ────────────────────────────────────────────────────┤
BLUEPRINT-4 ────────────────────────────────────────────────────┘
```

## Verification and human review points

- `npm run typecheck` passed.
- `npm test` passed: 10 tests across 2 files, including scaffolded hierarchy/readiness files, eight installed skills, Claude/Cursor command wrappers, discovery/specify/plan separation, generated approval rules, and portable/Claude plugin specify-skill parity.
- `npm run build` passed.
- `git diff --check` passed.
- Checked local Markdown links in the template and runtime specification records; all resolve.
- Prompt-level workflows and actual host model behavior were not exercised end-to-end. Branch creation, remote PR checks, branch protection, and merge approval depend on each user's Git host and repository settings and were not exercised here.
- Present the full code and documentation diff for human review. Do not merge, deploy, or publish.

## Resume strategy

During execution, work one BLUEPRINT task at a time and update `specx/work/CHECKPOINT.md` with plan revision, task ID, branch, changed artifacts, verification evidence, blockers, and the next dependency-ready task. Pause if implementation requires a product policy decision or scope change. Resume by verifying the Git branch and working tree against the checkpoint and this exact approved plan revision.

## Approval record

- Decision: approved; implementation complete, human review required
- User confirmation reference/date: User explicitly approved revision 1 in chat, 2026-10-24.
- Approved revision/hash: Revision 1, approved 2026-10-24.
- Scope approved: BLUEPRINT-1 through BLUEPRINT-7 as written in revision 1.
