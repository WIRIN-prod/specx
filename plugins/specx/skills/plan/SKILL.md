---
name: plan
description: Turn an existing codebase or a new feature request into a tree of standard, user-approved specs (one spec.md per folder, parents shared by children like nested routes) with decisions and dependency-linked tasks inside each spec, ready for smaller models and parallel subagents. Every choice is asked of the user.
---

# SpecX plan

Follow the rules in `specx/RULES.md` for everything below (step 0). Plan never writes application code.

## 0. Set up and read the rules

1. If `specx/RULES.md` does not exist, this project is not set up yet. Tell the user, then create the following without overwriting any existing file. Setup needs no decisions from the user.
   - Copy the folder `${CLAUDE_PLUGIN_ROOT}/templates/specx/` to `specx/`. In `specx/spec.md`, replace `{{PROJECT_NAME}}` with the project folder name and `{{DATE}}` with today's date.
   - Copy `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md` to `specx/RULES.md`.
   - Put the same rules in the project's `CLAUDE.md` between a `<!-- specx:rules:begin -->` line and a `<!-- specx:rules:end -->` line. Create the file if it is missing, or replace what is between the markers if they exist.
2. If `specx/RULES.md` differs from `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md`, tell the user the rules have changed and ask before replacing `specx/RULES.md` and the `CLAUDE.md` section. When replaced, also add any missing scaffold files (`spec.md`, `TASKS.md`, `_templates/spec.md`, `_reviews/`) without overwriting existing ones.
3. Read `specx/RULES.md` completely and follow it for everything below.
4. If `specx/` contains an older layout (`specs/`, `decisions/`, `tasks/`, `reviews/`, `Home.md`, `knowledge/`, `proposals/`, `plans/`, `specifications/`, `work/`), tell the user SpecX no longer reads it, and offer to convert it (step 8). Never delete it without the user's approval.

## 1. Get context

1. Read `specx/spec.md`, `specx/TASKS.md`, `specx/_templates/spec.md`, and every existing `spec.md` in the area you are planning, with its full context chain.
2. Ask the user what to plan if it is not already clear:
   - **Existing code**: write specs for what the codebase does today.
   - **New work**: write specs for a new product, feature, or change.
   - **Both**: spec the current code, then the change on top of it.
3. Confirm the scope: whole repository, one area, or one feature.

## 2. Gather facts

- **Existing code**: read manifests, entry points, modules, routes and APIs, data models and migrations, config, tests, CI, integrations, and security-sensitive code. Every claim about current behavior cites `path:line`. List what you did not inspect.
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

## 4. Collect decisions

- Every choice becomes an open decision in the **Decisions** section of the highest spec it applies to: stack, packages and versions, architecture, data storage, auth, API style, error handling, testing, folder structure, naming, UI framework, theme, colors, fonts, copy, accessibility, deployment, and anything else not already answered. Project-wide choices go in `specx/spec.md`.
- Ask the user in small, grouped batches. Give each question realistic options and trade-offs. You may recommend one, but never decide.
- Record each answer in the user's words with the date, and set the decision to `answered`.

## 5. Write the specs

Write each `spec.md` in the format of `specx/_templates/spec.md`. Keep every section, in order, and write "None" where a section does not apply.

- **Requirements** are numbered (`<SPEC>-R#`) and written in EARS: one testable SHALL statement each (`WHEN <trigger>, THE SYSTEM SHALL <response>`, `IF <condition>, THEN THE SYSTEM SHALL …`, and so on), with the source (user and date, or `path:line`).
- **Acceptance criteria** are numbered (`<SPEC>-AC#`), written as Given/When/Then, and name the requirements they prove. Every requirement has at least one.
- **Current state** holds existing behavior with evidence. Existing behavior becomes a requirement only if the user says so.
- **Design** covers interfaces, data, flows and error handling, and security and privacy.
- Never repeat what a parent already says. Point to it through the context chain.
- Show the user each spec and ask for approval. Set `status: approved` only on specs the user approved, and record the version, date, and approver in the change log.

## 6. Write the tasks

Write tasks in the **Tasks** section of the spec they implement, and only for approved specs. Each task must be small enough for a smaller model to finish with only its spec and context chain:

- **One concern**, reviewable as one pull request, usually a handful of files.
- **Self-contained**: exact files, steps, the requirements and acceptance criteria it covers, and verification commands. Leave nothing to "figure out". Tests are part of the task that changes the behavior.
- **Parent**: every task names the task in the parent spec it rolls up to. A parent spec holds the tasks that build what its **Shared with children** section describes, which child tasks depend on, and the task that integrates its children. A parent task is done only when all its child tasks and its own steps are done.
- **Depends on** lists only real dependencies: the task needs code or an interface from another task. Tasks without a dependency between them must not share files; if they would, add a dependency so they run in order. This is what lets parallel subagents work safely.
- **Decisions** lists every decision the task relies on. A task with an open decision is not ready.
- **Model** suggests `small`, `mid`, or `frontier`, with the reason.
- Task IDs are `<SPEC>-T#`.

Write each task as `draft`, add its row to `specx/TASKS.md`, and check there are no unknown IDs and no dependency cycles. Show the user the task list, which tasks can run in parallel, and how child tasks roll up to parent tasks. Set `todo` only on the tasks the user approved.

## 7. Finish

Report the approved specs, open decisions (with their questions), and tasks ready to build. The next step is `/specx:execute`.

## 8. Convert an older layout (only when the user asks)

Map the old content into the tree: specs into `spec.md` files, decisions into the **Decisions** section of the spec they belong to (project-wide ones into `specx/spec.md`), and tasks into the **Tasks** section of their spec and `specx/TASKS.md`. Keep every decision's answer and date exactly as recorded. Show the user the proposed tree and the result, and delete the old files only after the user approves.
