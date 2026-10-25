---
name: specx-plan
description: Turn an existing codebase or a new feature request into user-approved, hierarchical specs and a dependency-linked task list that smaller models and parallel subagents can build from. Every choice is asked of the user.
---

# SpecX plan

Read and follow the rules at the end of this file before doing anything. Plan never writes application code.

## 1. Get context

1. Read `specx/RULES.md`, `specx/Home.md`, `specx/specs/README.md`, `specx/decisions/README.md`, and `specx/tasks/TASKS.md`. If `specx/` is missing, run `specx init`, or create the layout from the rules and the formats below.
2. Ask the user what to plan if it is not already clear:
   - **Existing code**: write specs for what the codebase does today.
   - **New work**: write specs for a new product, feature, or change.
   - **Both**: spec the current code, then the change on top of it.
3. Confirm the scope: whole repository, one area, or one feature.

## 2. Gather facts

- **Existing code**: read manifests, entry points, modules, routes and APIs, data models and migrations, config, tests, CI, integrations, and security-sensitive code. Every claim about current behavior cites `path:line`. List what you did not inspect.
- **New work**: interview the user about goals, users, flows, edge cases, failure behavior, non-goals, and constraints. Ask in small batches.
- If docs and code disagree, show both and ask the user which is correct (rule 2).

## 3. Collect decisions

- Every choice becomes a decision file with `status: open`: stack, packages and versions, architecture, data storage, auth, API style, error handling, testing, folder structure, naming, UI framework, theme, colors, fonts, copy, accessibility, deployment, and anything else that is not already answered.
- Ask the user in small, grouped batches. Give each question realistic options and trade-offs. You may recommend one, but never decide.
- Record each answer in the user's words with the date, and set `status: answered`. Update the table in `specx/decisions/README.md`.

## 4. Write specs

- Put specs in a hierarchy: `specx/specs/<area>/<component>/<feature>.md`. Areas and components get a `README.md` overview. IDs mirror the path in upper case, joined with dots: `IAM`, `IAM.AUTH`, `IAM.AUTH.LOGIN`. The taxonomy and names are decisions too; ask the user to confirm them.
- Every spec links its `parent`, its `depends_on` specs, and the `decisions` it relies on, so related work can be found from any spec.
- Keep current behavior (with evidence) separate from target behavior (from the user). Current behavior becomes the target only if the user says so.
- Acceptance criteria are concrete and testable.
- Update the spec tree in `specx/specs/README.md`.
- Show the user the specs and ask for approval. Set `status: approved` only on the specs the user approved, and record the date in each spec's log.

## 5. Break approved specs into tasks

Create tasks only from approved specs. Each task must be small enough for a smaller model to finish without guessing:

- **One concern** that is reviewable as a single pull request, usually a handful of files.
- **Self-contained**: the task file plus its linked specs and decisions is all an agent needs. Give exact files, steps, acceptance criteria, and verification commands. Leave nothing to "figure out".
- **`depends_on`** lists only real dependencies, meaning the task needs code or an interface from another task. Tasks without a dependency between them must not touch the same files; if they would, add a dependency so they run in order. This is what lets parallel subagents work safely.
- **`decisions`** lists every decision the task relies on. A task with an open decision is not ready.
- **`files`** lists the exact files or folders the task may change.
- **`model`** suggests `small`, `mid`, or `frontier`, with the reason in the body.
- Tests are part of the task that changes the behavior, not a separate later task.
- Task IDs are sequential: `T-001`, `T-002`, and so on.

Write each task with `status: draft`, regenerate `TASKS.md` (run `specx tasks --write` when available), and check there are no unknown dependencies or cycles. Show the user the task list and which tasks can run in parallel. Set `status: todo` only on the tasks the user approved.

## 6. Finish

Report the approved specs, open decisions (with their questions), and tasks ready to build. The next step is `/specx:execute`.

## File formats

Spec (`specx/specs/<area>/<component>/<feature>.md`):

