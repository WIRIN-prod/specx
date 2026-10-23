# specX

**A blueprint-first project manager for AI coding agents.** SpecX helps the user and a frontier model research and write a complete project in Markdown before code begins: product behavior, nested component/feature specs, architecture, technical stack, decisions, constraints, and acceptance criteria. It then turns that approved blueprint into milestones and small dependency-linked tasks for implementation agents, guiding each task through a branch, checks, review, and human-approved merge.

SpecX treats project knowledge as a maintained record, not a prompt that the agent may fill with guesses. Current implementation, intended product behavior, source evidence, user decisions, proposals, and unknowns remain distinguishable. Agents stop when a user decision is needed.

## Install

```bash
npm install -g @specx/cli
```

From source:

```bash
git clone https://github.com/WIRIN-prod/specx.git
cd specx
npm install
npm run build
npm link
```

## Start in an application repository

```bash
cd your-app
specx init
```

This scaffolds a Markdown record under `specx/`. In an interactive terminal, SpecX asks which supported agents you use and installs only those integrations. Existing knowledge files are preserved by `specx init`; rerunning it after an upgrade adds missing scaffold files without replacing existing records. Generated SpecX skill directories and managed instruction sections follow the saved selection when you run `specx update`.

For scripts and other non-interactive use, provide the agent IDs explicitly:

```bash
specx init --agents claude,cursor
```

Available IDs are `codex`, `claude`, `cursor`, and `copilot`. Rerun `specx init` to change the selection. SpecX removes only its own generated files for hosts you deselect; the shared project knowledge and root `AGENTS.md` remain.

For an existing or partially built application, start with `/specx:discover`. It inventories what the source code demonstrably does, the areas it inspected, and what remains unknown. It creates a current-state proposal only; existing behavior is not assumed to be the desired product.

Then run `/specx:specify` with a frontier model. It researches consequential questions, works with you to define the intended product and technical design, and writes a hierarchical blueprint such as `Identity and Access Management / Authentication / Login`. It records unresolved decisions instead of choosing for you. Review and approve the exact blueprint revision. No application code is written during discovery or specification authoring.

When the blueprint readiness assessment is complete and you approve it, `/specx:plan` creates a delivery roadmap: phases, verifiable milestones, dependency order, and small tasks traced to approved specification IDs. Approve the exact roadmap separately. Implementation agents then execute one approved task per branch, run the specified checks, and present the diff for review. A human decides whether to merge.

## Knowledge map

```text
specx/
  Home.md                         entry point and trust boundary
  knowledge/
    README.md                     coverage and evidence index
    product.md                    users, journeys, requirements
    architecture.md               context, boundaries, runtime, flows
    technical-stack.md            approved target technologies and decisions
    components/README.md          component catalog and relations
    interfaces-and-data.md        APIs, events, schemas, stores, flows
    security.md                   identity, access, privacy, threat boundaries
    integrations.md               external systems and dependencies
    decisions/                    only user-approved decisions
    engineering-rules.md          approved project-specific constraints
  proposals/                      unaccepted, reviewable knowledge changes
  specifications/                 approved target blueprint and nested feature specs
  plans/                          phased milestones and approved delivery tasks
  work/CHECKPOINT.md              cross-session progress and next safe action
```

The scaffold is intentionally unresolved. It is not evidence that a product area has been investigated or is complete. Each claim must state its status and provenance:

- **user-confirmed** — explicitly confirmed by the user, with approval reference.
- **source-verified** — directly supported by cited source evidence.
- **proposed** — awaiting review; not an instruction to implement.
- **unresolved** — missing, contradictory, or requiring a decision.

## Work lifecycle

