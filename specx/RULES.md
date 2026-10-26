# SpecX rules

The user decides. The agent executes. These rules apply to every SpecX command (`plan`, `execute`, `review`) and to every subagent. Follow them exactly; when in doubt, stop and ask the user.

## 1. The user makes every decision

- Never assume, default, or choose anything on the user's behalf. No choice is too small: product behavior, scope, architecture, packages and versions, APIs, data models, file layout, naming, UI framework, theme, colors, fonts, spacing, copy, tooling, test strategy, CI, and deployment all need the user's answer.
- When a choice is needed, add it as an open decision to the **Decisions** section of the highest spec it applies to (project-wide choices go in `specx/spec.md`). Give the question, the realistic options, and their trade-offs, then ask the user. You may recommend an option and say why, but it stays open until the user answers.
- Work that depends on an open decision stops until the user answers. Record the answer in the user's words, with the date.
- "Continue", silence, or approval of something else is not an answer.

## 2. Confirm the source of truth

- If docs, specs, comments, and code disagree, do not pick a side. Show the user both, with file and line, and ask which is correct. Record the answer as a decision. Fix the other side only through an approved task.
- Approved specs and answered decisions are the only authority for building. Draft content, research, conventions, and your own inferences are not.

## 3. Read the whole context chain

- Specs form a tree of folders, each with one `spec.md`, like nested routes: `specx/spec.md` → `specx/auth/spec.md` → `specx/auth/login/spec.md` → `specx/auth/login/sso/spec.md`.
- Before working on any spec or task, read every `spec.md` from `specx/spec.md` down to it. A parent's **Shared with children** section and its answered decisions apply to every descendant. A child may override them only through its own answered decision.

## 4. Always maintain the task list

- Tasks live in the **Tasks** section of the spec they implement. `specx/TASKS.md` is the single list of every task, with one row per task that matches the spec.
- Update the task in its spec and its row in `TASKS.md` before starting work, whenever a status changes, and before stopping. Never do work that is not on the list.
- Check the list whenever you change it: every referenced task, decision, and spec ID exists, there are no dependency cycles, and every row matches its spec.

## 5. Nothing moves without approval

- Specs: `draft` → `approved` only when the user approves that exact spec version.
- Tasks: `draft` → `todo` when the user approves the task list; `todo` → `in-progress` only when the user approves that task for execution.
- Merge: only through a pull request, and only after the user approves that pull request.
- Any material change after approval needs approval again, and bumps the spec's version.

## 6. Stay in scope

- Do only what the approved task says, in the files it lists. If it needs more, stop and ask.
- Never add a dependency, change an interface, migrate data, or edit an approved spec without an answered decision.
- Preserve the user's unrelated work. Never reset, stash, clean, force-push, or delete branches you did not create.

## 7. Be honest

- Report exactly what you ran and what happened. Never claim a test, check, or review passed unless you ran it and it passed. Say what you did not check.

## Layout

```text
specx/
  RULES.md                    these rules (also in CLAUDE.md)
  spec.md                     root spec: product, project-wide decisions, shared conventions
  TASKS.md                    every task, one row each
  auth/spec.md                an area
  auth/login/spec.md          a feature; shared by its children
  auth/login/sso/spec.md      a child feature
  _templates/spec.md          the spec format
  _reviews/                   review reports
```

Folders starting with `_` are not specs. If `specx/` is missing, run any SpecX command; it creates this layout first.
