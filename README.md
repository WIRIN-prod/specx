# specX

**A user-approved project knowledge system for AI coding agents.** SpecX helps an agent map a whole software product, preserve its architecture and rules as Markdown in the application repository, and work from plans the user has approved.

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

This scaffolds a Markdown record under `specx/` and installs skills/instructions for Codex, Claude Code, Cursor, and GitHub Copilot. Existing knowledge files are preserved by `specx init`; generated SpecX skill directories and marked instruction sections are managed by `specx update`.

Start with `/specx:discover` (or read `.agents/skills/specx:discover/SKILL.md`). The agent inventories the product and code, records evidence and gaps, and drafts a proposal. Review it. Only after your explicit approval should the approved knowledge be recorded and a work plan created.

## Knowledge map

```text
specx/
  Home.md                         entry point and trust boundary
  knowledge/
    README.md                     coverage and evidence index
    product.md                    users, journeys, requirements
    architecture.md               context, boundaries, runtime, flows
    components/README.md          component catalog and relations
    interfaces-and-data.md        APIs, events, schemas, stores, flows
    security.md                   identity, access, privacy, threat boundaries
    integrations.md               external systems and dependencies
    decisions/                    only user-approved decisions
    engineering-rules.md          approved project-specific constraints
  proposals/                      unaccepted, reviewable knowledge changes
  plans/                          user-approved phased work plans
  work/CHECKPOINT.md              cross-session progress and next safe action
```

The scaffold is intentionally unresolved. It is not evidence that a product area has been investigated or is complete. Each claim must state its status and provenance:

- **user-confirmed** — explicitly confirmed by the user, with approval reference.
- **source-verified** — directly supported by cited source evidence.
- **proposed** — awaiting review; not an instruction to implement.
- **unresolved** — missing, contradictory, or requiring a decision.

## Work lifecycle

1. **Discover:** survey the declared product scope and code; report inspected and uninspected areas.
2. **Propose:** draft exact knowledge changes with evidence, impacts, conflicts, and questions.
3. **Approve knowledge:** you approve or reject the exact proposal revision. Silence is not approval.
4. **Plan:** produce Markdown phases and tasks with scope, dependencies, acceptance criteria, risks, and justified agent-capability recommendations.
5. **Approve plan:** you approve the exact plan revision before any task begins.
6. **Execute:** agents work only on approved, unblocked tasks. Missing decisions or scope changes pause that task.
7. **Review:** inspect the full diff and acceptance evidence. Human approval is required before merge.
8. **Resume:** the Markdown checkpoint records approved scope, progress, evidence, blockers, and the next safe action for future sessions.

## Commands

| Command | Purpose |
|---|---|
| `specx init [path]` | Scaffold the Markdown project record and host integrations without overwriting existing knowledge. |
| `specx update` | Refresh SpecX-managed skills and agent instructions. |
| `specx onboard` | Print the project context and approval contract. |
| `specx status` | Summarize knowledge files and checkpoint availability. |
| `specx config [--edit]` | Show or edit basic project metadata in `.specx/specx.yaml`. |

The detailed lifecycle workflows are skills installed in `.agents/skills/`, `.claude/skills/`, `.cursor/skills/`, and `.github/skills/`. Claude Code and Cursor also receive slash-command wrappers.

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
