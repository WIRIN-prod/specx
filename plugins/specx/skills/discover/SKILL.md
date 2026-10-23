---
name: discover
description: Inventory an application and draft evidence-linked project knowledge for user review. Use when initializing SpecX, refreshing architecture knowledge, or mapping a project.
---

# Discover a project

1. Read `AGENTS.md`, `specx/Home.md`, the knowledge index, current checkpoint, and relevant existing documentation. Identify all declared repositories, applications, services, and environments; do not assume one repo is the whole product.
2. Inspect manifests, source entry points, module boundaries, routes/APIs, schemas, migrations, tests, CI, deployment, configuration, integrations, and security-sensitive code. Use source maps/indexes as aids, not proof of completeness.
3. Build a coverage table and a bounded inventory. Cite repo-relative paths and symbols/sections for every source-verified claim. Record what was not inspected.
4. Keep observed implementation distinct from intended product behavior. Label claims source-verified only when direct evidence supports them. Mark derived relations proposed; contradictions and missing facts unresolved.
5. Draft a new proposal under `specx/proposals/`. Do not alter accepted knowledge, rules, decisions, or plans during discovery.
6. List the exact questions requiring the user's choices. Present concise options and consequences; never answer them on the user's behalf.
7. Update `specx/work/CHECKPOINT.md` with discovery completion and next safe action. The checkpoint is operational progress, not accepted project knowledge.
8. Stop and ask the user to review the proposal. No implementation or acceptance before explicit approval.

## Completeness discipline

Cover product purpose/users/journeys, system boundaries, components and relations, interfaces/events, data ownership and flows, identity/authentication/authorization, security/privacy, external services, runtime/deployment, operations, quality gates, risks, constraints, and open questions. Mark every area assessed, partial, not applicable with evidence, or unresolved. Never say “complete” if repositories, services, or environments remain unexamined.
