---
name: plan
description: Turn the framework into a roadmap of stages, phases, and milestones that the user edits, then write build-ready specs, a defaults sheet, and tasks for the next phase only, so working code arrives early. Also adds single features, bugs, chores, and spikes to existing specs.
---

# SpecX plan

Follow the rules in `specx/RULES.md` for everything below (step 0). Plan never writes application code.

Plan is frontier-model work, one phase at a time. Everything planned must be specified well enough that an implementer does not guess behavior, contracts, data, or rules: "Data: conversations, messages, turns" is not a data model; a table of every field with its type, nullability, default, and index is. Everything not in the next phase stays one line on the roadmap until its turn. Code is cheap and the user's attention is not, so never write a spec for work that is not next.

## 0. Set up and read the rules

1. If `specx/RULES.md` does not exist, this project is not set up yet. Tell the user, then create the following without overwriting any existing file. Setup needs no decisions from the user.
   - Copy the folder `${CLAUDE_PLUGIN_ROOT}/templates/specx/` to `specx/`. In `specx/spec.md`, replace `{{PROJECT_NAME}}` with the project folder name and `{{DATE}}` with today's date.
   - Copy `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md` to `specx/RULES.md`.
   - Put the same rules in the project's `CLAUDE.md` and `AGENTS.md` between `<!-- specx:rules:begin -->` and `<!-- specx:rules:end -->` markers. Create either file if missing, or replace only the content between existing markers.
2. If `specx/RULES.md` differs from `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md`, tell the user the rules have changed and ask before replacing `specx/RULES.md` and the managed sections in `CLAUDE.md` and `AGENTS.md`. When replaced, also add any missing scaffold files (`spec.md`, `TASKS.md`, `STATUS.md`, `_templates/spec.md`, `_reviews/`) without overwriting existing ones.
3. Read `specx/RULES.md` completely and follow it for everything below.
4. If `specx/` contains an older layout (`specs/`, `decisions/`, `tasks/`, `reviews/`, `Home.md`, `knowledge/`, `proposals/`, `plans/`, `specifications/`, `work/`), tell the user SpecX no longer reads it, and offer to convert it (step 9). Never delete it without the user's approval.

## 1. Get context

1. Read `specx/spec.md`, `specx/TASKS.md`, `specx/STATUS.md`, `specx/_templates/spec.md`, and every existing `spec.md` in the area you are planning, with its full context chain.
2. If the framework is missing (root spec §1 is empty), ask the user for the idea and fill the same parts Explore writes: §1, §3, §6.1, and the expensive-to-change decisions in §9. Suggest `/specx:explore` if the idea is still vague.
3. If the outcome or intended user is unclear, restate the current understanding as intended user, outcome, success criteria, binding constraints, and non-goals. Ask the user to correct or confirm it. Skip this extra confirmation when the request is already clear.
4. Work out what is being asked:
   - **No roadmap yet:** go to step 2.
   - **Next phase:** the roadmap exists and the user wants the next phase, or names one. Go to step 3.
   - **A single item:** one feature, bug, chore, or spike. Go to step 7.

## 2. Propose the roadmap

The roadmap has four levels. Propose all of them; the user decides.

| Level | Meaning | Example |
|---|---|---|
| Stage | How mature the product is. The default stages are Core, Essentials, Production, and Ongoing. | Core |
| Phase | A feature-sized piece of work inside a stage. Each phase is one spec folder. | POC, Auth, RBAC |
| Milestone | A part of a phase the user can run and check. | POC-M1: create an order |
| Task | One piece of build work inside a milestone. | The order-creation API with its tests |

Use these default stages unless the user changes them:

- **Core:** one main user flow working end to end through the real stack, running locally, with tests. Version 0.0.1.
- **Essentials:** what real users need to try it, such as login, roles, the other main flows, and error handling. Version 0.1.0.
- **Production:** security hardening, deployment, monitoring, backups, and performance. Version 1.0.0.
- **Ongoing:** no more phases. Individual features, bugs, chores, and spikes (step 7).

Propose the phases for each stage, and milestones for the first phase. Each milestone has a goal and a "done when" line the user can check by trying it; if it cannot be tried, it is a task. Ask the user to add, remove, rename, or reorder anything, and whether to stop after a stage. The tree of folder names is part of this proposal.

