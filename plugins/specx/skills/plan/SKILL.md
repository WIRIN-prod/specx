---
name: plan
description: Turn an existing codebase or a new feature request into a tree of complete, build-ready technical specs (one spec.md per folder, parents shared by children like nested routes) with architecture, interfaces, data models, decisions, and dependency-linked tasks inside each spec, so smaller models and parallel subagents can build without making choices. Every choice is asked of the user.
---

# SpecX plan

Follow the rules in `specx/RULES.md` for everything below (step 0). Plan never writes application code.

Plan is frontier-model work. Its output is a specification detailed enough that one document, with its context chain, tells an implementer everything: what the system does, the technical plan for how (architecture, technology, contracts, data, flows, rules, failures), and how it is verified. It is not code: files, functions, and code structure are left to the implementer. A small model later builds from it and must not have to assume or guess anything. Thin specs are the main way this fails: "Data: conversations, messages, turns" is not a data model; a table of every field with its type, nullability, default, and index is.

## 0. Set up and read the rules

1. If `specx/RULES.md` does not exist, this project is not set up yet. Tell the user, then create the following without overwriting any existing file. Setup needs no decisions from the user.
   - Copy the folder `${CLAUDE_PLUGIN_ROOT}/templates/specx/` to `specx/`. In `specx/spec.md`, replace `{{PROJECT_NAME}}` with the project folder name and `{{DATE}}` with today's date.
   - Copy `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md` to `specx/RULES.md`.
   - Put the same rules in the project's `CLAUDE.md` and `AGENTS.md` between `<!-- specx:rules:begin -->` and `<!-- specx:rules:end -->` markers. Create either file if missing, or replace only the content between existing markers.
2. If `specx/RULES.md` differs from `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md`, tell the user the rules have changed and ask before replacing `specx/RULES.md` and the managed sections in `CLAUDE.md` and `AGENTS.md`. When replaced, also add any missing scaffold files (`spec.md`, `TASKS.md`, `_templates/spec.md`, `_reviews/`) without overwriting existing ones.
3. Read `specx/RULES.md` completely and follow it for everything below.
4. If `specx/` contains an older layout (`specs/`, `decisions/`, `tasks/`, `reviews/`, `Home.md`, `knowledge/`, `proposals/`, `plans/`, `specifications/`, `work/`), tell the user SpecX no longer reads it, and offer to convert it (step 8). Never delete it without the user's approval.

## 1. Get context

1. Read `specx/spec.md`, `specx/TASKS.md`, `specx/_templates/spec.md`, and every existing `spec.md` in the area you are planning, with its full context chain.
2. Ask the user what to plan if it is not already clear:
   - **Existing code**: write specs for what the codebase does today.
   - **New work**: write specs for a new product, feature, or change.
   - **Both**: spec the current code, then the change on top of it.
3. Confirm the scope: whole repository, one area, or one feature.
4. If the outcome or intended user is unclear, restate the current understanding as intended user, outcome, success criteria, binding constraints, and non-goals. Ask the user to correct or confirm it before drafting specs. Skip this extra confirmation when the request is already clear.

## 2. Gather facts

- **Existing code**: read manifests and lockfiles, entry points, modules, routes and APIs, data models and migrations, config and environment variables, background workers, tests, CI, deployment, integrations, and security-sensitive code. Record the commit you observed. Capture the real architecture, not a summary: every component and how it connects, exact library versions, route signatures and response shapes, every table and field, every state machine, every config value. Every claim cites `path:line` and the symbol. List what you did not inspect.
- Record existing checks and CI behavior as current-state evidence. Do not treat a configured check as a newly approved target gate unless the user confirms it.
- **New work**: interview the user about goals, users, flows, edge cases, failure behavior, non-goals, and constraints. Ask in small batches.
- If docs and code disagree, show both and ask the user which is correct (rule 2).

## 3. Shape the tree

Specs are folders, like nested routes. Each folder has exactly one `spec.md`.

```text
specx/spec.md                          ROOT: product, project-wide decisions and conventions
specx/auth/spec.md                     AUTH: an area
specx/auth/login/spec.md               AUTH.LOGIN: shared by every login method
specx/auth/login/user-creds/spec.md    AUTH.LOGIN.USER-CREDS
specx/auth/login/sso/spec.md           AUTH.LOGIN.SSO
specx/auth/login/passkeys/spec.md      AUTH.LOGIN.PASSKEYS
specx/auth/pat/spec.md                 AUTH.PAT
specx/auth/rbac/spec.md                AUTH.RBAC
```

- A feature gets its own folder. When a feature has variants or sub-features that share something, they become child folders, and what they share goes in the parent's **Shared with children** section, written once.
- A parent's **Children** table lists every child, what it covers, and how the children relate: what they share and which depend on which.
- Correlation across branches of the tree (for example, PAT needs RBAC) goes in `depends_on` in the spec's frontmatter.
- The spec ID is the folder path in upper case joined with dots. The tree itself, and folder names, are decisions: propose the tree and ask the user to confirm it before writing specs.
- If the request contains multiple independently testable capabilities, propose a capability map before writing their individual specs. List a stable spec ID, responsibility, dependencies, and build order. Use the relevant parent's **Children** table to record the approved map; do not create a separate map file. Use the existing tree approval gate. A single capability does not need an extra map.

## 4. Collect decisions

