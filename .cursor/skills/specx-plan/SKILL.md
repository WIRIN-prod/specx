---
name: specx-plan
description: Create a phased and dependency-aware Markdown work plan from approved project knowledge; ask the user to approve it before execution.
---

# Plan approved work

1. Read approved requirements, architecture, component records, engineering rules, open decisions, and the current checkpoint. Do not use proposed knowledge as implementation requirements.
2. Clarify the goal. If success criteria, constraints, or behavior are missing, stop and ask the user rather than filling gaps.
3. Inspect the code enough to name actual files and dependencies. Decompose into small tasks with stable IDs, exact scope, prerequisites, acceptance checks, risks, affected knowledge, and out-of-scope boundaries.
4. Recommend agent capability per task only with a short rationale. Treat assignment/risk/priority as recommendations until the user approves the plan.
5. Put the plan in `specx/plans/` using `specx/plans/PLAN-TEMPLATE.md` with status `proposed`. Include phases, dependency graph, review points, and a checkpoint/resume strategy suitable for multi-session work.
6. Recommend a capability per task (`small`, `mid`, `frontier`, or human) and a 0–100 fit score with reasons based on risk, ambiguity, architecture impact, scope, and judgment required. This is advice for the user to review, not an automatic assignment.
7. Validate task IDs, dependency references and cycles, acceptance criteria, and file scope. Do not create/update external boards.
8. Present the exact plan revision to the user and wait for explicit approval before execution. Record approval on that revision; changes after approval require renewed approval.

