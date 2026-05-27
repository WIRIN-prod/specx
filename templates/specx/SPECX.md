# specX — Project Constitution

> **{{PROJECT_NAME}}** | Track: **{{TRACK}}** | Initialized: {{DATE}}

specX is the only framework you need from **raw idea** to **shipped, maintained product**. Self-sufficient — not glue between OpenSpec, BMAD, Kiro, GSD, or Ralph.

## Philosophy

- **Product before code**
- **Decisions before documents**
- **Humans decide, agents execute**
- **Context is architecture** — specs and steering are prompts; quality in → quality out
- **Specs are alive, not archives** — delta updates for the product lifetime
- **Works everywhere, locks you in nowhere** — markdown in git; any agent

## What specX combines

| Source | What we take |
|--------|----------------|
| **OpenSpec** | Delta specs (ADDED/MODIFIED/REMOVED) per feature under `features/<id>/specs/` |
| **BMAD** | Three tracks; named specialist lens per discovery phase |
| **Kiro** | `STEERING.md` every session; no build before spec review |
| **GSD** | Fresh context per phase/task; verifier before gate; specs are prompts |
| **Ralph Loop** | Git as memory; verify loop until READY |
| **Spec Kit** | Agent-agnostic markdown only |

## Six elements of a good spec

Every agent spec must answer: **outcomes**, **in/out scope**, **constraints**, **decisions made**, **task breakdown**, **verification**. See `.cursor/skills/specx-sdd/six-elements.md`.

## What only specX has

1. **Pre-product discovery** — phases 01–09 (+10–11 enterprise) before technical build
2. **Dual-agent** — Specialist + Critic; human sees both before approve
3. **Three-layer handoff** — specs folder + STEERING + BUILD-ORDER
4. **Product memory** — living discovery, foundation, and feature leaves; evolution (drift, health, retro)

## Agent instructions (where detail lives)

**Full playbooks:** `.cursor/skills/specx-*/SKILL.md`

| Start here | Skill |
|------------|-------|
| Methodology | `specx-sdd` + `reference.md` |
| Discovery | `specx-discover` + `phases.md` |
| Features | `specx propose <id>` → spec → design → tasks → build (persistent folders) |
| Quality | `specx-specialist`, `specx-critic`, `specx-verify` |

Also: `.specx/AGENTS.md`, `.specx/commands/` (synced from skills)

## Four layers

```
RAW IDEA → Discovery → Foundation → Build → Evolution → SHIPPED PRODUCT
```

| Layer | Path |
|-------|------|
| 1 Discovery | `specx/discovery/` |
| 2 Foundation | `specx/foundation/` |
| 3 Build | `specx/<segment>/…/<leaf>/` (see `STRUCTURE.md`) + `features.yaml` catalog |
| 4 Evolution | `specx/evolution/` |

## Bootstrap order

1. This file
2. `.cursor/skills/specx-sdd/SKILL.md` + `reference.md`
3. `foundation/STEERING.md`
4. `.specx/specx.yaml`, `.specx/registry.yaml`
5. Active feature leaf (`specx/auth/…/registration/`) or discovery phase file

## Tracks

| Track | Discovery | Foundation |
|-------|-----------|------------|
| quick | 07–09 | RULES, BUILD-ORDER |
| standard | 01–09 | all four |
| enterprise | 01–11 | all + team/RBAC + audit |

## Build loop

```
propose (Capabilities) → spec (deltas) → design → tasks → build (1 task) → verify → archive
```

## Dual-agent + git gate

```
Specialist → Critic → Human → approve/archive → git commit
```

## This project

- **Name**: {{PROJECT_NAME}}
- **Track**: {{TRACK}}
- **Stack**: {{STACK}}
