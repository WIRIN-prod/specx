---
id: ROOT
title: SpecX
status: approved
version: 9
parent: none
depends_on: []
---

# ROOT: SpecX

The root spec for SpecX itself. The format is in [_templates/spec.md](../plugins/specx/templates/specx/_templates/spec.md); the rules are in [RULES.md](RULES.md).

## 1. Overview

**Purpose:** A Claude Code plugin that lets a user explore ideas, plan, execute, and review software with AI agents, where the user makes every decision and agents only execute.

**In scope:**

- Four commands: `/specx:explore`, `/specx:plan`, `/specx:execute`, `/specx:review`
- A per-project `specx/` record: a tree of `spec.md` files, `TASKS.md`, and rules copied into `CLAUDE.md` and `AGENTS.md`

**Out of scope:**

- A CLI, and integrations for agents other than Claude Code (ROOT-D10)

## 2. Context chain

None (root).

## 3. Current state

- Plugin manifest: `plugins/specx/.claude-plugin/plugin.json`
- Skills: `plugins/specx/skills/{explore,plan,execute,review}/SKILL.md`
- Guard hook and its self-check: `plugins/specx/hooks/`
- Rules and scaffold: `plugins/specx/templates/`
- Cleanup for 0.1 projects: `scripts/upgrade-from-0.1.sh`

## 4. Requirements

| ID | Type | Requirement | Source |
|---|---|---|---|
| ROOT-R1 | Functional | THE SYSTEM SHALL offer the existing `/specx:plan`, `/specx:execute`, and `/specx:review` commands. | ROOT-D1 |
| ROOT-R2 | Functional | WHEN a big or small choice is needed, THE SYSTEM SHALL ask the user instead of choosing: big choices as open decisions, and small choices together on one defaults sheet. | ROOT-D9, ROOT-D25 |
| ROOT-R3 | Functional | IF docs and code disagree, THEN THE SYSTEM SHALL ask the user which is the source of truth. | ROOT-D9 |
| ROOT-R4 | Functional | THE SYSTEM SHALL keep `specx/TASKS.md` in step with every task in the spec tree. | ROOT-D9 |
| ROOT-R5 | Functional | WHEN executing, THE SYSTEM SHALL build each approved task in its own worktree and subagent, collect tasks on a delivery branch, and merge into the main branch only by pull request with a merge commit after the user approves. | ROOT-D2, D4, D5, D23 |
| ROOT-R6 | Security | WHEN executing, THE SYSTEM SHALL run a strict model-run security review, by an agent that did not build the work, before opening a pull request. | ROOT-D3, ROOT-D25 |
| ROOT-R7 | Functional | IF a task needs a new decision, THEN THE SYSTEM SHALL stop that task and every related task, and let unrelated tasks continue. | ROOT-D6 |
| ROOT-R8 | Functional | THE SYSTEM SHALL write specs as one standard-format `spec.md` per folder, with decisions and tasks inside, in a parent/child tree where parents hold what children share. | ROOT-D11 |
| ROOT-R10 | Functional | THE SYSTEM SHALL write each spec, for the next phase only, as a complete specification and technical plan, not code (architecture, technology with versions, interface contracts and errors, data model, flows, state, failures, security, configuration, observability, performance, testing, rollout) that passes the build-ready check before it is shown for approval. | ROOT-D12, ROOT-D21 |
| ROOT-R9 | Functional | WHEN `/specx:plan`, `/specx:execute`, or `/specx:review` first runs in a project, or Explore first writes a framework, THE SYSTEM SHALL create the `specx/` layout and rules without a separate CLI. | ROOT-D10 |
| ROOT-R11 | Process | THE SYSTEM SHALL enforce only approved quality criteria and commands, record whether each failure blocks or warns, and require user approval before weakening an existing gate. | ROOT-D14 |
| ROOT-R12 | Functional | WHEN the user invokes `/specx:explore`, THE SYSTEM SHALL support a flexible back-and-forth ideation discussion that helps the user and model understand the problem, desired outcome, and possible directions. | ROOT-D15, ROOT-D17 |
| ROOT-R13 | Functional | WHEN an Explore discussion concerns an existing project, THE SYSTEM SHALL inspect relevant repository code, documentation, the applicable SpecX spec context chain, and `specx/TASKS.md` read-only, and cite factual repository claims as `path:line`, never reproducing secret values or unnecessary personal data in Explore responses, including quotations and summaries. | ROOT-D18 |
| ROOT-R14 | Process | DURING Explore, THE SYSTEM SHALL NOT create or modify project files, specs, decisions, or tasks unless the user asks it to write the framework, and then SHALL write only the framework parts of the root spec and any setup that spec needs. | ROOT-D21 |
| ROOT-R15 | Functional | WHEN the user indicates an Explore discussion is ready to conclude, THE SYSTEM SHALL recap the idea, target users, desired outcomes, user-stated choices, constraints, non-goals, available repository evidence, and unresolved questions, ask whether to write the framework, then suggest `/specx:plan` without invoking it. | ROOT-D21 |
| ROOT-R16 | Functional | THE SYSTEM SHALL offer exactly these four commands: `/specx:explore`, `/specx:plan`, `/specx:execute`, and `/specx:review`. | ROOT-D15 |
| ROOT-R17 | Functional | WHEN planning, THE SYSTEM SHALL propose a roadmap of stages, phases, and milestones for the user to edit, and write specs and tasks for the next phase only. | ROOT-D21, ROOT-D22 |
| ROOT-R18 | Functional | THE SYSTEM SHALL type every task as `feature`, `bug`, `chore`, or `spike`, each with its own short record, and SHALL add a single item without a full planning pass. | ROOT-D24 |
| ROOT-R19 | Functional | THE SYSTEM SHALL ship the first phase as one pull request and each Ongoing item as its own, and ask the user to choose the pull request size for later phases. | ROOT-D23 |
| ROOT-R20 | Functional | WHILE building, THE SYSTEM SHALL let agents choose implementation details and SHALL log each non-structural choice as an assumption the user can overturn. | ROOT-D25 |
| ROOT-R21 | Functional | WHEN a milestone or item starts, THE SYSTEM SHALL show a short preview, and WHEN a milestone is built, THE SYSTEM SHALL show a demo with run steps, evidence, and assumptions, and wait for the user. | ROOT-D25 |
| ROOT-R22 | Functional | THE SYSTEM SHALL keep `specx/STATUS.md` current with what is happening, what is waiting on the user, and the assumptions made. | ROOT-D25 |
| ROOT-R23 | Process | WHEN a milestone is built, THE SYSTEM SHALL have it reviewed by an agent that did not build it, using `/specx:review`'s milestone mode. | ROOT-D25 |
| ROOT-R24 | Security | WHERE the guard hook can run, THE SYSTEM SHALL deny edits outside a task's scope and require confirmation for merges and history-destroying git commands. | ROOT-D25 |

