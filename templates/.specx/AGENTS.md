# SpecX

SpecX is a portable, user-approved project knowledge system for software agents. It maintains a reviewable Markdown record of a product and its architecture inside the application repository, then guides agents through approved plans and scoped implementation.

## Core contract

- The repository-local `specx/` Markdown tree is the durable source of truth.
- Evidence, user confirmation, proposals, and unresolved questions are explicitly distinguished.
- Agents do not decide missing requirements or silently promote proposed knowledge.
- Knowledge proposals and implementation plans each require explicit user approval.
- Agents can prepare code only within approved task scope; a human reviews before merge.
- Work plans and checkpoints persist in Markdown so a later session can resume safely.

## Lifecycle

`discover → propose → approve knowledge → plan → approve plan → execute → review → human approves merge`

Plane and other external trackers are not required by the core workflow.
