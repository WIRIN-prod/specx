# Knowledge index

## Status and evidence convention

Every substantive claim must identify its state and provenance. Use one of:

- `user-confirmed`: the user explicitly confirmed it; link to the dated approval record.
- `source-verified`: directly supported by a named source; cite a repo-relative path and symbol/section/line where practical.
- `proposed`: a candidate interpretation awaiting user review. It is not approved truth.
- `unresolved`: evidence is missing, contradictory, or requires a user decision.

Do not use `inferred` as accepted truth. If an inference helps explain evidence, label it proposed and state the evidence and uncertainty.

## Coverage

| Area | Status | Last reviewed | Evidence / open questions |
|---|---|---|---|
| Product outcomes, users, and journeys | unresolved | — | |
| Target component and feature specification tree | unresolved | — | |
| Current-state implementation inventory | unresolved | — | |
| Target system context and architecture | unresolved | — | |
| Technical stack and version choices | unresolved | — | |
| APIs, events, protocols, and contracts | unresolved | — | |
| Data ownership, lifecycle, and flows | unresolved | — | |
| Identity, authentication, and authorization | unresolved | — | |
| Security, privacy, and threat boundaries | unresolved | — | |
| External systems and dependencies | unresolved | — | |
| Runtime, deployment, and operations | unresolved | — | |
| Quality attributes and measurable targets | unresolved | — | |
| Engineering rules and verification gates | unresolved | — | |
| Decisions, constraints, risks, and non-goals | unresolved | — | |
| Requirement-to-milestone/task traceability | unresolved | — | |

Coverage is not complete merely because a section exists. Explain omissions and uninspected repositories/services.

Planning readiness is assessed in [specifications/README.md](../specifications/README.md#blueprint-readiness). Discovery coverage and target blueprint coverage are different: source evidence can establish current behavior but cannot establish desired behavior.

## Records

- [Product and users](product.md)
- [Architecture and system context](architecture.md)
- [Technical stack](technical-stack.md)
- [Components](components/README.md)
- [Interfaces and data](interfaces-and-data.md)
- [Security](security.md)
- [Integrations](integrations.md)
- [Decisions](decisions/README.md)
- [Engineering rules](engineering-rules.md)
