# AGENTS.md

This repository implements **SpecX**, a user-approved project knowledge system.

- Canonical project model and work plans are Markdown under `specx/`.
- Start with [specx/Home.md](specx/Home.md) and [specx/work/CHECKPOINT.md](specx/work/CHECKPOINT.md).
- Follow [.specx/AGENTS.md](.specx/AGENTS.md) and the applicable skill under `.cursor/skills/` or `.claude/skills/`.
- Do not accept proposed knowledge or resolve unknowns without explicit user approval.
- Execute only approved task plans and present code changes for human review before merge.

<!-- specx:agents:begin -->
Read specx/Home.md and .specx/AGENTS.md. The repository-local Markdown knowledge base is canonical. Proposed, inferred, disputed, and unresolved content is not accepted truth. Ask the user before resolving missing decisions, changing accepted knowledge, or expanding approved scope. Execute only tasks in an explicitly approved plan. Present code changes for human review before merge.
<!-- specx:agents:end -->
