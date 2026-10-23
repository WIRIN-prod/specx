# Project specifications

This directory contains the approved **target** blueprint: what the project is intended to do and how it is intended to fit together. The `knowledge/` records provide cross-cutting indexes and architecture; detailed behavior lives in hierarchical component and feature records here. Current code behavior is surveyed separately during discovery and must never be mistaken for product intent.

## Structure

Use a stable ID for every node. Nest records by the user-approved product/component/feature hierarchy; link by ID so reorganizing files does not break traceability.

```text
specifications/
  README.md
  components/
    IAM/
      README.md
      AUTH/
        README.md
        LOGIN/
          SPEC.md
```

`IAM / AUTH / LOGIN` is an organizational example, not a prescribed architecture. The user validates boundaries and naming. A product may use different levels, share a cross-cutting capability, or link one feature to multiple components.

## Authoring rules

- Use one bounded, reviewable Markdown record per component or feature, sized so an implementation agent can load the relevant scope without reading an entire book.
- Identify stable ID, parent, purpose, actors, responsibilities, scope and non-goals, preconditions, normal and alternate flows, observable behavior, inputs/outputs, data ownership/lifecycle, interfaces, permissions, errors/recovery, quality/security constraints, dependencies, acceptance criteria, and linked decisions as applicable.
- State whether each claim is `user-confirmed`, `source-verified`, `proposed`, or `unresolved`; include approval references or exact source evidence. Research recommendations remain proposed until the user decides.
- Keep current implementation, desired target behavior, and migration/transition behavior in separate sections.
- Link dependencies in both directions where practical. Name the relation, direction, reason, and status. Do not treat a diagram edge or code-derived relation as an approved requirement.
- Specify cross-component behavior once as the owning contract and link to it; avoid contradictory duplicated copies.
- Every requirement uses a stable ID and testable acceptance criteria. Link it to a feature, decision, component, architecture/interface record, and downstream milestone/task as applicable.
- Record decisions in `../knowledge/decisions/`; do not hide an unresolved design choice in prose or silently select a default.
- The frontier authoring agent may research, compare options, and draft text; it does not write application code or promote proposals to accepted knowledge.

Use [FEATURE-TEMPLATE.md](FEATURE-TEMPLATE.md) as a starting point. Tailor sections to applicability; mark not applicable with rationale rather than leaving ambiguous blanks.

## Blueprint readiness

Before a build roadmap is proposed, assess each applicable area and cite its accepted records. File existence alone is not readiness. The user decides whether the blueprint is ready; the agent reports evidence and blockers and never waives a gate.

| Readiness area | Required evidence | Status / evidence / blocker |
|---|---|---|
| Product outcomes, actors, journeys, scope, and non-goals | Approved product requirements and observable success conditions | unresolved |
| Component/feature hierarchy and ownership | Stable IDs, boundaries, responsibilities, relations, and coverage | unresolved |
| Behavior and acceptance | Every in-scope feature has normal, alternate, failure, and acceptance criteria where applicable | unresolved |
| Architecture and interfaces | Boundaries, contracts, protocols, critical flows, and cross-component dependencies | unresolved |
| Data | Ownership, schema concepts, lifecycle, privacy classification, retention, and migrations where applicable | unresolved |
| Identity and security | Authentication, authorization, trust boundaries, threat/security requirements, and open risks | unresolved |
| Technical stack | Approved critical technologies, versions/ranges, compatibility, and linked decisions | unresolved |
| Operations and quality | Runtime, deployment, observability, resilience, performance/accessibility/reliability targets as applicable | unresolved |
| Decisions and constraints | No unresolved decision that blocks the proposed initial milestones; exceptions explicitly approved and scoped | unresolved |
| Traceability | Requirements link to specifications; proposed milestones/tasks can link back to those requirements | unresolved |
| Existing-app transition | Current-state inventory and target-state delta/migration assumptions are evidence-backed or explicitly unresolved | unresolved / not applicable |

Readiness outcomes:

- **Not ready:** one or more required items are unresolved, conflicting, unsupported, or missing; do not create executable build tasks for affected scope.
- **Ready with approved exceptions:** the user explicitly approves each named exception, impacted scope, consequence, owner, and revisit point. This records accepted risk, not a claim that the information is known.
- **Ready:** all applicable gates have evidence, required decisions are approved, and the user approves the exact blueprint revision for roadmap planning.

## Approval and revisions

Specification authoring creates proposals. Approval applies only to the exact reviewed revision and listed scope. Record the approval and decisions in the proposal and `knowledge/decisions/`; update canonical specification records only for approved content. A material change requires a new revision and renewed approval.

## Relationship to the delivery roadmap

The blueprint answers **what to build and what constraints it must satisfy**. `../plans/` answers **in what phases and milestones to build it, with which small tasks and dependencies**. A roadmap is not executable until the user approves that exact roadmap revision separately from the blueprint.
