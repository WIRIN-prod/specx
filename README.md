# specX

**Explore ideas, plan, execute, and review software with AI agents. You decide; agents execute.** SpecX is a Claude Code plugin with four commands:

| Command | What it does |
|---|---|
| `/specx:explore` | Discusses an idea in a flexible conversation grounded in read-only repository context, then recaps it and suggests `/specx:plan`. It creates no files or tasks. |
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

There is no separate setup step. Open your project in Claude Code. Use `/specx:explore` to discuss an idea without changing the repository, then run `/specx:plan` when you are ready to create specifications and tasks. The first planning, execution, or review command in a project creates the `specx/` folder, writes the rules to `specx/RULES.md`, and adds them to the project's `CLAUDE.md`. It makes no decisions and overwrites nothing.

`/specx:execute` needs `gh` installed and signed in, and a git remote. It asks you once for the main branch, the worktree location (next to the repo by default), and how to commit progress updates, and records them as decisions in `specx/spec.md`.

## Rules every agent follows

The same rules are in `specx/RULES.md` and the project's `CLAUDE.md`, and every command reads them first:

1. **You make every decision.** Agents never assume or default anything, from architecture and packages down to theme and fonts. Each choice becomes an open decision in the spec it belongs to, and the work that depends on it waits for your answer.
2. **You confirm the source of truth.** If docs and code disagree, the agent shows you both and asks which is correct.
3. **Agents read the whole context chain.** Before touching a spec, they read every parent spec above it.
4. **Specs are build-ready.** A spec is a complete specification and technical plan, not code. A frontier model writes it; a small model builds from it without assuming or guessing anything. Gaps found while building go back to you, never filled by the agent.
5. **There is always a task list.** `specx/TASKS.md` lists every task and is updated whenever anything changes.
6. **Nothing moves without approval.** That covers specs, tasks, starting execution, and merging.
7. **Agents stay in scope.** They change only the files a task lists.
8. **Reports are honest.** Agents never claim a check passed unless it ran and passed.

## Specs: one `spec.md` per folder

Specs form a tree of folders, like nested routes in the Next.js app router. Each folder has exactly one `spec.md` that holds everything about that part of the system: requirements, acceptance criteria, design, decisions, tasks, and change log.

```text
specx/
  RULES.md                             rules for every agent
  spec.md                              ROOT: product, project-wide decisions, shared conventions
  TASKS.md                             every task, one row each
  auth/spec.md                         AUTH
  auth/login/spec.md                   AUTH.LOGIN: what every login method shares
  auth/login/user-creds/spec.md        AUTH.LOGIN.USER-CREDS
  auth/login/sso/spec.md               AUTH.LOGIN.SSO
  auth/login/passkeys/spec.md          AUTH.LOGIN.PASSKEYS
  auth/pat/spec.md                     AUTH.PAT
  auth/rbac/spec.md                    AUTH.RBAC
  _templates/spec.md                   the spec format
  _reviews/<date>-<scope>.md           review reports
```

- **Parents are shared by their children**, like a layout. A parent's *Shared with children* section and its decisions apply to every spec below it, so nothing is repeated.
- **Parents carry the relationships.** A parent's *Children* table says what each child covers and how the children relate. Its tasks build the shared parts and integrate the children, and every child task names the parent task it rolls up to.
- **Links across the tree** (for example, PAT needs RBAC) go in `depends_on`.

Every `spec.md` follows the same standard sections, from [`_templates/spec.md`](plugins/specx/templates/specx/_templates/spec.md):

1. Overview: purpose, in scope, out of scope
2. Context chain: the parents it inherits from, and any overrides
3. Current state: existing behavior, with `path:line` evidence
4. Requirements: numbered, in [EARS](https://alistairmavin.com/ears/) form (`WHEN <trigger>, THE SYSTEM SHALL <response>`)
5. Acceptance criteria: Given/When/Then, each linked to requirements
6. Design, the technical plan at specification level: architecture (with a Mermaid diagram), technology with exact versions, interface contracts with inputs, outputs, and error tables, data model with every field, flows, state machines, failure handling, security, configuration, observability, performance, testing strategy, and rollout. Files and code are left to the implementer.
7. Shared with children
8. Children
9. Decisions: question, options, answer in your words with the date
10. Tasks: status, parent task, dependencies, covered requirements, files, steps, verification, log
11. Open questions
12. Change log: version, date, change, who approved

Before a spec is shown to you for approval, `/specx:plan` runs a build-ready check: every section filled, every library versioned and traced to a decision, every contract and entity fully described, no code, every requirement measurable and tested, no vague words, and no question a small model would have to ask. You can also run `/specx:review` on specs to check this.

How tasks run:

- **Ready**: a task is ready when it is approved (`todo`), its spec is approved, all its dependencies are `done`, and all its decisions are answered.
- **Parallel**: ready tasks that share no files and do not depend on each other can run at the same time, one subagent each.
- **Blocked**: if a task hits a new decision, that task and every related task pause: its dependents, unfinished dependencies, parent and child tasks, and tasks in the same spec or sharing its decisions. Unrelated tasks continue.

## Upgrading

**From 0.2:** run `/specx:plan`. It notices the old `specs/`, `decisions/`, and `tasks/` folders and offers to convert them into the spec tree, keeping every decision's answer and date. Nothing is deleted until you approve.

### From 0.1 (CLI version)

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
plugins/specx/skills/               the four commands
plugins/specx/templates/            RULES.md and the specx/ scaffold copied into projects
specx/                              this repository's own SpecX record
```

`CLAUDE.md` and `specx/RULES.md` in this repository must match `plugins/specx/templates/RULES.md`; CI checks it.

MIT License. See [LICENSE](LICENSE).