## 5. Acceptance criteria

**ROOT-AC1** (R1, R9)

- Given a project with the plugin installed and no `specx/` folder
- When the user runs `/specx:plan`
- Then `specx/RULES.md`, `specx/spec.md`, `specx/TASKS.md`, `specx/_templates/spec.md`, and rules sections in `CLAUDE.md` and `AGENTS.md` exist

**ROOT-AC2** (R11)

- Given a project with an approved quality gate naming its criterion, command, run point, and failure policy
- When an agent encounters or proposes a change that weakens that gate
- Then the agent reports the change and waits for the user's approval before applying it

**ROOT-AC3** (R12, R16)

- Given a user with an idea that is not ready to plan
- When they invoke `/specx:explore` and discuss it in a flexible back-and-forth
- Then exactly the four SpecX commands are offered and Explore helps clarify the problem, desired outcome, and possible directions without forcing a fixed questionnaire

**ROOT-AC4** (R13, R14)

- Given an existing repository with relevant code, documentation, and SpecX context
- When the user explores an idea about that project
- Then Explore reads relevant context without executing project code, changes no files unless asked to write the framework, cites repository claims as `path:line` without reproducing secret values or unnecessary personal data in responses, and asks the user to resolve any conflict between code and documentation

**ROOT-AC5** (R14, R15)

- Given a user who says the Explore discussion is ready to conclude
- When Explore returns its recap
- Then it includes the idea, target users, desired outcomes, user-stated choices, constraints, non-goals, available repository evidence (or says none was available), and unresolved questions, asks whether to write the framework, suggests `/specx:plan`, does not invoke Plan, and, if the user declines, leaves the repository unchanged

