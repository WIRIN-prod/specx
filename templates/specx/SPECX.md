# specX — Project Constitution

> **{{PROJECT_NAME}}** | Track: **{{TRACK}}** | Initialized: {{DATE}}

specX is the only framework you need from **raw idea** to **shipped, maintained product**. Not glue between other tools — four layers, one repo, git-committed truth.

## Philosophy

- **Self-sufficient** — Discovery, Foundation, Build, Evolution in one system
- **Human-gated** — No phase advances without approve/revise
- **Git is truth** — Approved artifacts are committed; chat is not the source of truth
- **Dual-agent** — Specialist produces; Critic challenges; human sees both
- **Living specs** — Specs evolve with the product; drift is detected
- **Brownfield-ready** — Works on existing codebases
- **Provider-agnostic** — Any model via `.specx/specx.yaml`
- **Solo-first** — Team gates are additive

## Four layers

```
RAW IDEA → Discovery → Foundation → Build → Evolution → SHIPPED PRODUCT
```

| Layer | Path | Purpose |
|-------|------|---------|
| 1 Discovery | `specx/discovery/` | Pre-product design (9–11 phases) |
| 2 Foundation | `specx/foundation/` | STEERING, ARCHITECTURE, RULES, BUILD-ORDER |
| 3 Build | `specx/specs/`, `specx/changes/` | Feature loop + delta specs |
| 4 Evolution | `specx/evolution/` | Drift, health, changelog, retros |

## Agent bootstrap (required order)

1. Read this file (`specx/SPECX.md`)
2. Read `specx/foundation/STEERING.md` if present
3. Read `.specx/specx.yaml` and `.specx/registry.yaml`
4. Load active change from registry
5. Never skip human gates; never archive without explicit approval

## Tracks

| Track | Discovery | Foundation | Evolution |
|-------|-----------|------------|-----------|
| quick | 07–09 | RULES, BUILD-ORDER | changelog |
| standard | 01–09 | all four | drift + health + changelog |
| enterprise | 01–11 | all + team/RBAC | full + audit |

## Commands

| Slash | CLI |
|-------|-----|
| `/specx:discover` | `specx discover` |
| `/specx:propose` | `specx propose <name>` |
| `/specx:spec` | `specx spec` |
| `/specx:design` | `specx design` |
| `/specx:tasks` | `specx tasks` |
| `/specx:build` | `specx build` |
| `/specx:verify` | `specx verify` |
| `/specx:archive` | `specx archive <name>` |
| `/specx:drift` | `specx drift` |
| `/specx:onboard` | `specx onboard` |

## Build loop

```
propose → spec → design → tasks → build → verify → archive
```

Delta format: `## ADDED|MODIFIED|REMOVED Requirements` with `### Requirement:` and GIVEN/WHEN/THEN scenarios (OpenSpec-compatible).

## Dual-agent gate

```
Specialist → output.md
Critic     → critiques/*-critique.md
Human      → approve | revise
Verifier   → consistency vs prior approved docs
Git commit → approved only
```

## Non-goals

- Not a replacement for code review or security audit
- Not vendor-locked to one AI provider
- Not waterfall — gates are checkpoints, not months of planning

## This project

- **Name**: {{PROJECT_NAME}}
- **Track**: {{TRACK}}
- **Stack**: {{STACK}}
