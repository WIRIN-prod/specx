---
id: ROOT
title: SpecX
status: draft
version: 5
parent: none
depends_on: []
---

# ROOT: SpecX

The root spec for SpecX itself. The format is in [_templates/spec.md](../plugins/specx/templates/specx/_templates/spec.md); the rules are in [RULES.md](RULES.md).

## 1. Overview

**Purpose:** A Claude Code plugin that lets a user plan, execute, and review software with AI agents, where the user makes every decision and agents only execute.

**In scope:**

- Three commands: `/specx:plan`, `/specx:execute`, `/specx:review`
- A per-project `specx/` record: a tree of `spec.md` files, `TASKS.md`, and rules copied into `CLAUDE.md`

**Out of scope:**

- A CLI, and integrations for agents other than Claude Code (ROOT-D10)

## 2. Context chain

None (root).

## 3. Current state

- Plugin manifest: `plugins/specx/.claude-plugin/plugin.json`
- Skills: `plugins/specx/skills/{plan,execute,review}/SKILL.md`
- Rules and scaffold: `plugins/specx/templates/`
- Cleanup for 0.1 projects: `scripts/upgrade-from-0.1.sh`

## 4. Requirements

| ID | Type | Requirement | Source |
|---|---|---|---|
| ROOT-R1 | Functional | THE SYSTEM SHALL offer exactly three commands: plan, execute, and review. | ROOT-D1 |
| ROOT-R2 | Functional | WHEN a choice is needed, THE SYSTEM SHALL record it as an open decision and ask the user instead of choosing. | ROOT-D9 |
| ROOT-R3 | Functional | IF docs and code disagree, THEN THE SYSTEM SHALL ask the user which is the source of truth. | ROOT-D9 |
| ROOT-R4 | Functional | THE SYSTEM SHALL keep `specx/TASKS.md` in step with every task in the spec tree. | ROOT-D9 |
| ROOT-R5 | Functional | WHEN executing, THE SYSTEM SHALL build each approved task in its own worktree and subagent, and merge only by pull request with a merge commit after the user approves. | ROOT-D2, D4, D5 |
| ROOT-R6 | Security | WHEN executing, THE SYSTEM SHALL run a strict model-run security review before opening a pull request. | ROOT-D3 |
| ROOT-R7 | Functional | IF a task needs a new decision, THEN THE SYSTEM SHALL stop that task and every related task, and let unrelated tasks continue. | ROOT-D6 |
| ROOT-R8 | Functional | THE SYSTEM SHALL write specs as one standard-format `spec.md` per folder, with decisions and tasks inside, in a parent/child tree where parents hold what children share. | ROOT-D11 |
| ROOT-R10 | Functional | THE SYSTEM SHALL write each spec as a complete specification and technical plan, not code (architecture, technology with versions, interface contracts and errors, data model, flows, state, failures, security, configuration, observability, performance, testing, rollout) that passes the build-ready check before it is shown for approval. | ROOT-D12 |
| ROOT-R9 | Functional | WHEN a SpecX command first runs in a project, THE SYSTEM SHALL create the `specx/` layout and rules without a separate CLI. | ROOT-D10 |
| ROOT-R11 | Process | THE SYSTEM SHALL enforce only approved quality criteria and commands, record whether each failure blocks or warns, and require user approval before weakening an existing gate. | ROOT-D14 |

## 5. Acceptance criteria

**ROOT-AC1** (R1, R9)

- Given a project with the plugin installed and no `specx/` folder
- When the user runs `/specx:plan`
- Then `specx/RULES.md`, `specx/spec.md`, `specx/TASKS.md`, `specx/_templates/spec.md`, and a rules section in `CLAUDE.md` exist, and only the three SpecX commands are offered

**ROOT-AC2** (R11)

- Given a project with an approved quality gate naming its criterion, command, run point, and failure policy
- When an agent encounters or proposes a change that weakens that gate
- Then the agent reports the change and waits for the user's approval before applying it

## 6. Design

The plugin ships skills and templates only. Each skill starts with the same setup step, which copies `plugins/specx/templates/` into the project. CI checks the manifests, the skill frontmatter, and that this repository's rules match the template.

The workflow is compared with Addy Osmani's [agent-skills](https://github.com/addyosmani/agent-skills) reference pack:

| Reference capability | SpecX command and handling |
|---|---|
| Define, interview, refine ideas, spec-driven development | Plan confirms intent when unclear, researches the repository, and writes build-ready specs. |
| Planning and task breakdown | Plan records broad capability/dependency maps in the parent Children table and creates approved vertical tasks. |
| Incremental implementation, context engineering, TDD, security, Git and shipping | Execute assigns each approved task its own worktree and subagent, follows the approved test method, runs checks and security review, and uses a PR for merge approval. |
| Code review and quality | Review reports evidence-backed findings on correctness, readability/simplicity, architecture, security, and performance; it does not modify code. |
| Constraint-driven development | User-approved quality gates are captured in the root or relevant spec and checked throughout Plan, Execute, and Review. |
| API, UI, accessibility, observability, CI/CD, migration and documentation specialties | Use the relevant existing spec sections and task scope; no separate slash commands are added. |

The reference repository is [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills). SpecX keeps only `/specx:plan`, `/specx:execute`, and `/specx:review`. Quality gates require user-approved criteria and commands, an explicit run point, and a block-or-warn policy; no numeric target or failure policy is assumed.

## 7. Shared with children

None.

## 8. Children

| Spec | Responsibility | Depends on | Build order | Shared context and relation | Status |
|---|---|---|---|---|---|

## 9. Decisions

### ROOT-D1: SpecX commands

- **Status:** answered (2026-10-26)
- **Question:** Which workflow commands should SpecX offer?
- **Answer:** "Only plan, execute, and review. Remove discover, specify, propose, approve, resume, the command wrappers, and `specx onboard`. Keep SpecX simple and to the point." (user, 2026-10-26)

### ROOT-D2: Merge method and target branch

- **Status:** answered (2026-10-26)
- **Question:** How are approved changes merged, and into which branch?
- **Answer:** "Ask the user which branch is the main branch. Merge with a merge commit, through a pull request only." (user, 2026-10-26)

### ROOT-D3: Security review

- **Status:** answered (2026-10-26)
- **Question:** How should execute check security?
- **Answer:** "A model-run security review. The model chooses which tools to use, and its goal is to be very strict." (user, 2026-10-26)

### ROOT-D4: Worktree location

- **Status:** answered (2026-10-26)
- **Question:** Where are task worktrees created?
- **Answer:** "Next to the repository by default; the user can suggest another location." (user, 2026-10-26)

### ROOT-D5: Parallel execution

- **Status:** answered (2026-10-26)
- **Question:** How many subagents run at once?
- **Answer:** "The agent decides from the task graph. Each task gets its own subagent, so the user keeps control and the subagent gets its context from the task." (user, 2026-10-26)

### ROOT-D6: Decisions found during execution

- **Status:** answered (2026-10-26)
- **Question:** When a task needs a decision during execute, what stops?
- **Answer:** "Only that task, unless it is related to other tasks; then all related tasks stop." (user, 2026-10-26)

### ROOT-D7: Existing projects

- **Status:** answered (2026-10-26)
- **Question:** Migrate the old knowledge/proposals/plans layout or start fresh?
- **Answer:** "Start fresh." (user, 2026-10-26)

### ROOT-D8: Earlier unreviewed plans

- **Status:** answered (2026-10-26)
- **Question:** Should this redesign replace the unreviewed blueprint-lifecycle and agent-selection plans?
- **Answer:** "Yes, replace them." (user, 2026-10-26)

### ROOT-D9: Who decides

- **Status:** answered (2026-10-26)
- **Question:** How much may SpecX agents decide on their own?
- **Answer:** "Nothing. Every decision, from architecture and packages down to theme and fonts, is asked of the user and approved before execution completes. The LLM is only the executor. Always maintain a task list. When docs and code disagree, confirm the source of truth with the user. Rules are added everywhere so agents follow them exactly." (user, 2026-10-26)

### ROOT-D10: Plugin-only distribution

- **Status:** answered (2026-10-26)
- **Question:** Claude Code showed every command twice (`/specx:plan` from the plugin and `/specx-plan` from `specx init`). Should the plugin or the CLI own setup?
- **Answer:** "Keep the plugin installation and let it handle initialization instead of the CLI. The CLI was needed for features that were removed." (user, 2026-10-26)

### ROOT-D11: Spec format and layout

