# specX

**One framework from raw idea to shipped, maintained product.** Self-sufficient spec-driven development — not glue between OpenSpec, PRD tools, and task runners.

Four layers: **Discovery → Foundation → Build → Evolution**. Solo-first; enterprise track adds security, compliance, multi-approver gates, and audit logs.

## Install

```bash
npm install -g @specx/cli
```

Or from source:

```bash
git clone https://github.com/WIRIN-prod/specx.git
cd specx
npm install
npm run build
npm link
```

## Quick start (enterprise application)

```bash
cd your-app
specx init --track enterprise
specx discover
specx phase 1
# Specialist + Critic agents complete phase → specx approve
specx propose add-auth
specx spec
specx design
specx tasks
specx build
specx verify
specx archive add-auth
specx drift
```

Read [`specx/SPECX.md`](specx/SPECX.md) after init — every agent session starts there.

## Commands

| Area | Commands |
|------|----------|
| Project | `init`, `update`, `status`, `config`, `track`, `onboard` |
| Discovery | `discover`, `discover quick`, `discover resume`, `phase`, `approve`, `revise` |
| Build | `propose`, `spec`, `design`, `tasks`, `build`, `verify`, `archive`, `diff` |
| Evolution | `drift`, `health`, `retro`, `changelog` |
| Team | `review`, `assign`, `gate` |
| Headless | `run -p "..."`, `run --phase 1`, `run --propose name` |

Slash commands map to **OpenCode-style skills** in `.cursor/skills/specx-*/SKILL.md` — each skill contains the full SDD playbook (propose, spec, design, tasks, build, verify, archive, discover, specialist, critic). `.specx/commands/` is synced from skills on `specx init` / `specx update`.

## vs OpenSpec

OpenSpec excels at the **build loop** (propose → apply → archive). specX **includes** that delta-spec model and adds Discovery, Foundation, and Evolution so specs stay alive across the full product lifecycle.

## Tracks

| Track | Use case |
|-------|----------|
| `quick` | Features on existing product (discovery 07–09) |
| `standard` | New product (9 discovery phases) |
| `enterprise` | Team + compliance + audit (11 phases) |

## Publish to npm

```bash
npm run build
npm publish --access public
```

Requires npm login and ownership of `@specx/cli`.

## Roadmap

- Persistent TUI server (opencode-style session survival)
- Direct LLM provider orchestration in CLI
- Deeper drift analysis (AST-aware)

## License

MIT — see [LICENSE](LICENSE).
