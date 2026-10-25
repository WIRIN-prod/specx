# specX

**Plan, execute, and review software with AI agents. You decide; agents execute.**

SpecX has three commands:

| Command | What it does |
|---|---|
| `/specx:plan` | Writes specs for existing code or new work as an area/component/feature hierarchy, asks you every decision, and breaks approved specs into small, dependency-linked tasks that smaller models and parallel subagents can pick up. |
| `/specx:execute` | Asks you to approve a batch of ready tasks. It then builds each one in its own git worktree with its own subagent, runs the tests and a strict security review, and opens a pull request. It merges only after you approve. |
| `/specx:review` | Reviews existing code, against approved specs or on its own, for gaps, flaws, bugs, security issues, and unhandled use cases. Findings go back to `plan`. |

## Rules every agent follows

SpecX writes the same rules into `specx/RULES.md`, `AGENTS.md`, `CLAUDE.md`, the Cursor rule, the Copilot instructions, and every skill:

1. **You make every decision.** Agents never assume or default anything, from architecture and packages down to theme and fonts. Each choice becomes a decision file with options, and the work that depends on it waits for your answer.
2. **You confirm the source of truth.** If docs and code disagree, the agent shows you both and asks which is correct.
3. **There is always a task list.** `specx/tasks/TASKS.md` lists every piece of work and is updated whenever anything changes.
4. **Nothing moves without approval.** That covers specs, tasks, starting execution, and merging.
5. **Agents stay in scope.** They change only the files a task lists.
6. **Reports are honest.** Agents never claim a check passed unless it ran and passed.

## Install

```bash
npm install -g @specx/cli
cd your-app
specx init
```

`specx init` asks which agents you use (`codex`, `claude`, `cursor`, `copilot`; or pass `--agents claude,cursor`) and installs the rules and the three skills for each.

As a Claude Code plugin:

```text
/plugin marketplace add WIRIN-prod/specx
/plugin install specx@specx-marketplace
```

## Layout

```text
specx/
  RULES.md                         rules for every agent
  Home.md                          entry point
  specs/<area>/<component>/<feature>.md
  decisions/DEC-###-<slug>.md      every decision, open or answered
  tasks/TASKS.md                   the task list
  tasks/T-###.md                   one file per task
  reviews/<date>-<scope>.md        review reports
```

Specs, decisions, and tasks use YAML frontmatter, so related work can be traced and checked. A task lists the specs it implements, the tasks it `depends_on`, the decisions it needs, and the files it may change.

- **Ready**: a task is ready when it is approved (`todo`), all its dependencies are `done`, and all its decisions are answered.
- **Parallel**: ready tasks that share no files can run at the same time, one subagent each.
- **Blocked**: if a task hits a new decision, that task and every related task (its dependents, its unfinished dependencies, and tasks sharing its specs or decisions) pause. Unrelated tasks continue.

## CLI

| Command | Purpose |
|---|---|
| `specx init [path] [--agents list]` | Create `specx/` and install rules and skills for the selected agents. Existing records are kept. |
| `specx update` | Refresh rules and skills for the agents saved in `.specx/specx.yaml`. |
| `specx status` | Count specs, decisions, and tasks by status, and list ready tasks. |
| `specx tasks [--write] [--related ID]` | Validate the task graph (unknown references, cycles), show ready tasks grouped for parallel runs, regenerate `TASKS.md`, or list the tasks that must pause with a given task. |
| `specx config [--edit]` | Show or edit `.specx/specx.yaml`, including `git.main_branch` and `git.worktree_root`, which `execute` asks you for once. |

## Development

Skill sources are `templates/skills/<name>/SKILL.md` and the rules are `templates/RULES.md`. The host skill folders and `plugins/specx/skills/` are generated from them, so edit the templates, then run:

```bash
npm install
npm run typecheck
npm run build      # also regenerates plugins/specx/skills
npm test
```

MIT License. See [LICENSE](LICENSE).
