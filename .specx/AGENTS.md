# specX agent rules

## Canonical record

The project knowledge base in `specx/` is canonical and lives in this repository as Markdown. Read `specx/Home.md`, its knowledge index, and `specx/work/CHECKPOINT.md` before acting. The record distinguishes observed current behavior from approved desired behavior.

## Approval is mandatory

- Only `user-confirmed` or evidence-backed `source-verified` items are accepted facts. Proposed, inferred, disputed, or unresolved content is not implementation authority.
- Draft knowledge changes as proposals. Do not edit accepted knowledge or mark a proposal approved until the user explicitly approves the exact revision.
- Approval of knowledge does not approve implementation. Plans require their own explicit approval before execution.
- If behavior, requirements, architecture, dependencies, migrations, security decisions, or scope are missing or conflicting, stop and ask the user. Never choose on their behalf.

## Work and continuity

- Plans, task state, dependencies, decisions, and checkpoints are Markdown in this repository. Do not require Plane or another external tracker.
- Execute only tasks in the exact approved plan revision and declared scope. Preserve unrelated working-tree changes.
- Agents may prepare scoped changes in a working branch. A human reviews and approves before merge; agents do not merge or deploy.
- Record evidence and the next safe action in `specx/work/CHECKPOINT.md` so work can resume across sessions and hosts.
- Skills and prompts express policy but cannot enforce host permissions. Use repository review protections and host controls where configured.

## Lifecycle

`discover → propose → user approval → plan → user approval → execute → review → human merge approval`

Read the relevant skill under `.cursor/skills/` or `.claude/skills/` for the current stage. The portable skills are shipped from `.agents/skills/`; host adapters mirror them under Claude Code, Cursor, and GitHub Copilot skill directories.