1. **Discover current state:** inventory an existing system with source evidence and explicit coverage gaps. This is not the target specification.
2. **Specify the target:** a frontier model researches and collaborates with you on product outcomes, nested components/features, architecture, stack, decisions, constraints, and acceptance criteria. It writes text proposals and no application code.
3. **Approve the blueprint:** approve the exact specification revision and readiness assessment. Unknowns that block delivery stay visible; an approved exception records risk rather than pretending the unknown is solved.
4. **Plan delivery:** create phases and measurable milestones, then small tasks with dependencies and traceability back to approved specs. This stage orders the build; it does not invent product behavior.
5. **Approve the roadmap:** approve the exact roadmap revision before any task is executable.
6. **Execute one task:** an implementation agent reads the approved spec and task, works on a task branch, changes only its scope, runs required checks, and records evidence.
7. **Review and merge:** check the diff against both task and specification acceptance criteria. A human explicitly approves merge; SpecX agents do not merge or deploy.
8. **Resume:** the checkpoint preserves revisions, decisions, milestones/tasks, branch state, evidence, blockers, and next safe action across sessions.

## Commands

| Command | Purpose |
|---|---|
| `specx init [path] [--agents list]` | Scaffold the Markdown project record and install integrations for selected agents. Without `--agents`, asks interactively. |
| `specx update` | Refresh only integrations saved in `.specx/specx.yaml`. |
| `specx onboard` | Print the project context and approval contract. |
| `specx status` | Summarize knowledge files and checkpoint availability. |
| `specx config [--edit]` | Show or edit project metadata and saved integrations in `.specx/specx.yaml`. |

The detailed lifecycle workflows are installed only for the selected hosts: `.agents/skills/` for Codex, `.claude/skills/` for Claude Code, `.cursor/skills/` for Cursor, and `.github/skills/` for GitHub Copilot. Each host uses its native skill invocation; Claude Code and Cursor also receive command wrappers when selected. Claude Code exposes `/specx:discover`, `/specx:specify`, `/specx:propose`, `/specx:approve`, `/specx:plan`, `/specx:execute`, `/specx:review`, and `/specx:resume`.

### Frontier and implementation model split

Use frontier capability for research, requirement clarification, architecture and stack trade-offs, resolving decisions with the user, and writing/reviewing the complete blueprint and roadmap. Use smaller implementation agents for bounded tasks with approved specs, file scope, dependencies, acceptance criteria, and verification. Agent fit is a recommendation; SpecX does not silently dispatch work or transfer unresolved decisions to a lower-capability agent.

## Install as a Claude Code plugin

From a Claude Code session, add the public SpecX marketplace and install the plugin for your user:

```text
/plugin marketplace add WIRIN-prod/specx
/plugin install specx@specx-marketplace
```

Or from a terminal (Claude Code v2.1.292 or later):

```bash
claude plugin install specx --marketplace WIRIN-prod/specx --scope user
```

After installation, start a new Claude Code session or run `/reload-plugins`. The workflow skills are available as `/specx:discover`, `/specx:specify`, `/specx:propose`, `/specx:approve`, `/specx:plan`, `/specx:execute`, `/specx:review`, and `/specx:resume`.

## Why this design

Spec Kit, OpenSpec, Kiro, BMAD, and Superpowers demonstrate useful clarify/design/plan/execute/review loops. Agent Skills supplies a portable progressive-disclosure format, while each host still needs its own wiring. C4 and service catalogs help structure architecture inventories; source indexes help navigate code. SpecX combines these patterns with explicit provenance and human approval. Automated maps are evidence aids, never proof of completeness.

References: [Agent Skills](https://agentskills.io/specification), [Spec Kit](https://github.com/github/spec-kit), [OpenSpec](https://github.com/Fission-AI/OpenSpec), [Kiro specs](https://kiro.dev/docs/specs/feature-specs/), [BMAD](https://github.com/bmad-code-org/BMAD-METHOD), [Superpowers](https://github.com/obra/superpowers), [C4](https://c4model.com/), [Backstage](https://backstage.io/docs/overview/technical-overview/).

## Development

```bash
npm install
npm run typecheck
npm run build
npm test
```

MIT License. See [LICENSE](LICENSE).
