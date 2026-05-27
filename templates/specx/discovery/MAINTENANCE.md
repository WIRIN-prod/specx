# Discovery maintenance (living golden truth)

Discovery is **not** write-once. Whenever a **feature** changes the product, update the discovery phases and foundation that it touches — in the **same change** as the feature leaf.

## Always review (every new or materially changed feature)

| Phase | File | Action |
|-------|------|--------|
| 07 | `07-feature-inventory.md` | Add/update feature ID, MoSCoW, MVP IN/OUT |
| 08 | `08-prd.md` | Add requirements, NFRs, release criteria |
| 09 | `09-technical-spec.md` | Confirm architecture still fits (recommended) |

Run: `specx discover impact <feature-path>` for a tailored checklist.

## Review when the feature affects…

| If feature touches… | Update phases |
|---------------------|---------------|
| Problem, market, positioning | 01, 02 |
| Personas, JTBD | 03 |
| User journeys | 04 |
| Navigation, screens, IA | 05 |
| Flows, states, errors | 06 |
| Integrations, data model, scale | 09 + `foundation/ARCHITECTURE.md` |
| Auth, secrets, PII | 10 |
| Legal, retention, compliance | 11 |

## Workflow

1. Implement feature spec in `specx/<segment>/…/<leaf>/` (propose → spec → design → tasks).
2. Run **`specx discover impact <path>`** — lists phases to edit.
3. Edit affected `specx/discovery/NN-*.md` files (addendum sections dated).
4. **Dual-agent:** specialist → critic → human **`specx approve <n>`**.
5. Update **foundation** from changed phases:
   - `STEERING.md` (01, 03, 04, 08)
   - `BUILD-ORDER.md` (07, 08)
   - `ARCHITECTURE.md` (09, 10)
6. **One git commit** (or stacked PR): discovery + foundation + feature leaf.

## Anti-patterns

- Feature leaf approved but discovery/PRD still describes old product
- Skipping phase 07 so BUILD-ORDER drifts
- Only updating chat, not committed markdown

Discovery + foundation + active feature leaves = **golden truth**.
