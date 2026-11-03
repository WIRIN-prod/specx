---
name: execute
description: Build one approved milestone or item at a time, showing a short preview first and a working demo after, with each task in its own git worktree and subagent, independent review, and a pull request that is merged only after the user approves it.
---

# SpecX execute

Follow the rules in `specx/RULES.md` for everything below (step 0).

## 0. Set up and read the rules

1. If `specx/RULES.md` does not exist, this project is not set up yet. Tell the user, then create the following without overwriting any existing file. Setup needs no decisions from the user.
   - Copy the folder `${CLAUDE_PLUGIN_ROOT}/templates/specx/` to `specx/`. In `specx/spec.md`, replace `{{PROJECT_NAME}}` with the project folder name and `{{DATE}}` with today's date.
   - Copy `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md` to `specx/RULES.md`.
   - Put the same rules in the project's `CLAUDE.md` and `AGENTS.md` between `<!-- specx:rules:begin -->` and `<!-- specx:rules:end -->` markers. Create either file if missing, or replace only the content between existing markers.
2. If `specx/RULES.md` differs from `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md`, tell the user the rules have changed and ask before replacing `specx/RULES.md` and the managed sections in `CLAUDE.md` and `AGENTS.md`. When replaced, also add any missing scaffold files (`spec.md`, `TASKS.md`, `STATUS.md`, `_templates/spec.md`, `_reviews/`) without overwriting existing ones.
3. Read `specx/RULES.md` completely and follow it for everything below.
4. If `specx/` still uses an older layout (`specs/`, `decisions/`, `tasks/`, `Home.md`, or older), stop and ask the user to convert it with `/specx:plan` first.

## 1. Get context

1. Read `specx/TASKS.md`, `specx/STATUS.md`, and the **Tasks** and **Decisions** sections of every spec `TASKS.md` links to.
2. Check the task list: every referenced task, milestone, decision, and spec ID exists, there are no dependency cycles, and each `TASKS.md` row matches its spec. Resolve any problem with the user before building anything.
3. Work out the board:
   - **Ready**: status `todo`, its spec is `approved`, every `Depends on` task is `done`, and every decision it lists is `answered`.
   - **Next up**: the earliest unfinished milestone in the current phase, or a ready Ongoing item.
   - **Parallel**: two ready tasks can run at the same time only if neither depends on the other, directly or through other tasks, and their `Files` do not overlap. Files overlap when they are the same path or one is inside the other. A task with no `Files` is not ready; send it back to `/specx:plan`.
   - **Related** to a task: tasks that depend on it directly or indirectly, tasks it depends on that are not yet `done`, its parent and child tasks, and unfinished tasks in the same spec or sharing one of its decisions.

## 2. Git setup

These are project-wide decisions in `specx/spec.md`. If they are not answered yet, ask the user once and record them there as decisions:

- **Main branch**: the branch pull requests target. Ask; do not guess, even if `main` exists.
- **Worktree location**: worktrees go next to the repository by default, as `<parent folder>/<repo>-<task-id>` and `<parent folder>/<repo>-delivery-<id>`. Ask whether the user wants a different location.
- **Recording progress**: how updates to `specx/` (task statuses, logs, `STATUS.md`) are committed, for example with each pull request or separately by the user.
- **Pull request size after the first phase**: the first phase is always one pull request, and each Ongoing item gets its own. For later phases the user chooses one of:
  1. One per phase: fewer reviews, but each is large.
  2. One per milestone: smaller reviews that merge sooner, but more approvals.
  3. Mixed by phase: the user picks 1 or 2 for each phase when it starts.

  You may recommend per-milestone pull requests once working code exists, because later phases change that code. The user decides.

A **delivery** is the work one pull request carries, following that decision. Merging into the main branch happens only through pull requests. If the repository has no remote, or `gh` is not installed and signed in, stop and tell the user.

## 3. Preview and approve

