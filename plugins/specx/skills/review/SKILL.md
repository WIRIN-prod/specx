---
name: review
description: Review existing code, against approved specs or on its own, for gaps, flaws, bugs, security issues, and unhandled use cases. Reports findings and never changes code.
---

# SpecX review

Follow the rules in `specx/RULES.md` for everything below (step 0). Review never changes application code.

## 0. Set up and read the rules

1. If `specx/RULES.md` does not exist, this project is not set up yet. Tell the user, then create the following without overwriting any existing file. Setup needs no decisions from the user.
   - Copy the folder `${CLAUDE_PLUGIN_ROOT}/templates/specx/` to `specx/`. In `specx/spec.md`, replace `{{PROJECT_NAME}}` with the project folder name and `{{DATE}}` with today's date.
   - Copy `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md` to `specx/RULES.md`.
   - Put the same rules in the project's `CLAUDE.md` and `AGENTS.md` between `<!-- specx:rules:begin -->` and `<!-- specx:rules:end -->` markers. Create either file if missing, or replace only the content between existing markers.
2. If `specx/RULES.md` differs from `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md`, tell the user the rules have changed and ask before replacing `specx/RULES.md` and the managed sections in `CLAUDE.md` and `AGENTS.md`.
3. Read `specx/RULES.md` completely and follow it for everything below.

## 1. Get context

1. Ask the user for the scope if it is not clear: the whole codebase, a folder or area, specific specs, or a branch or pull request. The user can also ask to review specs themselves for build-readiness.
2. If approved specs cover the scope, ask whether to review against them or review the code on its own.

## 2. Read

Read all the code in scope and its tests. When reviewing against specs, read each spec in scope with its full context chain. Run the existing tests and record the results.

## 3. Check

- **Against specs**: is every requirement met and every acceptance criterion implemented and tested? Is everything in each parent's **Shared with children** applied consistently in its children? Where does behavior differ from the spec? What does the code do that no spec covers?
- **Correctness**: bugs, edge cases, error handling, concurrency, and data integrity.
- **Readability and simplicity**: unclear naming or flow, unnecessary complexity, duplication, and abstractions that add concepts without value. Recommend concrete simplifications without applying them.
- **Architecture fit**: responsibility boundaries, dependency direction, consistency with the approved architecture, coupling, and misplaced feature logic.
- **Performance**: compare behavior to approved targets; inspect unbounded work, missing pagination, avoidable hot-path costs, and regressions. Do not invent performance targets.
- **Use cases**: missing flows, empty, invalid, or very large input, failing dependencies, permissions, and accessibility for UI.
- **Security**: be strict. Look for injection, authentication and authorization flaws, missing input validation, exposed secrets, weak cryptography, data exposure, SSRF and path traversal, unsafe deserialization, risky dependencies, sensitive data in logs, and insecure defaults. Choose tools that fit the stack and run them without adding them to the project.
- **Tests**: important behavior with no test, and tests that cannot fail.
- **Quality-gate integrity**: compare changes with approved gates. Report disabled or removed checks, lowered thresholds, altered failure policies, suppressed assertions, or skipped/deleted tests that weaken an approved gate. Do not infer thresholds or block/warn policies.
- **Specs** (when reviewing specs): every item of the build-ready check in the `plan` skill, step 5. Report each place where a small model would have to make a choice.
- If docs, specs, and code disagree, show the user both sides and ask which is correct (rule 2). Do not decide.

## 4. Verify findings

For every finding, record its severity (critical, high, medium, or low), `path:line`, the spec, requirement, or acceptance criterion it breaks (if any), what is wrong, a concrete failure scenario, the evidence, and a concrete remedy or next decision. Re-read the code to confirm each one. Drop what you cannot support, and mark uncertain findings as uncertain.

## 5. Report

1. Write `specx/_reviews/<YYYY-MM-DD>-<scope>.md` with the scope, what was checked and what was not, test results, and the findings ordered by severity.
2. Show the user the findings, most severe first.
3. Ask which findings to act on. Turn those into spec changes and tasks with `/specx:plan`; they start as drafts and need approval. Review never applies fixes itself.