**ROOT-AC6** (R14, R15)

- Given a concluded Explore discussion
- When the user asks it to write the framework
- Then only `specx/spec.md` §1, §3, §6.1, and §9, plus any missing setup, change, and every decision the user did not make is recorded as `open`

**ROOT-AC7** (R17, R10)

- Given a framework and an approved roadmap with several phases
- When the user runs `/specx:plan`
- Then a full spec, defaults sheet, milestones, and tasks exist for the next phase only, and later phases stay one row in the root Children table

**ROOT-AC8** (R19, R21, R22, R23)

- Given an approved first milestone
- When `/specx:execute` builds it
- Then a preview comes first, `specx/STATUS.md` tracks the work, an independent agent reviews it, and a demo with run steps, evidence, and assumptions comes before the next milestone starts

**ROOT-AC9** (R20)

- Given a task whose spec leaves an internal, reversible detail open
- When a subagent reaches it
- Then it chooses, logs the assumption with a reason, and does not stop; if the gap is a new dependency, interface, schema change, security behavior, or anything visible, it stops and reports

**ROOT-AC10** (R24)

- Given a task worktree with a scope file, in a project with `specx/RULES.md`
- When an agent edits a file outside scope, or runs `gh pr merge`
- Then the edit is denied and the merge asks a person to confirm; `python3 plugins/specx/hooks/guard_test.py` proves this

## 6. Design

The plugin ships skills and templates only. Each planning or execution skill starts with the same setup step, which copies `plugins/specx/templates/` into the project. CI checks the manifests, the skill frontmatter, and that this repository's rules match the template. Explore is a conversation: it starts from the user's idea, reads relevant repository and SpecX context when the idea concerns an existing project, uses cited evidence to ground the discussion, and writes nothing until the user asks for the framework. It does not run project code or browse external sources unless the user explicitly asks for research. If no repository is available, it continues from the user's description and identifies repository facts as unknown. The user controls when the conversation ends; Explore then recaps the idea, stated choices, constraints, available evidence, and unresolved questions, offers to write the framework, and suggests `/specx:plan`. Plan is invoked only when the user runs it.

**Explore interaction contract:** The input is the user's idea and the current conversation. For an existing project, inspect only relevant source and documentation, `specx/TASKS.md`, and the full ancestor chain of any relevant `spec.md`; use read-only tools and cite repository claims as `path:line`. Do not execute project code or run tests, and do not alter files until the user asks for the framework. Browse external sources only when the user explicitly asks. Hold a flexible dialogue: follow the user's lead, clarify gaps, and surface possible directions with trade-offs without selecting one. If repository context is unavailable, say so and continue from the user's description. If code and documentation disagree, present both with locations and ask the user which is authoritative; carry their answer in the recap for Plan to record. The recap contains the idea, target users, desired outcomes, user-stated choices, constraints, non-goals, available repository evidence, and unresolved questions. The command is exposed as a plugin skill alongside the existing three skills; no new runtime dependency is introduced.

**Delivery model:** Explore writes the framework: a new project's intended system, or an existing codebase's current one. Plan proposes stages (default Core, Essentials, Production, Ongoing), feature-sized phases inside them, and milestones inside each phase; the user edits this roadmap, which lives in the root Children table. Plan writes one spec per phase, only for the next phase, with big decisions asked individually and small ones on a single defaults sheet. In Ongoing, single features, bugs, chores, and spikes are added to the spec they belong to. Execute previews a milestone or item, builds each task in its own worktree and subagent on a delivery branch, verifies it, has an independent agent review it, demos it, and opens a pull request of the size the project chose.

**View and control:** `specx/STATUS.md` shows what is happening, what waits on the user, the roadmap, and logged assumptions. The guard hook runs on `PreToolUse` when Python 3 is available. It reads a scope file in the task worktree's git directory, and asks a person to confirm risky commands in projects that have `specx/RULES.md`. It sees file tools and command text only, and does nothing if Python 3 is missing, so the rules remain the primary control.

The workflow is compared with Addy Osmani's [agent-skills](https://github.com/addyosmani/agent-skills) reference pack:

| Reference capability | SpecX command and handling |
|---|---|
| Define, interview, refine ideas, spec-driven development | Plan confirms intent when unclear, proposes the roadmap, researches what the next phase touches, and writes build-ready specs for it. |
| Planning and task breakdown | Plan records broad capability/dependency maps in the parent Children table and creates approved vertical tasks. |
| Incremental implementation, context engineering, TDD, security, Git and shipping | Execute assigns each approved task its own worktree and subagent, follows the approved test method, runs checks, has an independent agent run review including security, demos each milestone, and uses a PR for merge approval. |
| Code review and quality | Review reports evidence-backed findings on correctness, readability/simplicity, architecture, security, and performance; it does not modify code. |
| Constraint-driven development | User-approved quality gates are captured in the root or relevant spec and checked throughout Plan, Execute, and Review. |
| API, UI, accessibility, observability, CI/CD, migration and documentation specialties | Use the relevant existing spec sections and task scope; no separate slash commands are added. |

The reference repository is [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills). SpecX keeps a focused four-command interface: `/specx:explore` for conversational idea exploration and the framework, `/specx:plan` for the roadmap and each phase's specifications and tasks, `/specx:execute` for approved implementation, and `/specx:review` for report-only review. Quality gates require user-approved criteria and commands, an explicit run point, and a block-or-warn policy; no numeric target or failure policy is assumed.

## 7. Shared with children

None.

## 8. Children

| Spec | Stage | Responsibility | Depends on | Build order | Version | Shared context and relation | Status |
|---|---|---|---|---|---|---|---|

## 9. Decisions

### ROOT-D1: SpecX commands

- **Status:** superseded (2026-10-29) by ROOT-D15
- **Question:** Which workflow commands should SpecX offer?
- **Answer:** "Only plan, execute, and review. Remove discover, specify, propose, approve, resume, the command wrappers, and `specx onboard`. Keep SpecX simple and to the point." (user, 2026-10-26)

### ROOT-D15: Pre-planning exploration command

- **Status:** answered (2026-10-29)
- **Question:** Should SpecX add a command for discussing an idea before formal planning, and what should it be called?
- **Answer:** "We should add one more slash command to specx" for discussing ideas before planning; the user selected `/specx:explore` from the proposed names. (user, 2026-10-29)

### ROOT-D16: Explore output

- **Status:** superseded (2026-11-03) by ROOT-D21
- **Question:** Should Explore create a file or task after the discussion?
- **Answer:** "Conversation only; recap and suggest `/specx:plan`." (user, 2026-10-29)

### ROOT-D17: Explore conversation style

- **Status:** answered (2026-10-29)
- **Question:** How should Explore guide the discussion?
- **Answer:** "Use a flexible back-and-forth discussion." (user, 2026-10-29)
- **Affects:** ROOT-R12, ROOT-AC3, ROOT-T2

### ROOT-D18: Repository context in Explore

- **Status:** answered (2026-10-29)
- **Question:** Should Explore inspect the existing repository, or leave codebase research to Plan?
- **Answer:** "Let it get the context from the repo and it help better during exporing basically its an ideation phase for both." (user, 2026-10-29)
- **Affects:** ROOT-R13, ROOT-AC4, ROOT-T2
### ROOT-D19: Sensitive repository evidence in Explore

- **Status:** answered (2026-10-29)
- **Question:** How should Explore handle secret values or unnecessary personal data it encounters in repository context that it may cite?
- **Options:**
  1. Never reproduce secret values or unnecessary personal data; identify the file and line and redact the value. Safer, but evidence is less verbatim.
  2. Quote repository evidence verbatim. More exact, but may expose secrets or personal data in the conversation.
- **Recommendation:** Option 1, to avoid disclosing sensitive values.
- **Answer:** "Redact secrets and unnecessary personal data." (user, 2026-10-29)
- **Affects:** ROOT-R13, ROOT-R15, ROOT-AC4, ROOT-AC5, ROOT-T2

### ROOT-D20: Command-count descriptions in repository documentation