- Every choice becomes an open decision in the **Decisions** section of the highest spec it applies to: stack, packages and versions, architecture, data storage, auth, API style, error handling, testing, folder structure, naming, UI framework, theme, colors, fonts, copy, accessibility, deployment, and anything else not already answered. Project-wide choices go in `specx/spec.md`.
- Ask the user in small, grouped batches. Give each question realistic options and trade-offs. For technology choices, check current documentation for the latest stable version and its constraints, and state them in the options. You may recommend one, but never decide.
- In the root spec's testing strategy, ask the user to choose the behavior-change test method (test-first/TDD, tests alongside implementation, or another method) if it is not already approved. Also capture each binding quality gate's criterion or threshold, exact check command, run point, and whether failure blocks or warns. No thresholds or failure policies are defaults; do not weaken an existing gate without approval.
- Record each answer in the user's words with the date, and set the decision to `answered`.

## 5. Write the specs

Write each `spec.md` in the format of `specx/_templates/spec.md`, including every subsection of §6 Design. Keep every section in order. Write "None: <reason>" where one does not apply, or "Inherited: <parent ID> §<section>" where a parent already covers it. The template's examples show the expected depth.

- **Requirements** are numbered (`<SPEC>-R#`) and written in EARS: one testable SHALL statement each, with numbers instead of adjectives, and the source (user and date, decision ID, or `path:line`). Cover functional, security, performance, resilience, accessibility, and UI needs.
- **Acceptance criteria** are numbered (`<SPEC>-AC#`), written as Given/When/Then with concrete values, and name the requirements they prove and the test level. Every requirement has at least one.
- **Current state** holds existing behavior with evidence. Existing behavior becomes a requirement only if the user says so.
- **Design** is the full technical plan, at specification level (no files, functions, or code):
  - architecture with a Mermaid diagram and a table of components, their responsibilities, and what they talk to;
  - every technology with exact version and the decision that chose it;
  - every interface as a contract: what it does, every input with type and rules, the output and side effects, and an error table (status, code, message), in tables and prose rather than code;
  - every entity with fields, types, nullability, defaults, constraints, indexes, and schema changes with rollback;
  - flows as sequence diagrams between components;
  - state machines;
  - a failure table (detection, what the user sees, what is logged, recovery);
  - security with a permission table;
  - every config value with type and default;
  - log events and metrics;
  - performance targets;
  - a test plan mapping every acceptance criterion to a test level;
  - rollout and rollback steps.
- The testing strategy records the user's approved test-development method and every binding quality gate. If either is unresolved, keep the relevant decisions open and do not mark affected tasks ready.
- **Shared with children** is written at the same depth, so children can reference it instead of repeating it.
- Never repeat what a parent already says. Point to it through the context chain.

### Build-ready check

Before showing a spec to the user, check it against every item. Fix what fails, or turn it into an open decision.

- [ ] Every section and §6 subsection is filled, marked "None: <reason>", or "Inherited: …".
- [ ] Every library, framework, service, and tool has an exact version and traces to an answered decision or to the code.
- [ ] Every interface states its inputs with types and rules, its output and side effects, and every error's status, code, and message.
- [ ] Every entity has every field with type, nullability, default, and indexes; every migration has a rollback.
- [ ] Every requirement is measurable and has an acceptance criterion; every criterion maps to a test level.
- [ ] No vague words remain: "appropriate", "as needed", "etc.", "handle errors", "fast", "secure", "TBD".
- [ ] It reads as a specification, not code: no file paths, function signatures, or code, except where the spec describes current state.
- [ ] A small model could build every task without assuming or guessing anything. If not, list the questions as open decisions.

Show the user each spec, its open decisions, and the result of this check, and ask for approval. Set `status: approved` only on specs the user approved, and record the version, date, and approver in the change log.

## 6. Write the tasks

Write tasks in the **Tasks** section of the spec they implement, and only for approved specs. Each task must be small enough for a smaller model to finish with only its spec and context chain:

- **One concern**, reviewable as one pull request, usually a handful of files.
- **Vertical and self-contained**: prefer the smallest end-to-end behavior that can be independently verified across relevant components. Avoid splitting all storage, API, and UI work into horizontal layers unless the dependency graph requires it. Steps say what to build and which design subsections it implements, without prescribing code; include covered requirements and acceptance criteria, tests, and exact verification commands.
- **Files**: your estimate of where the work lands, from the existing codebase. It exists so parallel tasks do not collide; the implementer chooses the exact code structure within it.
- **Parent**: every task names the task in the parent spec it rolls up to. A parent spec holds the tasks that build what its **Shared with children** section describes, which child tasks depend on, and the task that integrates its children. A parent task is done only when all its child tasks and its own steps are done.
- **Depends on** lists only real dependencies: the task needs code or an interface from another task. Tasks without a dependency between them must not share files; if they would, add a dependency so they run in order. This is what lets parallel subagents work safely.
- Order tasks by their actual dependency graph and expose independent slices for parallel work. Each task's existing verification and approval is its checkpoint; do not add group checkpoint stages.
- **Decisions** lists every decision the task relies on. A task with an open decision is not ready.
- **Model** suggests `small`, `mid`, or `frontier`, with the reason.
- Task IDs are `<SPEC>-T#`.

Write each task as `draft`, add its row to `specx/TASKS.md`, and check there are no unknown IDs and no dependency cycles. Show the user the task list, which tasks can run in parallel, and how child tasks roll up to parent tasks. Set `todo` only on the tasks the user approved.

## 7. Finish

Report the approved specs, open decisions (with their questions), and tasks ready to build. The next step is `/specx:execute`.

## 8. Convert an older layout (only when the user asks)

Map the old content into the tree: specs into `spec.md` files, decisions into the **Decisions** section of the spec they belong to (project-wide ones into `specx/spec.md`), and tasks into the **Tasks** section of their spec and `specx/TASKS.md`. Keep every decision's answer and date exactly as recorded. Show the user the proposed tree and the result, and delete the old files only after the user approves.