- **Status:** answered (2026-10-26)
- **Question:** How should specs, decisions, and tasks be organized and written?
- **Answer:** "One `spec.md` per folder holding everything about that feature (decisions and tasks included, not separate files). Hierarchy like Next.js app router: `auth/login/spec.md` with children such as `auth/login/sso/spec.md`; what a parent holds is common to all children, and the parent spec carries the correlation and a parent task for each child task. Specs follow a standard spec format, not README prose." (user, 2026-10-26)

### ROOT-D12: Spec depth

- **Status:** answered (2026-10-26)
- **Question:** How detailed must a spec be?
- **Answer:** "The spec should be a complete plan on what to do, how to do it, and what to use, with technical and architecture details, so frontier models can write them up and then small models just follow the setup." (user, 2026-10-26)

### ROOT-D13: Specification, not code

- **Status:** answered (2026-10-26)
- **Question:** Should specs include code layout and code-level detail?
- **Answer:** "Code layout wouldn't be required; that can be decided by the LLM, but it should understand what we have planned. You don't need to give code-level details but need the technical layout for what needs to be done. Think of it not as a coding plan alone but as a specification detailed enough that just that one document gives the LLM enough details to know what to do, without needing to assume or guess anything." (user, 2026-10-26)

### ROOT-D14: Align SpecX skills with agent-skills

- **Status:** answered (2026-10-27)
- **Question:** How should SpecX compare with and use the `addyosmani/agent-skills` reference?
- **Answer:** "Compare our skills with the repo and see which skills align with what and if anything is missed add even if we want to add more slash command." The user approved the resulting plan: map the reference to SpecX, integrate compatible missing practices into Plan, Execute, and Review, keep the three existing commands, preserve per-task approval gates, and do not invent quality thresholds or policies. (user, 2026-10-27)
- **Reference:** [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), reviewed 2026-10-27.

## 10. Tasks

### ROOT-T1: Align SpecX workflows with agent-skills

- **Status:** in-review
- **Parent:** None
- **Depends on:** None
- **Covers:** ROOT-R1, ROOT-R11, ROOT-AC1, ROOT-AC2
- **Decisions:** ROOT-D14
- **Files:** `plugins/specx/skills/`, `plugins/specx/templates/`, `specx/`, `CLAUDE.md`, `AGENTS.md`, `plugins/specx/.claude-plugin/plugin.json`
- **Model:** frontier, because this coordinates workflow and rule changes across the plugin and its canonical spec
- **Branch / worktree / PR:** —

**Steps**

1. Compare the reference capabilities with Plan, Execute, and Review; retain the three-command interface.
2. Add confirmed intent and capability mapping, vertical task slicing, approved quality-gate capture, and source/trade-off handling to Plan.
3. Add user-approved TDD handling, structured check-failure diagnosis, and spec-gap stopping to Execute.
4. Add five review dimensions, evidence-backed remedies, and quality-gate integrity checks to Review.
5. Update the spec template and mirrored rules; bump the plugin patch version.

**Verification**

- Confirm root spec rules are in draft version 5 and record ROOT-D14.
- Confirm all rules copies match the canonical template.
- Confirm plugin metadata remains valid and only the three intended command skills are present.
- Manually check the intent, capability-map, TDD-choice, failed-check, five-dimension review, and gate-weakening scenarios.

**Log**

- 2026-10-27: implementation started after the user approved the comparison plan.
- 2026-10-27: implemented workflow guidance, refreshed scaffold and rule copies, and bumped plugin to 0.4.1. PowerShell checks confirmed manifest validity, synchronized rules, the three-skill inventory, and `git diff --check` passed. No application test suite was run.

## 11. Open questions

- Plugin skills locate templates through `${CLAUDE_PLUGIN_ROOT}`; this has not been verified in a live session.

## 12. Change log

| Version | Date | Change | Approved by |
|---|---|---|---|
| 1 | 2026-10-26 | Three commands, rules everywhere (ROOT-D1 to D9) | user |
| 2 | 2026-10-26 | Plugin-only (ROOT-D10) | user |
| 3 | 2026-10-26 | Spec tree with one standard `spec.md` per folder (ROOT-D11) | user |
| 4 | 2026-10-26 | Specs are complete specifications and technical plans with a build-ready check, not code (ROOT-D12, ROOT-D13) | user |
| 5 | 2026-10-27 | Align workflows with agent-skills, add user-approved quality-gate handling and keep three commands (ROOT-D14) | pending user approval |
