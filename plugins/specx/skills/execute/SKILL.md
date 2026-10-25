---
name: execute
description: Build user-approved SpecX tasks, each in its own git worktree and subagent, then test, run a strict security review, and open a pull request that is merged only after the user approves it.
---

# SpecX execute

Read and follow the rules at the end of this file before doing anything.

## 1. Get context

1. Read `specx/RULES.md` and `specx/tasks/TASKS.md`. Run `specx tasks` when the CLI is available. It lists the ready tasks, the groups that can run in parallel, and any problems with the task list.
2. If the task list has problems (unknown dependencies, cycles, a row that does not match its file), resolve them with the user before building anything.

## 2. Git setup

Ask once, then record the answers under `git:` in `.specx/specx.yaml`:

- `main_branch`: ask the user which branch pull requests should target. Do not guess, even if `main` exists.
- `worktree_root`: worktrees go next to the repository by default, as `<parent folder>/<repo>-<task-id>`. Ask whether the user wants a different location.

Merging happens only through pull requests. If the repository has no remote, or `gh` is not installed and signed in, stop and tell the user.

## 3. Get approval for the batch

- A task is ready when its status is `todo`, all of its `depends_on` tasks are `done`, and all of its `decisions` are answered.
- Show the ready tasks and the groups that can run in parallel. Ask the user which tasks to build. You may also offer `todo` tasks whose dependencies are in the same batch; they wait until those dependencies are merged.
- Only tasks the user explicitly approves proceed. Record the approval (date and the user's words) in each task's log.

## 4. One worktree and one subagent per task

For each approved task whose dependencies are merged:

1. Create its worktree from the latest main branch: `git fetch`, then `git worktree add <worktree_root>/<repo>-<task-id> -b specx/<task-id> origin/<main_branch>` (or the local branch when there is no remote-tracking branch).
2. Set the task to `in-progress`, record `branch` and `worktree` in the task file, and update `TASKS.md`.
3. Start one subagent for the task. Give it the task file, its linked specs and decisions, the worktree path, and these rules. The task is its whole context. Tell it to:
   - work only inside its worktree and only on the task's `files`;
   - follow the task's steps and write the tests with the code;
   - stop and report instead of choosing whenever anything is unclear, missing, or outside the task.
4. You decide how many subagents run at once from the dependency graph. Run tasks that have no dependency between them and no shared files at the same time. A dependent task waits until its dependency is merged, then starts from the updated main branch. If the host has no subagents, build the tasks one at a time.

## 5. When a task needs a decision

- Write the decision file with `status: open`, set the task to `blocked`, and ask the user.
- Stop only that task, unless other tasks are related to it. Related means tasks that depend on it (directly or indirectly), tasks it depends on that are not yet done, and tasks that share one of its specs or decisions. Stop all related tasks too; `specx tasks --related <task-id>` lists them. Unrelated tasks continue.
- When the user answers, record it and resume. If the answer materially changes a task, show the updated task and get it approved again.

## 6. Verify

Inside the task's worktree:

1. Run the task's verification commands and the project's tests, linting, type checks, and build. Everything must pass. Fix failures within the task's scope, or stop and report.
2. Run a strict security review. Its goal is to find every security problem before merge.
   - Choose tools that fit the stack, such as dependency audits, secret scanning, and static analysis. Run them without adding them to the project; adding a dependency is a decision for the user.
   - Read the whole diff for injection, authentication and authorization flaws, missing input validation, exposed secrets, weak cryptography, data exposure, SSRF and path traversal, unsafe deserialization, risky dependencies, sensitive data in logs, and insecure defaults.
   - Treat anything uncertain as a finding. A critical or high finding blocks the pull request until it is fixed within scope or the user decides what to do.
3. Record what ran and the results in the task's log.

## 7. Open the pull request

1. Commit with a message that names the task ID. Push `specx/<task-id>`.
2. Run `gh pr create --base <main_branch> --head specx/<task-id>`. The body states the task and specs, what changed, the tests run and their results, the security review results, and anything not checked.
3. Set the task to `in-review`, record `pr`, and update `TASKS.md`.
4. Show the user the pull request link, a summary of the diff, and the test and security results.

## 8. Merge only on approval

- Wait for the user's explicit approval of that pull request. Then run `gh pr merge <pr> --merge`. Use a merge commit only: never squash or rebase, never push straight to the main branch, and never bypass branch protection.
- If the user asks for changes, make them in the same worktree, repeat step 6, push, and ask again.
- After the merge: remove the worktree (`git worktree remove`), delete the local branch, set the task to `done`, and update `TASKS.md`. Dependent tasks in the approved batch can now start (step 4).

## 9. Finish

Report what was merged, what is in review, what is blocked (with the open questions), and what has not started. `TASKS.md` must match.

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
