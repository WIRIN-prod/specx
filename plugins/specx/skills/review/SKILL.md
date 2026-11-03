---
name: review
description: Review existing code, against approved specs or on its own, for gaps, flaws, bugs, security issues, and unhandled use cases, and check each milestone independently of the agent that built it, including its assumptions and demo. Reports findings and never changes code.
---

# SpecX review

Follow the rules in `specx/RULES.md` for everything below (step 0). Review never changes application code.

There are two modes:

- **Full review:** the user runs `/specx:review`. Follow every step below.
- **Milestone review:** Execute starts you as a new subagent after a milestone is built. You never built this work, and you do not rely on the builder's claims. Skip step 0's setup and step 1's questions: your scope is the diff range you were given, against the specs you were given. Do steps 2 to 4 and then step 5's milestone report.

## 0. Set up and read the rules

1. If `specx/RULES.md` does not exist, this project is not set up yet. Tell the user, then create the following without overwriting any existing file. Setup needs no decisions from the user.
   - Copy the folder `${CLAUDE_PLUGIN_ROOT}/templates/specx/` to `specx/`. In `specx/spec.md`, replace `{{PROJECT_NAME}}` with the project folder name and `{{DATE}}` with today's date.
   - Copy `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md` to `specx/RULES.md`.
   - Put the same rules in the project's `CLAUDE.md` and `AGENTS.md` between `<!-- specx:rules:begin -->` and `<!-- specx:rules:end -->` markers. Create either file if missing, or replace only the content between existing markers.
2. If `specx/RULES.md` differs from `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md`, tell the user the rules have changed and ask before replacing `specx/RULES.md` and the managed sections in `CLAUDE.md` and `AGENTS.md`.
3. Read `specx/RULES.md` completely and follow it for everything below.

## 1. Get context

1. Ask the user for the scope if it is not clear: the whole codebase, a folder or area, a phase or milestone, specific specs, or a branch or pull request. The user can also ask to review specs themselves for build-readiness, or the roadmap itself.
2. If approved specs cover the scope, ask whether to review against them or review the code on its own.

## 2. Read

Read all the code in scope and its tests. When reviewing against specs, read each spec in scope with its full context chain, and its milestones, tasks, and logged assumptions. Run the existing tests and record the results.

## 3. Check

- **Against specs**: is every requirement met and every acceptance criterion implemented and tested? Is everything in each parent's **Shared with children** applied consistently in its children? Where does behavior differ from the spec? What does the code do that no spec covers? Do specs that were changed by this work carry their version bump and change-log row?
- **Scope and phase**: was anything built that belongs to a later phase on the roadmap, or that a spec marks "Deferred"? Is anything this phase owns missing, or wrongly deferred? Did any task change files outside its `Files`?
- **Assumptions**: is every choice the code made outside the spec logged? Is each logged assumption really an implementation detail under rule 1? Report as a finding any big or small choice taken as an assumption, such as a new dependency, a changed interface, a schema change, security behavior, or anything the user can see.
- **Defaults sheet**: does the code use the values in the phase's approved defaults sheet?
- **Milestone "done when"** (when a milestone is in scope): run the steps a user would follow and confirm the line is met. Report commands that fail or that the demo would not be able to give.
- **Correctness**: bugs, edge cases, error handling, concurrency, and data integrity.
- **Readability and simplicity**: unclear naming or flow, unnecessary complexity, duplication, and abstractions that add concepts without value. Recommend concrete simplifications without applying them.
- **Architecture fit**: responsibility boundaries, dependency direction, consistency with the approved architecture, coupling, and misplaced feature logic.
- **Performance**: compare behavior to approved targets; inspect unbounded work, missing pagination, avoidable hot-path costs, and regressions. Do not invent performance targets.
- **Use cases**: missing flows, empty, invalid, or very large input, failing dependencies, permissions, and accessibility for UI.
- **Security**: be strict. Look for injection, authentication and authorization flaws, missing input validation, exposed secrets, weak cryptography, data exposure, SSRF and path traversal, unsafe deserialization, risky dependencies, sensitive data in logs, and insecure defaults. Choose tools that fit the stack, such as dependency audits, secret scanning, and static analysis, and run them without adding them to the project. Treat anything uncertain as a finding.
- **Tests**: important behavior with no test, and tests that cannot fail.
- **Quality-gate integrity**: compare changes with approved gates. Report disabled or removed checks, lowered thresholds, altered failure policies, suppressed assertions, or skipped/deleted tests that weaken an approved gate. Do not infer thresholds or block/warn policies.
- **Specs** (when reviewing specs): every item of the build-ready check in the `plan` skill, step 5. Report each place where an implementer would have to make a big or small choice. Do not report implementation details, or work correctly deferred to a later phase.
- **Status** (in a full review): do `specx/STATUS.md` and `specx/TASKS.md` match the specs?
- If docs, specs, and code disagree, show the user both sides and ask which is correct (rule 2). Do not decide. In a milestone review, report the conflict as a finding for the main session to bring to the user.

## 4. Verify findings

For every finding, record its severity (critical, high, medium, or low), `path:line`, the spec, requirement, or acceptance criterion it breaks (if any), what is wrong, a concrete failure scenario, the evidence, and a concrete remedy or next decision. Re-read the code to confirm each one. Drop what you cannot support, and mark uncertain findings as uncertain.

## 5. Report

**Milestone review:** return the report to the main session, which owns `specx/`. Do not edit `specx/`. State what was checked and what was not, test results, the findings ordered by severity, and the assumptions that need the user's attention. Stop there.

**Full review:**

1. Write `specx/_reviews/<YYYY-MM-DD>-<scope>.md` with the scope, what was checked and what was not, test results, and the findings ordered by severity. Add a link to `specx/STATUS.md`.
2. Show the user the findings, most severe first.
3. Ask which findings to act on. Each becomes a `bug`, `chore`, or `feature` task through `/specx:plan`, starting as a draft that needs approval. Review never applies fixes itself.