Before building a milestone or Ongoing item, record the delivery branch's current commit in each task's log as its start point, then show a preview of about five lines:

- What you will build, in plain words.
- What the user will be able to do when it is finished.
- The tasks, and which run in parallel.
- Anything risky, or that you expect to log as an assumption.

The user can approve, redirect, or reorder before any code exists. A redirect that changes a spec goes through `/specx:plan`. Only work the user explicitly approves proceeds. Record the approval (date and the user's words) in each task's log, and update `specx/STATUS.md` with what is starting.

## 4. One worktree and one subagent per task

You, the main session, own `specx/`: you update task statuses, logs, assumptions, `TASKS.md`, and `STATUS.md`. Subagents never edit `specx/`.

1. If this delivery has no branch yet, create it from the latest main branch: `git fetch`, then `git worktree add <worktree location>/<repo>-delivery-<id> -b specx/delivery-<id> origin/<main branch>` (or the local branch when there is no remote-tracking branch). `<id>` is the phase, milestone, or task ID the pull request covers.

For each approved task whose dependencies are done:

2. Create its worktree from the delivery branch: `git worktree add <worktree location>/<repo>-<task-id> -b specx/<task-id> specx/delivery-<id>`.
3. Write the task's `Files` to the worktree's scope file, one path per line, at `$(git -C <worktree> rev-parse --git-dir)/specx-scope`. The SpecX guard hook denies edits outside it.
4. Set the task to `in-progress` with its branch and worktree, and update `TASKS.md` and `STATUS.md`.
5. Start one subagent for the task. Give it the task, its spec, every ancestor spec in its context chain, `specx/RULES.md`, and the worktree path. That is its whole context. Tell it to:
   - work only inside its worktree and only on the task's `Files`, and commit its work on the task branch before reporting;
   - follow the task's steps and the spec exactly (behavior, contracts, data, rules, errors, versions), choosing the code structure by the project's conventions, meet the requirements and acceptance criteria it covers, and write the tests with the code;
   - choose implementation details itself and report each one as an assumption with its reason, as rule 1 defines them;
   - stop and report instead of choosing whenever a big or small choice is unclear, missing, or outside the task;
   - use only the behavior-change test method recorded in the approved spec. For test-first/TDD, write and run the focused failing test before changing behavior; for a bug fix, first add a regression test that reproduces it. If the method is missing or unclear, block the task and ask the user through `/specx:plan` rather than choosing.
6. You decide how many subagents run at once from the dependency graph. Run tasks that have no dependency between them and no shared files at the same time. If the host has no subagents, build the tasks one at a time.
7. When a subagent finishes, record its assumptions in the task's **Assumptions** and in `STATUS.md`. Run the checks in step 6.1 in its worktree. Confirm `git log specx/delivery-<id>..specx/<task-id>` shows its commits and `git status` in the worktree is clean; if not, stop and find out why. Then, from the delivery worktree, merge its branch with `git merge --no-ff`, remove the task worktree, and delete the task branch. A later task in the milestone starts from the updated delivery branch.

For a `spike`, there is no delivery branch, review, demo, or pull request. Create its worktree with `git worktree add <worktree location>/<repo>-<task-id> -b specx/<task-id> origin/<main branch>`. When the question is answered, record the answer in the task log, then run `git worktree remove --force <worktree>` and `git branch -D specx/<task-id>`, and set the task to `done`. Spike code is never merged.

## 5. When a task needs a decision

- Add the decision as `open` to the spec it belongs to, set the task to `blocked`, and ask the user. A spec gap that is a big or small choice is handled the same way: the answer goes into the spec, so the next implementer does not hit it again.
- Stop only that task, unless other tasks are related to it (step 1). Stop all related tasks too. Unrelated tasks continue.
- When the user answers, record it and resume. If the answer materially changes a task or spec, show the change and get it approved again.

## 6. Verify the milestone or item

1. Inside the task's worktree, follow the approved testing method, then run the task's verification commands and the project's tests, linting, type checks, and build. Every required check must pass.
2. When a check fails, keep its output and diagnose in order: reproduce the failure, localize it to the task, spec, or environment, make the smallest in-scope correction, then rerun the focused check and affected required gates. For a behavior regression, add a reproducing test under the approved method. Never skip, disable, delete, or weaken a check or assertion to get a pass.
3. If the failure reveals a spec conflict, missing decision, or work outside scope, stop the task and related tasks as specified in step 5. Record the evidence and ask the user; do not improvise a fix.
4. When all of a milestone's or item's tasks are merged into the delivery branch, rerun the required checks there and check every acceptance criterion it covers, with evidence.
5. If the code's behavior now differs from the spec in a way the user approved, update the spec on the delivery branch, in the same pull request, with its version bump and change-log row.
6. Verify that no approved quality gate was weakened in the diff. Record what ran and the results in each task's log.

## 7. Independent review

This applies to every milestone and Ongoing item except a spike. Start a new subagent that did not build this work, and have it follow the **Milestone review** in `${CLAUDE_PLUGIN_ROOT}/skills/review/SKILL.md`. Give it `specx/RULES.md`, the delivery worktree, the diff range from the start point recorded in step 3, the specs in scope, and the logged assumptions, and nothing about how the build went. It reports findings and does not change code. Save its report to `specx/_reviews/` and link it from `STATUS.md`.

A critical or high finding blocks the demo until it is fixed within scope, or the user decides what to do. A fix is a new or reopened task with its own worktree and scope file (step 4). Rerun step 6.4 onward and step 7 after it. If the host has no subagents, say so in the demo: the review was not independent.

## 8. Demo the milestone or item

Stop and show the user:

- **Try it:** the exact commands to run it, and what to do once it is running. You must have run these yourself first.
- **What changed:** a plain summary, and which "done when" line it meets.
- **Evidence:** the checks you ran and their results, the independent review's findings, and anything not checked.
- **Assumptions:** every one logged in this work, with its reason.
- **Your options:** continue, change something, or undo it.

Record the user's words in the task logs. A change becomes a new task through `/specx:plan`, or an edit to a task in this milestone when the spec still holds. An overturned assumption becomes a change the same way. Undo means running `git revert -m 1` on this work's task merges on the delivery branch, newest first, after the user approves exactly what is removed. Set those tasks to `cancelled`, and plan any replacement as new tasks. Update `STATUS.md`.

If the delivery still has milestones left, go back to step 3 for the next one.

## 9. Open the pull request

1. Commit anything left on the delivery branch with a message that names the task or milestone IDs. Push `specx/delivery-<id>`.
2. Run `gh pr create --base <main branch> --head specx/delivery-<id>`. The body states the delivery, its spec, the milestones, tasks, requirements, and acceptance criteria covered, what changed, the tests run and their results, the review results, the assumptions, and anything not checked.
3. Set the delivery's tasks to `in-review` with the PR link, and update `TASKS.md` and `STATUS.md`.
4. Show the user the pull request link.

## 10. Merge only on approval

- Wait for the user's explicit approval of that pull request. Then run `gh pr merge <pr> --merge`. Use a merge commit only: never squash or rebase, never push straight to the main branch, and never bypass branch protection.
- If the user asks for changes, make them in the delivery worktree, repeat steps 6 and 7, push, and ask again.
- After the merge: remove the delivery worktree (`git worktree remove`), delete the local branch, set the tasks to `done`, and update `TASKS.md` and `STATUS.md`. When all of a parent task's child tasks are done, tell the user the parent task can proceed.
- When a stage's last phase merges, tell the user that stage's version is reached. Tag it only if the user asks.

## 11. Finish

Report what was merged, what is in review, what is blocked (with the open questions), and what has not started. `TASKS.md` and `STATUS.md` must match the specs. The next step is `/specx:plan` for the next phase or item.
