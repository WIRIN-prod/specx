---
name: specx-propose
description: >-
  specX propose — start OpenSpec-style change with proposal and Capabilities. Kiro gate:
  no implementation until human reviews proposal. Use /specx:propose or new features.
---

# specX propose — Start a change (OpenSpec + Kiro)

**Kiro gate:** No production code until proposal is reviewed and user proceeds to spec.

**OpenSpec:** Proposal **Capabilities** section creates the contract for the spec phase — one delta spec file per capability.

## Before writing

1. `specx status` + `.specx/registry.yaml`
2. Glob `specx/specs/**/spec.md` — list domains that exist
3. Read `STEERING.md` — confirm feature aligns; note non-negotiables
4. Read `BUILD-ORDER.md` — confirm feature is scheduled (or user waives)
5. Read `RULES.md` + `ARCHITECTURE.md` for constraints
6. `specx propose <kebab-name> -m "summary"` if folder missing

## Write `specx/changes/<name>/proposal.md`

### Why (1–2 sentences)
Problem/opportunity. Why now. Link to PRD feature ID or BUILD-ORDER item if exists.

### What changes
- Bullet each observable change
- **BREAKING:** prefix breaking changes
- User-visible impact first

### Capabilities (CRITICAL — OpenSpec)

This section drives **all** spec files. Research `specx/specs/` first.

**New capabilities** (kebab-case):
- `user-auth` → will create `changes/<change>/specs/user-auth/spec.md` → eventually `specs/user-auth/spec.md`

**Modified capabilities** (existing folders under `specx/specs/`):
- Only if **requirement-level behavior** changes
- Refactors alone do not belong here — design.md only
- List exact folder names: `auth-session`, `checkout-cart`

**Unchanged capabilities** (optional):
- Domains touched but no requirement change — documents scope boundary

### Impact
- APIs, events, schemas
- Dependencies, feature flags
- Security/compliance (enterprise)
- Migration / rollout

### Out of scope
Explicit list — prevents agent scope creep in build.

### Risks & open questions
What could block spec or design.

## Dual-agent on proposal (recommended)

1. Specialist drafts proposal
2. Critic checks: capabilities complete? wrong domains? MVP violation?
3. Human approves before **specx-spec**

## Product memory

Proposal is not living truth — **specs are**, after archive. Proposal is the intent record in `changes/archive/`.

## After

User proceeds → **specx-spec** (Specialist + Critic on deltas).

**Forbidden:** Code, tasks, or design before Capabilities approved by human.
