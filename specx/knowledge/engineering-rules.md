# Engineering rules

> State: unresolved · Approval required before treating project-specific rules as binding.

## Code changes

- Follow existing conventions only when verified in the relevant code; cite the governing example or approved rule.
- Do not introduce a new dependency, public interface, data migration, security behavior, or architectural pattern without an approved plan or user decision.
- Keep changes within approved task scope. If scope must change, stop and request approval.

## Quality and safety

Record required checks, test strategy, accessibility, performance, security, observability, compatibility, and release constraints only when supported by project evidence or user approval.

## Decisions and uncertainty

- Never invent requirements, architecture, behavior, or acceptance criteria.
- Separate observed current behavior from intended behavior.
- Preserve conflicting evidence and unresolved questions; do not choose a side without the user.
- Link every accepted rule to its source or approval.

## Merge gate

The agent may prepare code in its working branch for approved tasks. A human reviews the resulting diff and approves before merge. Skills are instructions, not a substitute for repository permissions or branch protection.

