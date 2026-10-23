# {{PROJECT_NAME}} — SpecX project record

This repository's Markdown project record is the durable source of truth for the approved project blueprint, architecture, decisions, engineering rules, delivery roadmap, and work checkpoints. For an existing application, observed current behavior and intended target behavior are recorded separately. Specifications are completed and approved before build planning begins.

## Start here

- [Knowledge index](knowledge/README.md)
- [Product](knowledge/product.md)
- [Architecture](knowledge/architecture.md)
- [Technical stack](knowledge/technical-stack.md)
- [Component catalog](knowledge/components/README.md)
- [Hierarchical specifications](specifications/README.md)
- [Interfaces and data](knowledge/interfaces-and-data.md)
- [Security](knowledge/security.md)
- [External systems](knowledge/integrations.md)
- [Approved decisions](knowledge/decisions/README.md)
- [Engineering rules](knowledge/engineering-rules.md)
- [Proposals](proposals/README.md)
- [Plans](plans/README.md)
- [Current checkpoint](work/CHECKPOINT.md)

## Lifecycle

`discover current state → specify target blueprint with user → approve blueprint → plan phases/milestones/tasks → approve roadmap → execute task branches → review → human-approved merge`

Application code is not written during discovery or specification authoring. See the [blueprint readiness checklist](specifications/README.md#blueprint-readiness) before creating a build roadmap.

## Trust boundary

Only entries marked **user-confirmed** or **source-verified** are accepted facts. Proposed, inferred, disputed, and unresolved content is not an instruction to implement. Source-verified claims cite exact repository evidence; user-confirmed claims cite the approval record. Unknowns stay visible until resolved.

## Project metadata

- Name: {{PROJECT_NAME}}
- Stack: {{STACK}}
- Initialized: {{DATE}}
- Coverage: not assessed
