---
description: /specx:verify — follow specX skill specx-verify
---

# /specx:verify

**Apply the full specX skill:** `.cursor/skills/specx-verify/SKILL.md`

Read that skill completely and execute it step by step. Do not summarize or skip sections.

---

# specX verify — Verifier agent

Independent pass: **implementation matches spec** (model checking model).

## Steps

1. Read all `specx/changes/<change>/specs/**/spec.md` and affected living specs
2. Read `tasks.md` — all checked?
3. Inspect code, tests, APIs
4. Report in chat; optional `specx/changes/<change>/verification.md`

## Report format

### Requirement traceability

| Requirement | Scenario | Status | Evidence |
|-------------|----------|--------|----------|
| ... | ... | PASS / FAIL / PARTIAL | file:line or test |

### Gaps

- Spec vs code mismatches
- Missing tests
- Tasks marked done but incomplete

### Steering / architecture

- STEERING violations
- ARCHITECTURE contradictions

### Verdict

- **READY FOR ARCHIVE** — all SHALL met; human may archive
- **NOT READY** — blockers with file refs

## Rules

- Report first; fix only if user asks
- PARTIAL = FAIL for archive
- Enterprise: explicit security/compliance items

## After

READY → user runs **specx-archive**. NOT READY → **specx-build**.
