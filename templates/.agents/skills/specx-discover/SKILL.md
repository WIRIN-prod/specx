---
name: specx-discover
description: Survey an existing application's current implementation and draft an evidence-linked inventory proposal, keeping it distinct from the intended target blueprint.
---

# Discover the current system

1. Read `AGENTS.md`, `specx/Home.md`, the knowledge index, current checkpoint, and relevant existing documentation. Identify all declared repositories, applications, services, and environments; do not assume one repo is the whole product.
2. Inspect manifests, source entry points, module boundaries, routes/APIs, schemas, migrations, tests, CI, deployment, configuration, integrations, and security-sensitive code. Use source maps/indexes as aids, not proof of completeness.
3. Build a coverage table and a bounded inventory. Cite repo-relative paths and symbols/sections for every source-verified claim. Record what was not inspected.
4. Keep observed implementation distinct from intended product behavior. Label claims source-verified only when direct evidence supports them. Mark derived relations proposed; contradictions and missing facts unresolved.
5. Write a current-state survey proposal under `specx/proposals/`. Include the observed component hierarchy, implementation evidence, deployment/stack as observed, inspected and uninspected areas, contradictions, target-state questions, and code-to-target gaps only when the target is known. Do not invent the intended product behavior.
6. Keep this proposal as an evidence-backed snapshot for review. Do not change accepted knowledge, rules, decisions, target specifications, or plans; do not write application code.
7. List the exact questions requiring user choices, with concise options and consequences. Mark questions that block target specification or a future milestone. Never answer for the user.
8. Update `specx/work/CHECKPOINT.md` with current-state survey completion, proposal revision, coverage, unresolved questions, and next safe action. The checkpoint is operational progress, not accepted project knowledge.
9. Stop and ask the user to review the survey proposal. After review/approval, use `/specx:specify` to define the intended target blueprint with the user. Discovery alone does not create a build-ready spec or implementation plan.

## Completeness discipline

Cover product purpose/users/journeys, system boundaries, components and relations, interfaces/events, data ownership and flows, identity/authentication/authorization, security/privacy, external services, runtime/deployment, operations, quality gates, risks, constraints, and open questions. Mark every area assessed, partial, not applicable with evidence, or unresolved. Never say “complete” if repositories, services, or environments remain unexamined.