- **Status:** answered (2026-10-29)
- **Question:** The approved spec and Explore skill define four commands, while `README.md:3,116`, `.claude-plugin/marketplace.json:3-4`, and `CLAUDE.md:3` describe three. Which is the source of truth, and may ROOT-T2 update these out-of-scope descriptions to match?
- **Options:**
  1. Four commands are correct; expand ROOT-T2 to update the README, marketplace descriptions, and CLAUDE.md. This keeps user-facing docs consistent but expands the approved file scope.
  2. Three commands are correct; do not add Explore and revise the approved spec/task. This preserves the existing descriptions but reverses the approved Explore feature.
- **Recommendation:** Option 1, because the user explicitly approved Explore and spec version 7. The user decides.
- **Answer:** "Four commands are correct; update the README, marketplace descriptions, and CLAUDE.md to match." (user, 2026-10-29)
- **Affects:** ROOT-R16, ROOT-T2

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

- **Status:** superseded in part (2026-11-03) by ROOT-D25, for implementation details and the defaults sheet
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

### ROOT-D21: Framework first, then one phase at a time

- **Status:** answered (2026-11-03)
- **Question:** Writing every spec before any code delays a working codebase. How should the workflow change?
- **Answer:** "explore creates a framework which is needed to be build based on users ideas then plan starts and creates phases and milestone and just writes per phase specs and them starts with code so users get their 0.0.1 code base... same happens when its an existing code base where explore writes the the framework already build and plan updates the specs which is already created" (user, 2026-11-03). The user accepted the proposal that Explore writes only when asked: "Yes, this is better approach change it" (user, 2026-11-03).
- **Affects:** ROOT-R10, ROOT-R14, ROOT-R15, ROOT-R17, ROOT-AC4 to AC7, ROOT-T3

### ROOT-D22: Stages, phases, and milestones

- **Status:** answered (2026-11-03)
- **Question:** How is work divided, and who sets the division?
- **Answer:** "Users can decide llm gives them this question on these are the phases. Phases can also be divided into poc, auth, rbac. Basically around features and these phases can be part of core, essential, production etc." and "Phases will have sub parts called milestones where the core idea could be divided in to milestonez" (user, 2026-11-03)
- **Affects:** ROOT-R17, ROOT-AC7, ROOT-T3

### ROOT-D23: Pull request size

- **Status:** answered (2026-11-03)
- **Question:** How much work does one pull request carry?
- **Answer:** "Approve the whole phase 1 as a pr" (user, 2026-11-03). The size for later phases was not chosen for SpecX as a whole, so Execute asks it as a project-wide decision in each project.
- **Affects:** ROOT-R5, ROOT-R19, ROOT-T3

### ROOT-D24: Work after the first phases

- **Status:** answered (2026-11-03)
- **Question:** How is individual work bounded once the product exists?
- **Answer:** "each change is a feature or a bug or something else, each could be bounded by a user story" (user, 2026-11-03). The user then accepted the proposal of `feature`, `bug`, `chore`, and `spike` types with records suited to each: "Yes, this is better approach change it" (user, 2026-11-03).
- **Affects:** ROOT-R18, ROOT-T3

### ROOT-D25: Control through visibility and reversibility

- **Status:** answered (2026-11-03)
- **Question:** May agents make small, reversible implementation choices on their own if each is logged for the user to overturn at the milestone demo, alongside risk-sorted decisions, a milestone demo, a live status view, a preview, a separate reviewer, and hooks?
- **Answer:** "Yes, this is better approach change it and also review the review skills so that is aligned with it" (user, 2026-11-03)
- **Affects:** ROOT-R2, ROOT-R6, ROOT-R20 to R24, ROOT-AC8 to AC10, ROOT-T3

## 10. Tasks

### ROOT-T1: Align SpecX workflows with agent-skills