For an existing codebase, use the framework's current state to mark what is already built. A mature product can start directly in Ongoing.

Record the approved roadmap in the root spec's **Children** table, one row per phase, with its stage, build order, and version. There is no separate roadmap file. Update `specx/STATUS.md`.

Specs are folders, like nested routes. Each folder has exactly one `spec.md`.

```text
specx/spec.md                          ROOT: product, project-wide decisions and conventions
specx/auth/spec.md                     AUTH: a phase
specx/auth/login/spec.md               AUTH.LOGIN: shared by every login method
specx/auth/login/sso/spec.md           AUTH.LOGIN.SSO
```

- When a phase has variants or sub-features that share something, they become child folders, and what they share goes in the parent's **Shared with children** section, written once.
- A parent's **Children** table lists every child, what it covers, and how the children relate.
- Correlation across branches of the tree (for example, PAT needs RBAC) goes in `depends_on` in the spec's frontmatter.
- The spec ID is the folder path in upper case joined with dots.

## 3. Gather facts for this phase

- **Existing code:** read only what this phase touches: its manifests, entry points, modules, routes and APIs, data models and migrations, config, tests, and security-sensitive code. Every claim in **Current state** cites `path:line` and the symbol. Record the commit you observed and list what you did not inspect. If a spec for this area already exists, update it rather than starting again.
- Record existing checks and CI behavior as current-state evidence. Do not treat a configured check as a newly approved target gate unless the user confirms it.
- **New work:** ask the user about this phase's flows, edge cases, and failure behavior, in small batches.
- If a previous phase changed what this phase assumed, say so, and update the affected spec with the user's approval.
- If docs and code disagree, show both and ask the user which is correct (rule 2).

## 4. Collect decisions

Sort every choice this phase needs (rule 1):

- **Big choices:** ask in small, grouped batches, with realistic options and trade-offs. For technology choices, check current documentation for the latest stable version and its constraints, and state them in the options. You may recommend one, but never decide. Each becomes a decision in the **Decisions** section of the highest spec it applies to, with its answer in the user's words and the date.
- **Small choices:** put them all on one defaults sheet, a table of the choice, your proposed value, and why. Ask the user to accept or edit it in one reply. Record the result as a single answered decision that contains the final table. Do not ask these one at a time.
- **Implementation details:** do not ask. Execute logs them as assumptions.

In the root spec's testing strategy, ask the user to choose the behavior-change test method (test-first/TDD, tests alongside implementation, or another method) if it is not already approved. Also capture each binding quality gate's criterion or threshold, exact check command, run point, and whether failure blocks or warns. No thresholds or failure policies are defaults; do not weaken an existing gate without approval. A project may approve no gates beyond its tests until the Production stage.

## 5. Write the phase spec

Write the phase's `spec.md` in the format of `specx/_templates/spec.md`. Keep every section in order. Write "None: <reason>" where one does not apply, "Inherited: <parent ID> §<section>" where a parent already covers it, or "Deferred: <phase ID>" where a later phase on the roadmap owns it.

- **Requirements** are numbered (`<SPEC>-R#`) and written in EARS: one testable SHALL statement each, with numbers instead of adjectives, and the source (user and date, decision ID, or `path:line`).
- **Acceptance criteria** are numbered (`<SPEC>-AC#`), written as Given/When/Then with concrete values, and name the requirements they prove and the test level. Every requirement has at least one.
- **Current state** holds existing behavior with evidence. Existing behavior becomes a requirement only if the user says so.
- **Design** is the technical plan at specification level (no files, functions, or code), covering what this phase builds: architecture with a Mermaid diagram and a component table; technology with exact versions and the deciding decision; interfaces as contracts with inputs, outputs, side effects, and an error table; entities with fields, types, nullability, defaults, constraints, indexes, and schema changes with rollback; flows; state machines; failures; security with a permission table; config values with type and default; log events and metrics; performance targets; a test plan; rollout and rollback steps.
- The testing strategy records the approved test-development method and every binding quality gate. If either is unresolved, keep the decision open and do not mark affected tasks ready.
- **Shared with children** is written at the same depth, so children can reference it instead of repeating it.
- Never repeat what a parent already says. Point to it through the context chain.

### Build-ready check

