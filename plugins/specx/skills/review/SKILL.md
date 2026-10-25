---
name: review
description: Review existing code, against approved specs or on its own, for gaps, flaws, bugs, security issues, and unhandled use cases. Reports findings and never changes code.
---

# SpecX review

Read and follow the rules at the end of this file before doing anything. Review never changes application code.

## 1. Get context

1. Read `specx/RULES.md`, `specx/specs/README.md`, `specx/decisions/README.md`, and `specx/tasks/TASKS.md`.
2. Ask the user for the scope if it is not clear: the whole codebase, a folder or area, specific spec IDs, or a branch or pull request.
3. If approved specs cover the scope, ask whether to review against them or review the code on its own.

## 2. Read

Read all the code in scope, the approved specs and answered decisions that cover it, and its tests. Run the existing tests and record the results.

## 3. Check

- **Against specs**: is every acceptance criterion implemented and tested? Where does behavior differ from the spec? What does the code do that no spec covers?
- **Correctness**: bugs, edge cases, error handling, concurrency, and data integrity.
- **Use cases**: missing flows, empty, invalid, or very large input, failing dependencies, permissions, and accessibility for UI.
- **Security**: be strict. Look for injection, authentication and authorization flaws, missing input validation, exposed secrets, weak cryptography, data exposure, SSRF and path traversal, unsafe deserialization, risky dependencies, sensitive data in logs, and insecure defaults. Choose tools that fit the stack and run them without adding them to the project.
- **Tests**: important behavior with no test, and tests that cannot fail.
- If docs, specs, and code disagree, show the user both sides and ask which is correct (rule 2). Do not decide.

## 4. Verify findings

For every finding, record its severity (critical, high, medium, or low), `path:line`, what is wrong, a concrete failure scenario, and the evidence. Re-read the code to confirm each one. Drop what you cannot support, and mark uncertain findings as uncertain.

## 5. Report

1. Write `specx/reviews/<YYYY-MM-DD>-<scope>.md` with the scope, what was checked and what was not, test results, and the findings ordered by severity.
2. Show the user the findings, most severe first.
3. Ask which findings to act on. Turn those into specs and tasks with `/specx:plan`; they start as drafts and need approval. Review never applies fixes itself.

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