- **Status:** done
- **Type:** feature
- **Milestone:** —
- **Parent:** None
- **Depends on:** None
- **Covers:** ROOT-R1, ROOT-R11, ROOT-AC1, ROOT-AC2
- **Decisions:** ROOT-D14
- **Files:** `plugins/specx/skills/`, `plugins/specx/templates/`, `specx/`, `CLAUDE.md`, `AGENTS.md`, `plugins/specx/.claude-plugin/plugin.json`
- **Model:** frontier, because this coordinates workflow and rule changes across the plugin and its canonical spec
- **Branch / worktree / PR:** `codex/specx-workflows-0.4.1` / current checkout / [#1](https://github.com/WIRIN-prod/specx/pull/1)

**Steps**

1. Compare the reference capabilities with Plan, Execute, and Review; retain the three-command interface.
2. Add confirmed intent and capability mapping, vertical task slicing, approved quality-gate capture, and source/trade-off handling to Plan.
3. Add user-approved TDD handling, structured check-failure diagnosis, and spec-gap stopping to Execute.
4. Add five review dimensions, evidence-backed remedies, and quality-gate integrity checks to Review.
5. Update the spec template and mirrored rules; bump the plugin patch version.

**Verification**

- Confirm ROOT-D14 and the workflow alignment are retained in approved root spec version 6.
- Confirm all rules copies match the canonical template.
- Confirm plugin metadata remains valid and only the three intended command skills are present.
- Manually check the intent, capability-map, TDD-choice, failed-check, five-dimension review, and gate-weakening scenarios.

**Log**

- 2026-10-27: implementation started after the user approved the comparison plan.
- 2026-10-27: implemented workflow guidance, refreshed scaffold and rule copies, and bumped plugin to 0.4.1. PowerShell checks confirmed manifest validity, synchronized rules, the three-skill inventory, and `git diff --check` passed. No application test suite was run.
- 2026-10-29: committed as `e478624`, pushed on `codex/specx-workflows-0.4.1`, and opened PR #1.

- 2026-10-29: PR #1 merged into `main` as merge commit `55a7d0b`.

### ROOT-T2: Add the Explore pre-planning command

- **Status:** done
- **Type:** feature
- **Milestone:** —
- **Parent:** None
- **Depends on:** ROOT-T1 (both tasks change the command inventory, plugin skills, CI validation, and root spec)
- **Covers:** ROOT-R12, ROOT-R13, ROOT-R14, ROOT-R15, ROOT-R16, ROOT-AC3, ROOT-AC4, ROOT-AC5
- **Decisions:** ROOT-D15, ROOT-D16, ROOT-D17, ROOT-D18, ROOT-D19
- **Files:** `plugins/specx/skills/explore/SKILL.md`, `plugins/specx/.claude-plugin/plugin.json`, `.github/workflows/ci.yml`, `README.md`, `.claude-plugin/marketplace.json`, `CLAUDE.md`, `specx/spec.md`, `specx/TASKS.md`
- **Model:** frontier, because the command's interaction boundary and handoff behavior must be specified before implementation
- **Branch / worktree / PR:** `specx/ROOT-T2` / `C:\Users\DASH AND DOT\STUDY\specx-ROOT-T2` / [#2](https://github.com/WIRIN-prod/specx/pull/2)

**Steps**

1. Add `/specx:explore` as a flexible ideation conversation grounded in relevant read-only repository and SpecX context.
2. Specify its evidence use, no-write boundary, recap contents, and explicit handoff to `/specx:plan` without creating files or tasks during Explore.
3. Update command-count validation and bump the plugin patch version after ROOT-T1 is merged.
4. Update the README, marketplace descriptions, and CLAUDE.md to describe all four commands, as approved in ROOT-D20.

**Verification**

- Confirm all four commands are discoverable: `/specx:explore`, `/specx:plan`, `/specx:execute`, and `/specx:review`.
- Confirm Explore reads relevant project context read-only, cites evidence, and asks the user to resolve code/documentation conflicts.
- Confirm an Explore session creates or modifies no files or tasks and ends with a recap and a `/specx:plan` suggestion without invoking Plan.
- Confirm root spec and `TASKS.md` agree on task IDs, decisions, status, and dependency.

**Log**

- 2026-10-29: user requested a pre-planning discussion command, selected `/specx:explore`, approved conversation-only output with a recap and `/specx:plan` suggestion, selected flexible back-and-forth discussion, and asked Explore to use repository context as part of ideation.
- 2026-10-29: user approved exact root spec version 6 and ROOT-T2. Task was `todo` while ROOT-T1 was awaiting merge.

- 2026-10-29: user approved execution: "Implement it"; branch `specx/ROOT-T2` uses `main` as the confirmed base and PR target.
- 2026-10-29: PR #1 merged into main as merge commit 55a7d0b, satisfying the dependency. The user confirmed main as base/PR target and approved execution with: Implement it. ROOT-T2 resumed in this worktree, then was blocked by ROOT-D20 before commit/PR preparation.
- 2026-10-29: security review identified an unresolved secret-redaction rule for repository citations; ROOT-D19 was answered by the user: redact secrets and unnecessary personal data. Spec version 7 was approved. A mismatch was then found between the four-command spec/skill and repository descriptions that still say three; ROOT-D20 was answered by the user: four commands are authoritative, and the README, marketplace descriptions, and CLAUDE.md should be updated. Spec version 8 is approved; ROOT-T2 resumed.

- 2026-11-03: `gh pr view 2` shows PR #2 merged on 2026-10-29; status corrected to `done`.

### ROOT-T3: Phased delivery and visible control

- **Status:** in-progress
- **Type:** feature
- **Story:** As a SpecX user, I want working code early and a clear view of what the agents do, so that I can steer without answering every question up front.
- **Milestone:** —
- **Parent:** None
- **Depends on:** ROOT-T2
- **Covers:** ROOT-R2, ROOT-R5, ROOT-R6, ROOT-R10, ROOT-R14, ROOT-R15, ROOT-R17 to R24, ROOT-AC4 to AC10
- **Decisions:** ROOT-D21, ROOT-D22, ROOT-D23, ROOT-D24, ROOT-D25
- **Files:** `plugins/specx/`, `.github/workflows/ci.yml`, `.claude-plugin/marketplace.json`, `README.md`, `CLAUDE.md`, `specx/`
- **Model:** frontier, because this changes the workflow across every command and the rules
- **Branch / worktree / PR:** `specx/ROOT-T3` / main checkout / —
- **Assumptions:** None.

**Steps**

1. Rewrite Explore, Plan, Execute, and Review to the delivery and control model in §6.
2. Update the rules and sync every copy; add `STATUS.md`, milestones, and task types to the scaffold.
3. Add the guard hook with a self-check, run it in CI, and bump the plugin version.
4. Update the README, marketplace description, and this spec.

**Verification**

- `python3 plugins/specx/hooks/guard_test.py`: prints `guard ok`
- The checks in `.github/workflows/ci.yml` pass.
- Run one real project through Explore, Plan, and Execute to check ROOT-AC6 to AC9. Not done yet.

**Log**

- 2026-11-03: the user discussed the design and instructed: "Yes, this is better approach change it and also review the review skills so that is aligned with it".
- 2026-11-03: implemented in the working tree. Spec version 9 stays `draft` until the user approves this exact version.
- 2026-11-03: the user approved spec version 9: "Approve and proceed".

## 11. Open questions

- Plugin skills locate templates through `${CLAUDE_PLUGIN_ROOT}`; this has not been verified in a live session.
- The guard hook has been tested by running it directly, not yet inside a live Claude Code session or subagent.

## 12. Change log

| Version | Date | Change | Approved by |
|---|---|---|---|
| 1 | 2026-10-26 | Three commands, rules everywhere (ROOT-D1 to D9) | user |
| 2 | 2026-10-26 | Plugin-only (ROOT-D10) | user |
| 3 | 2026-10-26 | Spec tree with one standard `spec.md` per folder (ROOT-D11) | user |
| 4 | 2026-10-26 | Specs are complete specifications and technical plans with a build-ready check, not code (ROOT-D12, ROOT-D13) | user |
| 5 | 2026-10-27 | Align workflows with agent-skills, add user-approved quality-gate handling and keep three commands (ROOT-D14) | superseded by v6 before separate approval |
| 6 | 2026-10-29 | Add the approved Explore pre-planning command (ROOT-D15 to D18) | user |
| 7 | 2026-10-29 | Resolve Explore handling of sensitive repository evidence (ROOT-D19) | user |
| 8 | 2026-10-29 | Resolve three-versus-four command descriptions (ROOT-D20) | user |
| 9 | 2026-11-03 | Framework, phased delivery, risk-sorted decisions, preview, demo, status, independent review, guard hook (ROOT-D21 to D25) | user |

- 2026-10-29: implemented Explore and synchronized the four-command docs; redaction/read-only review and structural validations passed, including manifest JSON, skill inventory/frontmatter, synchronized rules, docs, and spec/task consistency. No project test suite was run.
