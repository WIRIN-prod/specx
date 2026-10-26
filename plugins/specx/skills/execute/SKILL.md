---
name: execute
description: Build user-approved SpecX tasks, each in its own git worktree and subagent, then test, run a strict security review, and open a pull request that is merged only after the user approves it.
---

# SpecX execute

Follow the rules in `specx/RULES.md` for everything below (step 0).

## 0. Set up and read the rules

1. If `specx/RULES.md` does not exist, this project is not set up yet. Tell the user, then create the following without overwriting any existing file. Setup needs no decisions from the user.
   - Copy the folder `${CLAUDE_PLUGIN_ROOT}/templates/specx/` to `specx/`. In `specx/Home.md`, replace `{{PROJECT_NAME}}` with the project folder name and `{{DATE}}` with today's date.
   - Copy `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md` to `specx/RULES.md`.
   - Put the same rules in the project's `CLAUDE.md` between a `<!-- specx:rules:begin -->` line and a `<!-- specx:rules:end -->` line. Create the file if it is missing, or replace what is between the markers if they exist.
2. If `specx/RULES.md` differs from `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md`, tell the user the rules have changed and ask before replacing `specx/RULES.md` and the `CLAUDE.md` section.
3. Read `specx/RULES.md` completely and follow it for everything below.
4. If `specx/` contains folders from an older SpecX (`knowledge/`, `proposals/`, `plans/`, `specifications/`, `work/`), tell the user that SpecX no longer reads them. Do not delete them.

## 1. Get context

1. Read `specx/tasks/TASKS.md`, every task file in `specx/tasks/`, and the decisions in `specx/decisions/`.
2. Check the task list: every task and decision ID that is referenced exists, there are no dependency cycles, and each `TASKS.md` row matches its task file. Resolve any problem with the user before building anything.
3. Work out the board:
   - **Ready**: status `todo`, every `depends_on` task is `done`, and every decision it lists is `answered`.
   - **Parallel**: two ready tasks can run at the same time only if neither depends on the other, directly or through other tasks, and their `files` do not overlap. Files overlap when they are the same path or one is inside the other. A task with no `files` overlaps everything.
   - **Related** to a task: tasks that depend on it directly or indirectly, tasks it depends on that are not yet `done`, and unfinished tasks that share one of its specs or decisions.

## 2. Git setup

Ask once, then record the answers in a `## Git settings` section of `specx/Home.md` as `main_branch:` and `worktree_root:` lines. Later runs read them from there:

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
- Stop only that task, unless other tasks are related to it. Related means tasks that depend on it (directly or indirectly), tasks it depends on that are not yet done, and tasks that share one of its specs or decisions. Stop all related tasks too. Unrelated tasks continue.
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