```markdown
---
id: IAM.AUTH.LOGIN
title: Login
status: draft            # draft | approved | superseded
parent: IAM.AUTH
depends_on: []           # other spec IDs
decisions: []            # DEC-### IDs
---

## Purpose
## Current behavior     <!-- with path:line evidence, or "none" for new work -->
## Target behavior      <!-- from the user -->
## Flows and edge cases
## Interfaces and data
## Acceptance criteria
## Open questions
## Log                  <!-- approvals and changes, with dates -->
```

Decision (`specx/decisions/DEC-###-<slug>.md`):

```markdown
---
id: DEC-001
title: Body font
status: open             # open | answered | superseded
specs: []                # spec IDs affected
---

## Question
## Options              <!-- each with trade-offs; recommendation marked as such -->
## Answer               <!-- the user's words and the date -->
```

Task (`specx/tasks/T-###.md`):

```markdown
---
id: T-001
title: Add login form
status: draft            # draft | todo | in-progress | blocked | in-review | done | cancelled
specs: [IAM.AUTH.LOGIN]
depends_on: []           # task IDs
decisions: [DEC-001]
files: [src/auth/login/]
model: small             # small | mid | frontier
branch:
worktree:
pr:
---

## Goal
## Steps
## Acceptance criteria
## Verification         <!-- exact commands and expected results -->
## Out of scope
## Log                  <!-- approvals, status changes, check results, with dates -->
```

## Rules

The user decides. The agent executes. These rules apply to every SpecX command (`plan`, `execute`, `review`) and to every subagent. Follow them exactly; when in doubt, stop and ask the user.

## 1. The user makes every decision

- Never assume, default, or choose anything on the user's behalf. No choice is too small: product behavior, scope, architecture, packages and versions, APIs, data models, file layout, naming, UI framework, theme, colors, fonts, spacing, copy, tooling, test strategy, CI, and deployment all need the user's answer.
- When a choice is needed, write it as an open decision in `specx/decisions/` with the question, the realistic options, and their trade-offs, then ask the user. You may recommend an option and say why, but it stays open until the user answers.
- Work that depends on an open decision stops until the user answers. Record the answer in the user's words, with the date.
- "Continue", silence, or approval of something else is not an answer.

## 2. Confirm the source of truth

- If docs, specs, comments, and code disagree, do not pick a side. Show the user both, with file and line, and ask which is correct. Record the answer as a decision. Fix the other side only through an approved task.
- Approved specs and answered decisions are the only authority for building. Draft content, research, conventions, and your own inferences are not.

## 3. Always maintain the task list

- `specx/tasks/TASKS.md` is the single task list. Every piece of work is a task file in `specx/tasks/`, and its row in `TASKS.md` matches that file.
- Update the task file and `TASKS.md` before starting work, whenever a status changes, and before stopping. Never do work that is not on the list.
- When the `specx` CLI is available, run `specx tasks --write` to validate the list and regenerate `TASKS.md`.

## 4. Nothing moves without approval

- Specs: `draft` → `approved` only when the user approves that exact spec.
- Tasks: `draft` → `todo` when the user approves the task list; `todo` → `in-progress` only when the user approves that task for execution.
- Merge: only through a pull request, and only after the user approves that pull request.
- Any material change after approval needs approval again.

## 5. Stay in scope

- Do only what the approved task says, in the files it lists. If it needs more, stop and ask.
- Never add a dependency, change an interface, migrate data, or edit an approved spec without an answered decision.
- Preserve the user's unrelated work. Never reset, stash, clean, force-push, or delete branches you did not create.

## 6. Be honest

- Report exactly what you ran and what happened. Never claim a test, check, or review passed unless you ran it and it passed. Say what you did not check.

## Layout

```text
specx/
  RULES.md       these rules (the SpecX section is refreshed by `specx update`)
  Home.md        entry point
  specs/         hierarchy: <area>/<component>/<feature>.md
  decisions/     one file per decision, open or answered
  tasks/         TASKS.md plus one file per task
  reviews/       review reports
```

If `specx/` is missing, run `specx init`. If the CLI is unavailable, create this layout using the file formats in the `plan` skill.
