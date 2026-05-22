# specX — Framework DNA (read with specx-sdd)

This document explains **why** specX works the way it does. Agents must internalize this before discovery, build, or evolution work.

## specX philosophy

- **Product before code** — discovery and specs precede implementation
- **Decisions before documents** — agree on outcomes, then write artifacts
- **Humans decide, agents execute** — gates are human; agents draft and implement
- **Context is architecture** — what you put in specs and steering is what you get out
- **Specs are alive, not archives** — delta updates for the lifetime of the product
- **Works everywhere, locks you in nowhere** — markdown in git; any agent that reads files

## What specX takes from each framework — precisely

### From OpenSpec (Fission-AI/OpenSpec)

- **Delta spec model** — `ADDED` / `MODIFIED` / `REMOVED` instead of full rewrites. Adopted wholesale.
- **Two-directory model** — `specx/specs/` (living truth) + `specx/changes/` (in-flight work with deltas).
- **Archive cycle** — merge deltas into specs, move change to `changes/archive/YYYY-MM-DD-name/`.
- **Capabilities in proposal** — proposal lists domains; spec phase creates one delta file per domain.
- **Scenario format** — `### Requirement:` + `#### Scenario:` with GIVEN/WHEN/THEN.

### From BMAD

- **Scale-adaptive tracks** — quick (07–09), standard (01–09), enterprise (01–11). Not every product needs nine discovery artifacts.
- **Named specialist lenses** — each discovery phase has a persona (Strategist, Researcher, UX, etc.). The agent applies that lens, not generic "write a doc."

### From Kiro

- **Steering file** — `specx/foundation/STEERING.md` = persistent project constitution read every session.
- **Human review gate before implementation** — no build until spec + design + tasks approved; enterprise adds review before archive.

### From GSD (Get Shit Done / context-engineering)

- **Context engineering first-class** — fresh agent context per discovery phase and per build task.
- **Verifier before gate** — verify pass before archive; discovery uses critic before human approve.
- **Specs are prompts** — quality of spec text directly determines implementation quality. Write specs as if the implementer has no other context.

### From Ralph Loop

- **Git as memory** — approved discovery phases and archived changes should be **committed**; never rely on chat history as truth.
- **Loop-until-done verifier** — if verify fails, fix and re-verify; feed critique back as context (do not declare done while SHALL requirements fail).

### From Spec Kit

- **Agent-agnostic** — markdown + yaml only; no proprietary runtime. Works in Cursor, Claude Code, Copilot, OpenCode, CI.

## What only specX has

1. **Pre-product design chain** — nine (+2 enterprise) phases from problem through PRD before technical build decisions.
2. **Dual-agent pattern** — Specialist writes; Critic challenges; human sees **both** before approve.
3. **Three-layer handoff** — after discovery/foundation: `specx/specs/` + `STEERING.md` + `BUILD-ORDER.md` = drop into any coding environment.
4. **Product memory model** — specs born delta-compatible; every feature updates living specs; evolution layer (drift, health, retro).

## Three-layer output (Foundation)

| File | Role |
|------|------|
| `STEERING.md` | Product constitution — personas, JTBD, non-negotiables, out-of-scope |
| `ARCHITECTURE.md` | ADRs — supersede, don't silently edit |
| `RULES.md` | How agents write code in this repo |
| `BUILD-ORDER.md` | Sequenced features from PRD — dependencies and gates |

Synthesize STEERING and BUILD-ORDER from approved discovery (especially 07, 08, 09) before heavy build loops.

## Memory and truth (non-negotiable)

| Store | Holds |
|-------|--------|
| Git + `specx/` | Product and behavior truth |
| `.specx/registry.yaml` | Which phase/change is active |
| Chat | Ephemeral — never authoritative |

After every human approval: recommend `git add` + commit for discovery files, registry, specs, and code together.

## Track selection

Read `.specx/specx.yaml` → `track`:

- **quick** — brownfield features; discovery 07–09; RULES + BUILD-ORDER only
- **standard** — new product; full discovery 01–09; full foundation
- **enterprise** — team + compliance; 01–11; audit log; multi-approver gates

Do not run enterprise phases on quick track without user explicit override.
