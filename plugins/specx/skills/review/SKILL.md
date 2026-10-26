---
name: review
description: Review existing code, against approved specs or on its own, for gaps, flaws, bugs, security issues, and unhandled use cases. Reports findings and never changes code.
---

# SpecX review

Follow the rules in `specx/RULES.md` for everything below (step 0). Review never changes application code.

## 0. Set up and read the rules

1. If `specx/RULES.md` does not exist, this project is not set up yet. Tell the user, then create the following without overwriting any existing file. Setup needs no decisions from the user.
   - Copy the folder `${CLAUDE_PLUGIN_ROOT}/templates/specx/` to `specx/`. In `specx/Home.md`, replace `{{PROJECT_NAME}}` with the project folder name and `{{DATE}}` with today's date.
   - Copy `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md` to `specx/RULES.md`.
   - Put the same rules in the project's `CLAUDE.md` between a `<!-- specx:rules:begin -->` line and a `<!-- specx:rules:end -->` line. Create the file if it is missing, or replace what is between the markers if they exist.
2. If `specx/RULES.md` differs from `${CLAUDE_PLUGIN_ROOT}/templates/RULES.md`, tell the user the rules have changed and ask before replacing `specx/RULES.md` and the `CLAUDE.md` section.
3. Read `specx/RULES.md` completely and follow it for everything below.
4. If `specx/` contains folders from an older SpecX (`knowledge/`, `proposals/`, `plans/`, `specifications/`, `work/`), tell the user that SpecX no longer reads them. Do not delete them.

## 1. Get context

1. Read `specx/RULES.md`, `specx/specs/README.md`, `specx/decisions/README.md`, and `specx/tasks/TASKS.md`.
2. Ask the user for the scope if it is not clear: the whole codebase, a folder or area, specific spec IDs, or a branch or pull request.
3. If approved specs cover the scope, ask whether to review against them or review the code on its own.

## 2. Read

Read all the code in scope, the approved specs and answered decisions that cover it, and its tests. Run the existing tests and record the results.

## 3. Check

- **Against specs**: is every acceptance criterion implemented and tested? Where does behavior differ from the spec? What does the code do that no spec covers?
- **Correctness**: bugs, edge cases, error handling, concurrency, and data integrity.
- **Use cases**: missing flows, empty, invalid, or very large input, failing dependencies, permissions, and accessibility for UI.
- **Security**: be strict. Look for injection, authentication and authorization flaws, missing input validation, exposed secrets, weak cryptography, data exposure, SSRF and path traversal, unsafe deserialization, risky dependencies, sensitive data in logs, and insecure defaults. Choose tools that fit the stack and run them without adding them to the project.
- **Tests**: important behavior with no test, and tests that cannot fail.
- If docs, specs, and code disagree, show the user both sides and ask which is correct (rule 2). Do not decide.

## 4. Verify findings

For every finding, record its severity (critical, high, medium, or low), `path:line`, what is wrong, a concrete failure scenario, and the evidence. Re-read the code to confirm each one. Drop what you cannot support, and mark uncertain findings as uncertain.

## 5. Report

1. Write `specx/reviews/<YYYY-MM-DD>-<scope>.md` with the scope, what was checked and what was not, test results, and the findings ordered by severity.
2. Show the user the findings, most severe first.
3. Ask which findings to act on. Turn those into specs and tasks with `/specx:plan`; they start as drafts and need approval. Review never applies fixes itself.
