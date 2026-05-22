---
name: specx-verify
description: >-
  specX verify — Ralph loop verifier traces SHALL requirements to code tests. Use before
  archive. Loop until READY with critique as context. GSD gate before merge.
---

# specX verify — Verifier agent (GSD + Ralph Loop)

**Independent pass.** You are not the implementer — you are QA against the **spec contract**.

**Ralph Loop:** If NOT READY, output gaps → implementer fixes → re-verify. Feed previous gap list as context on rerun. Do not declare READY while any SHALL fails.

**Element 6:** Verification is not "does it work." Check change `spec.md` **Verification criteria** + every scenario against named tests and edge cases.

## Inputs

1. All `specx/changes/<change>/specs/**/spec.md` deltas
2. Affected `specx/specs/**/spec.md` (post-merge preview mentally)
3. `tasks.md` — all must be `[x]` unless user waived
4. `design.md` — decisions honored
5. Code + tests (read evidence)

## Process

1. Read **Verification criteria** section in change `spec.md` (element 6)
2. Extract every `### Requirement:` from deltas
3. For each scenario, find code/test evidence or mark FAIL — include edge cases listed in verification criteria
3. Check STEERING non-negotiables
4. Check ARCHITECTURE decisions used
5. Enterprise: security/compliance requirements from discovery reflected

## Report template

Save optional: `specx/changes/<change>/verification.md`

```markdown
# Verification — <change>

## Traceability

| Requirement | Scenario | Status | Evidence |
|-------------|----------|--------|----------|
| Confirmation email | Successful signup | PASS | test: auth/signup.test.ts |
| ... | ... | FAIL | missing handler |

## Gaps (blocking)
1. ...

## Steering / architecture
- ...

## Tasks
- [ ] incomplete: 3.2 ...

## Verdict
**READY FOR ARCHIVE** | **NOT READY**
```

| Status | Meaning |
|--------|---------|
| PASS | Scenario fully implemented |
| PARTIAL | Treat as FAIL for archive |
| FAIL | Missing or wrong behavior |

## Rules

- Report first; fix only if user asks
- Do not approve archive — human does
- Link file:line or test name for every PASS
- Compare behavior to SHALL text literally

## Loop (Ralph)

```
verify → NOT READY → build fixes with gap list → verify again
```

Until READY or human accepts documented gaps.

## After READY

Human says archive → **specx-archive** → commit specs + code + changelog.
