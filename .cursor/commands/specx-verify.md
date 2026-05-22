---
description: specX verify — Spec-Driven Development
---

When the user runs **/specx:verify**, follow this playbook:

Read and execute: `.specx/commands/verify.md`

Also apply skill `specx-sdd` and domain skill `specx-verify` if it exists.

---

---
description: Verify implementation matches spec before archive
---

# /specx:verify — Verifier agent

Act as **Verifier**: independent pass that implementation matches the spec (models checking models).

## Steps

1. Read all `specx/changes/<change>/specs/**/spec.md` deltas and living specs they modify.
2. Read `tasks.md` — confirm all boxes checked (or list incomplete).
3. Inspect implemented code paths, tests, and APIs.
4. Produce verification report in chat (and optional `specx/changes/<change>/verification.md`).

## Report format

### Requirement traceability

| Requirement | Scenario | Status | Evidence |
|-------------|----------|--------|----------|
| ... | ... | PASS/FAIL/PARTIAL | file:line or test name |

### Gaps
- Spec says X but code does Y
- Missing tests for scenarios
- Tasks marked done but behavior incomplete

### Steering / architecture
- Violations of `STEERING.md` non-negotiables
- Contradictions with `ARCHITECTURE.md`

### Verdict

- **READY FOR ARCHIVE** — all SHALL requirements met, human may archive
- **NOT READY** — list blockers with file references

## Rules

- Do not fix code in verify pass unless user asks — report first.
- PARTIAL is FAIL for archive purposes.
- Enterprise: note security/compliance spec items explicitly.

## After completion

If READY: user runs **`/specx:archive`**. If NOT READY: return to **`/specx:build`**.
