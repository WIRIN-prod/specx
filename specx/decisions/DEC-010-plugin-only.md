---
id: DEC-010
title: Plugin-only distribution
status: answered
specs: []
---

## Question

Claude Code showed every command twice (`/specx:plan` from the plugin and `/specx-plan` from `specx init`). Should the plugin or the CLI own setup?

## Answer

Keep the plugin installation and let it handle initialization instead of the CLI. The CLI was needed for features that were removed. (user, 2026-10-26)
