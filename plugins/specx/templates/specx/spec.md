---
id: ROOT
title: {{PROJECT_NAME}}
status: draft
version: 1
parent: none
depends_on: []
---

# ROOT: {{PROJECT_NAME}}

The root spec. Everything here applies to every spec in this tree. The format is in [_templates/spec.md](_templates/spec.md); the rules are in [RULES.md](RULES.md).

## 1. Overview

**Purpose:** Not written yet. Run `/specx:plan`.

**In scope:** None yet.

**Out of scope:** None yet.

## 2. Context chain

None (root).

## 3. Current state

Not assessed yet.

## 4. Requirements

| ID | Type | Requirement | Source |
|---|---|---|---|

## 5. Acceptance criteria

None yet.

## 6. Design

Project-wide design that every spec inherits, at the same level of detail as [_templates/spec.md](_templates/spec.md) §6: specification level, not code. Not written yet.

### 6.1 Architecture

System context and containers: every service, app, worker, datastore, and external system, how they connect, and a Mermaid diagram.

### 6.2 Technology

Every language, framework, library, datastore, and tool, with exact versions and the decision that chose each.

### 6.3 Interfaces

Conventions every interface follows: API style, URL and naming rules, request validation, error format, pagination, versioning, auth headers.

### 6.4 Data model

Datastores, ownership of data, ID format, timestamps, migrations tool and conventions, retention.

### 6.5 Flows

The main end-to-end flows across services.

### 6.6 State and lifecycle

Shared lifecycles, such as users, organizations, and jobs.

### 6.7 Error handling and resilience

Error classes, retry and timeout policy, idempotency, how failures surface to users.

### 6.8 Security and privacy

Authentication, authorization model, secrets management, data classification, threat model.

### 6.9 Configuration

How configuration is loaded, environments, the full list of environment variables.

### 6.10 Observability

Logging format and fields, metrics, tracing, alerting.

### 6.11 Performance and limits

System-wide targets and quotas.

### 6.12 Testing strategy

Test levels, tools, coverage expectations, CI checks, the exact commands.

### 6.13 Migration and rollout

Environments, deployment pipeline, release and rollback process.

## 7. Shared with children

None yet. Project-wide conventions go here, such as the stack, folder structure, error format, theme, colors, and fonts, each backed by an answered decision.

## 8. Children

| Spec | Responsibility | Depends on | Build order | Shared context and relation | Status |
|---|---|---|---|---|---|

## 9. Decisions

None yet. Project-wide decisions go here, including the main branch and worktree location that `/specx:execute` asks for.

## 10. Tasks

None yet.

## 11. Open questions

None.

## 12. Change log

| Version | Date | Change | Approved by |
|---|---|---|---|
| 1 | {{DATE}} | Created | — |
