# specX

**Plan, execute, and review software with AI agents. You decide; agents execute.** SpecX is a Claude Code plugin with three commands:

| Command | What it does |
|---|---|
| `/specx:plan` | Writes specs for existing code or new work as an area/component/feature hierarchy, asks you every decision, and breaks approved specs into small, dependency-linked tasks that smaller models and parallel subagents can pick up. |
| `/specx:execute` | Asks you to approve a batch of ready tasks. It then builds each one in its own git worktree with its own subagent, runs the tests and a strict security review, and opens a pull request. It merges only after you approve. |
| `/specx:review` | Reviews existing code, against approved specs or on its own, for gaps, flaws, bugs, security issues, and unhandled use cases. Findings go back to `plan`. |

## Install

In Claude Code:

```text
/plugin marketplace add WIRIN-prod/specx
/plugin install specx@specx-marketplace
```

Or from a terminal:

```bash
claude plugin marketplace add WIRIN-prod/specx
claude plugin install specx@specx-marketplace --scope user
```

Start a new session or run `/reload-plugins`. To update later: `claude plugin marketplace update specx-marketplace`, then reinstall the plugin.

## Start

There is no separate setup step. Open your project in Claude Code and run `/specx:plan`. The first SpecX command in a project creates the `specx/` folder, writes the rules to `specx/RULES.md`, and adds them to the project's `CLAUDE.md`. It makes no decisions and overwrites nothing.

`/specx:execute` needs `gh` installed and signed in, and a git remote. It asks you once for the main branch and the worktree location (next to the repo by default).

## Rules every agent follows

The same rules are in `specx/RULES.md` and the project's `CLAUDE.md`, and every command reads them first:

1. **You make every decision.** Agents never assume or default anything, from architecture and packages down to theme and fonts. Each choice becomes a decision file with options, and the work that depends on it waits for your answer.
2. **You confirm the source of truth.** If docs and code disagree, the agent shows you both and asks which is correct.
3. **There is always a task list.** `specx/tasks/TASKS.md` lists every piece of work and is updated whenever anything changes.
4. **Nothing moves without approval.** That covers specs, tasks, starting execution, and merging.
5. **Agents stay in scope.** They change only the files a task lists.
6. **Reports are honest.** Agents never claim a check passed unless it ran and passed.

## What it creates in your project

```text
specx/
  RULES.md                         rules for every agent
  Home.md                          entry point and git settings
  specs/<area>/<component>/<feature>.md
  decisions/DEC-###-<slug>.md      every decision, open or answered
  tasks/TASKS.md                   the task list
  tasks/T-###.md                   one file per task
  reviews/<date>-<scope>.md        review reports
```

Specs, decisions, and tasks use YAML frontmatter, so related work can be traced and checked. A task lists the specs it implements, the tasks it `depends_on`, the decisions it needs, and the files it may change.

- **Ready**: a task is ready when it is approved (`todo`), all its dependencies are `done`, and all its decisions are answered.
- **Parallel**: ready tasks that share no files and do not depend on each other can run at the same time, one subagent each.
- **Blocked**: if a task hits a new decision, that task and every related task (its dependents, its unfinished dependencies, and tasks sharing its specs or decisions) pause. Unrelated tasks continue.

## Upgrading from 0.1 (CLI version)

0.2 is plugin-only: the `specx` CLI and the Cursor, Copilot, and Codex integrations are gone. To clean a project that used the old `specx init`:

```bash
curl -fsSL https://raw.githubusercontent.com/WIRIN-prod/specx/main/scripts/upgrade-from-0.1.sh -o upgrade-from-0.1.sh
bash upgrade-from-0.1.sh /path/to/project --dry-run   # preview
bash upgrade-from-0.1.sh /path/to/project             # asks before deleting
```

It removes only SpecX-generated skills, commands, rules, and `.specx/`, and takes the SpecX section out of `AGENTS.md` and `.github/copilot-instructions.md`. Your old `specx/knowledge`, `proposals`, `plans`, `specifications`, and `work` folders are kept unless you add `--include-old-record`. Then run `npm unlink -g @specx/cli`, update the plugin, and use `/specx:plan`.

## Development

```text
.claude-plugin/marketplace.json     marketplace listing
plugins/specx/.claude-plugin/       plugin manifest (bump `version` on every change)
plugins/specx/skills/               the three commands
plugins/specx/templates/            RULES.md and the specx/ scaffold copied into projects
specx/                              this repository's own SpecX record
```

`CLAUDE.md` and `specx/RULES.md` in this repository must match `plugins/specx/templates/RULES.md`; CI checks it.

MIT License. See [LICENSE](LICENSE).
