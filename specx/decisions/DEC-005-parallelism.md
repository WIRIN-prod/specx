---
id: DEC-005
title: Parallel execution
status: answered
specs: []
---

## Question

How many subagents run at once?

## Answer

The agent decides from the task graph. Each task gets its own subagent, so the user keeps control and the subagent gets its context from the task. (user, 2026-10-26)
