---
id: AUTH.LOGIN               # folder path in upper case, joined with dots; ROOT for specx/spec.md
title: Login
status: draft                # draft | approved | superseded
version: 1                   # bump on every approved change
parent: AUTH                 # parent spec ID; none for ROOT
depends_on: []               # spec IDs outside this spec's own branch of the tree
---

# AUTH.LOGIN: Login

<!--
SpecX spec format. One spec.md per folder holds everything about that part of
the system. Delete these comments when writing a real spec.

IDs: requirements <SPEC>-R#, acceptance criteria <SPEC>-AC#, decisions <SPEC>-D#,
tasks <SPEC>-T#. Keep IDs stable; never reuse a deleted ID.
Write "None" in a section that does not apply. Do not delete sections.
-->

## 1. Overview

**Purpose:** what this part of the system is for, in one or two sentences.

**In scope:**

- 

**Out of scope:**

- 

## 2. Context chain

Inherits everything in [specx/spec.md](../../spec.md) → [auth/spec.md](../spec.md).

**Overrides:** None. <!-- or: what this spec changes from a parent, and the decision that allows it -->

## 3. Current state

<!-- What exists today, each claim with path:line evidence. "None" for new work. -->

None.

## 4. Requirements

<!--
Written in EARS. Every requirement is one testable SHALL statement:
  Ubiquitous:  THE SYSTEM SHALL <response>.
  Event:       WHEN <trigger>, THE SYSTEM SHALL <response>.
  State:       WHILE <state>, THE SYSTEM SHALL <response>.
  Unwanted:    IF <condition>, THEN THE SYSTEM SHALL <response>.
  Optional:    WHERE <feature is included>, THE SYSTEM SHALL <response>.
Source is the user (with date) or the code (path:line) for current behavior.
-->

| ID | Type | Requirement | Source |
|---|---|---|---|
| AUTH.LOGIN-R1 | Functional | WHEN a user submits valid credentials, THE SYSTEM SHALL start a session and redirect to the dashboard. | user, YYYY-MM-DD |
| AUTH.LOGIN-R2 | Security | IF five sign-in attempts fail within 15 minutes, THEN THE SYSTEM SHALL lock the account for 15 minutes. | user, YYYY-MM-DD |

## 5. Acceptance criteria

<!-- Given/When/Then. Each criterion names the requirements it proves. -->

**AUTH.LOGIN-AC1** (R1)

- Given a registered user with a verified email
- When they submit the correct email and password
- Then a session cookie is set and they land on `/dashboard`

## 6. Design

### Interfaces

<!-- Routes, APIs, events, components: signatures, inputs, outputs, errors. -->

### Data

<!-- Entities, fields, ownership, lifecycle, migrations. -->

### Flows and error handling

<!-- Main, alternate, and failure flows. -->

### Security and privacy

<!-- Authentication, authorization, validation, secrets, data exposure. -->

## 7. Shared with children

<!--
Like a Next.js layout: everything here applies to every child spec below this
folder. Shared contracts, components, error formats, session handling, and
constraints. Children reference it instead of repeating it.
-->

None.

## 8. Children

<!-- One row per child folder. Relation says how children correlate: what they share, and which depend on which. -->

| Spec | Covers | Relation | Status |
|---|---|---|---|
| [AUTH.LOGIN.SSO](sso/spec.md) | Sign-in through an identity provider | Uses the shared session (§7); independent of PASSKEYS | draft |

## 9. Decisions

<!-- Every choice for this spec and its children. Status: open | answered | superseded. -->

### AUTH.LOGIN-D1: Session storage

- **Status:** open
- **Question:** Where are sessions stored?
- **Options:**
  1. Signed cookie: no server state; hard to revoke.
  2. Database table: revocable; one lookup per request.
- **Recommendation:** none yet.
- **Answer:** <!-- the user's words, with the date -->
- **Affects:** AUTH.LOGIN-R1, AUTH.LOGIN-T1

## 10. Tasks

<!--
Status: draft | todo | in-progress | blocked | in-review | done | cancelled.
Parent: the task in the parent spec this task rolls up to. A parent task is done
only when all its child tasks and its own steps are done.
Depends on: tasks that must be merged first. Tasks without a dependency between
them must not share files.
Each task must be small and self-contained: a smaller model with this spec and
its context chain must be able to finish it without guessing.
-->

### AUTH.LOGIN-T1: Session handling shared by all login methods

- **Status:** draft
- **Parent:** AUTH-T1
- **Depends on:** None
- **Covers:** AUTH.LOGIN-R1, AUTH.LOGIN-AC1
- **Decisions:** AUTH.LOGIN-D1
- **Files:** `src/auth/session/`
- **Model:** small <!-- small | mid | frontier, with the reason -->
- **Branch / worktree / PR:** —

**Steps**

1. 

**Verification**

- `<exact command>`: expected result

**Log**

- YYYY-MM-DD: created

## 11. Open questions

None.

## 12. Change log

| Version | Date | Change | Approved by |
|---|---|---|---|
| 1 | YYYY-MM-DD | Created | — |
