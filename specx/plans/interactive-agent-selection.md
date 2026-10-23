# Work plan: Select agent integrations during initialization

- ID: interactive-agent-selection
- State: review required
- Revision: 1
- Created: 2026-10-24
- Goal: Let users choose the agent integrations SpecX installs, and remember that choice for later updates.
- Approved knowledge revision(s): User request in chat, 2026-10-24: ask which agent(s) the user uses and add only those integrations.
- Supersedes: None

## Success criteria and boundaries

- `specx init` presents the supported integrations (Codex, Claude Code, Cursor, and GitHub Copilot) and accepts one or more selections.
- Only selected host-specific skills, commands, and rules are created or refreshed.
- The selected hosts are recorded in `.specx/specx.yaml`; `specx update` refreshes only those hosts.
- Rerunning `specx init` with a changed selection removes only prior SpecX-managed artifacts for deselected hosts. It preserves other files and unrelated skills/rules.
- Non-interactive use never silently selects all hosts: require `--agents codex,claude,cursor,copilot` when stdin is not a terminal.
- The common Markdown knowledge base and root `AGENTS.md` remain available regardless of host selection.
- Out of scope: adding new agent hosts, changing knowledge approval gates, and installing Claude Code or other agents themselves.

## User decisions required before execution

None. The supported host list is already present in the current initializer. The prompt will allow choosing multiple hosts; the non-interactive equivalent will be `--agents`.

## Phases

### Phase 1: Persist and apply host selection

Purpose and outcome: Initialization and updates install exactly the integrations the user selected, including when adopting SpecX in a project that was already initialized with all hosts.

Tasks:

#### AGENT-1: Add an explicit host-selection setting and CLI input

- State: done
- Intent: Add a validated integrations host list to SpecX config, an interactive multi-select prompt to `init`, and a `--agents` option for scripted/non-interactive use. Save the selection so `update` uses the same list.
- Depends on: None
- Scope (explicit files or subtrees): `schemas/specx-config.ts`, `src/cli.ts`, `src/commands/init.ts`, `src/commands/core.ts`, `src/lib/config.ts`
- Acceptance checks (observable and verifiable): The interactive flow lists the four supported hosts and validates one or more selections; `--agents` accepts the same host identifiers; invalid/empty selections fail with an actionable message; new and existing configs preserve unrelated values; `update` does not default a missing selection to all hosts.
- Risk and rollback: Config schema and CLI behavior change. Roll back the task's code/config changes; do not rewrite existing project knowledge.
- Affected knowledge/components: CLI initialization, configuration, and host integrations.
- Suggested agent capability: mid
- Fit score (0–100) and rationale: 90 — clear scope with CLI/config integration and backwards-compatibility details.
- Out of scope: Adding hosts or changing the host-specific instruction content.
- User decisions: None.

#### AGENT-2: Generate and clean only selected host integrations

- State: done
- Intent: Refactor integration generation so the chosen hosts receive their relevant skills, commands, and rules. On reselection, remove only SpecX-managed artifacts belonging to hosts no longer selected while preserving unrelated files. Keep shared project instructions and knowledge scaffolding.
- Depends on: AGENT-1
- Scope (explicit files or subtrees): `src/lib/agents.ts`, `src/commands/init.ts`, `src/commands/core.ts`
- Acceptance checks (observable and verifiable): A Claude-only selection does not create Codex, Cursor, or Copilot host-specific files; changing an all-host selection to Claude removes only SpecX-owned files for the other hosts; unrelated pre-existing skills and instructions remain; shared `AGENTS.md` and `.specx/AGENTS.md` remain available; update affects only the saved selection.
- Risk and rollback: Cleanup could remove customized SpecX-managed artifacts. Limit deletion to known SpecX skill/command/rule names and managed instruction markers; preserve all other content.
- Affected knowledge/components: Agent adapters and managed project instruction sections.
- Suggested agent capability: mid
- Fit score (0–100) and rationale: 85 — host-specific paths are known, but cleanup must respect user-owned neighboring content.
- Out of scope: Deleting entire host configuration directories or changing non-SpecX content.
- User decisions: None.

#### AGENT-3: Document selection and update behavior

- State: done
- Intent: Explain interactive and non-interactive setup, supported host identifiers, persisted selection, and how to change it by rerunning init with a new selection.
- Depends on: AGENT-1, AGENT-2
- Scope (explicit files or subtrees): `README.md`, CLI help text
- Acceptance checks (observable and verifiable): Documentation shows an interactive example and a valid `--agents` invocation; it explains that `update` respects the saved selection and how to change it.
- Risk and rollback: None beyond documentation drift.
- Affected knowledge/components: User-facing installation and CLI documentation.
- Suggested agent capability: small
- Fit score (0–100) and rationale: 95 — straightforward docs following the implemented interface.
- Out of scope: Publishing to npm or adding hosts.
- User decisions: None.

## Dependency graph

```text
AGENT-1 → AGENT-2 → AGENT-3
```

## Verification and human review points

- TypeScript typecheck passed.
- Build passed.
- CLI help displays `--agents <list>` and the supported identifiers.
- `git diff --check` passed.
- Behavioral tests were not run.
- Present the code diff and behavior summary for human review; do not merge or deploy.

## Resume strategy

After each task, update `specx/work/CHECKPOINT.md` with its status, checks performed, and the next task. Stop if implementation shows a host integration is not wholly SpecX-managed or cleanup could affect unrelated user content.

## Approval record

- Decision: approved
- User confirmation reference/date: User approved this exact revision in chat, 2026-10-24.
- Approved revision/hash: Revision 1, approved 2026-10-24.
- Scope approved: AGENT-1, AGENT-2, and AGENT-3 as written above.