Before showing a spec to the user, check it against every item. Fix what fails, or turn it into a decision.

- [ ] Every section and §6 subsection is filled, or marked "None: <reason>", "Inherited: …", or "Deferred: <phase ID>". Nothing this phase builds is deferred.
- [ ] Every library, framework, service, and tool has an exact version and traces to an answered decision or to the code.
- [ ] Every interface states its inputs with types and rules, its output and side effects, and every error's status, code, and message.
- [ ] Every entity has every field with type, nullability, default, and indexes; every migration has a rollback.
- [ ] Every requirement is measurable and has an acceptance criterion; every criterion maps to a test level.
- [ ] No vague words remain: "appropriate", "as needed", "etc.", "handle errors", "fast", "secure", "TBD".
- [ ] It reads as a specification, not code: no file paths, function signatures, or code, except in Current state and in each task's `Files`.
- [ ] An implementer would have to choose nothing except implementation details (rule 1). If not, list the questions as open decisions.

Show the user the spec, its open decisions, and the result of this check, and ask for approval. Set `status: approved` only on specs the user approved, and record the version, date, and approver in the change log.

## 6. Write the milestones and tasks

Write the phase's milestones and tasks in the **Tasks** section of its spec, and only for approved specs. Each milestone has an ID (`<SPEC>-M#`), a goal, a "done when" line the user can try, and an ordered place in the phase. Each task must be small enough for a smaller model to finish with only its spec and context chain:

- **Type**: `feature`, `bug`, `chore`, or `spike` (step 7).
- **Milestone**: the milestone it belongs to, or `—` for an Ongoing item.
- **One concern**, usually a handful of files.
- **Vertical and self-contained**: prefer the smallest end-to-end behavior that can be independently verified across relevant components. Avoid splitting all storage, API, and UI work into horizontal layers unless the dependency graph requires it. Steps say what to build and which design subsections it implements, without prescribing code; include covered requirements and acceptance criteria, tests, and exact verification commands.
- **Files**: the paths the task may change, never empty. List folders when the exact files are not known. This stops parallel tasks colliding and is the scope the guard hook enforces, so include test paths; the implementer chooses the code structure within it.
- **Parent**: every task names the task in the parent spec it rolls up to, or `None`. A parent task is done only when all its child tasks and its own steps are done.
- **Depends on** lists only real dependencies: the task needs code or an interface from another task. Tasks without a dependency between them must not share files; if they would, add a dependency so they run in order.
- Order tasks by their actual dependency graph and expose independent slices for parallel work.
- **Decisions** lists every decision the task relies on. A task with an open decision is not ready.
- **Model** suggests `small`, `mid`, or `frontier`, with the reason.
- Task IDs are `<SPEC>-T#`.

Write each task as `draft`, add its row to `specx/TASKS.md`, and check there are no unknown IDs and no dependency cycles. Show the user the milestones, their tasks, and which can run in parallel. Set `todo` only on the tasks the user approved. Go to step 8.

## 7. Add a single item

In Ongoing, or whenever one change is requested, do not run a full planning pass. Add the item as a task in the spec it belongs to, with the record for its type:

| Type | Record in the task |
|---|---|
| `feature` | A user story ("As a <user>, I want <goal>, so that <reason>") and acceptance criteria. New behavior also adds requirements. |
| `bug` | Steps to reproduce, expected result, and actual result. Verification starts with a regression test. |
| `chore` | Why it is needed, and how we know it is done. |
| `spike` | The question and a time limit. Its code is throwaway and never merged; the answer goes in the task log. |

If a feature needs its own spec, or new big choices, use steps 3 to 6 for that item alone. A change to an approved spec follows rule 6. Show the task and ask for approval; it starts as `draft`.

## 8. Finish

Update `specx/STATUS.md`. Report the approved specs, open decisions (with their questions), and what is ready to build. The next step is `/specx:execute`. After it ships, run `/specx:plan` again for the next phase.

## 9. Convert an older layout (only when the user asks)

Map the old content into the tree: specs into `spec.md` files, decisions into the **Decisions** section of the spec they belong to (project-wide ones into `specx/spec.md`), and tasks into the **Tasks** section of their spec and `specx/TASKS.md`. Keep every decision's answer and date exactly as recorded. Show the user the proposed tree and the result, and delete the old files only after the user approves.
