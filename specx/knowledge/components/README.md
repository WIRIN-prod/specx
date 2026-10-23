# Component catalog

Record each independently meaningful target component in its own Markdown file and nest subcomponents and features under their parent directory. Stable IDs and explicit parent links survive renames. Keep this target architecture distinct from the source-verified current implementation inventory. A component can link to one or more detailed feature specifications in `specx/specifications/`.

## Coverage

| Component | Kind | State | Record |
|---|---|---|---|

Suggested layout:

```text
components/
  README.md
  identity-access-management/
    README.md
    authentication/
      README.md
      login.md
```

The example names illustrate organization only; project-specific component boundaries and names require user confirmation.

## Component record template

- Name and stable ID:
- Purpose and responsibilities:
- State: user-confirmed / source-verified / proposed / unresolved
- Provenance / approval:
- Source paths and symbols:
- Inputs and outputs:
- Dependencies and dependents:
- Data owned and lifecycle:
- Trust boundary and permissions:
- Runtime and failure modes:
- Tests and quality gates:
- Open questions:

Use [COMPONENT-TEMPLATE.md](COMPONENT-TEMPLATE.md) for a component record and [FEATURE-TEMPLATE.md](../../specifications/FEATURE-TEMPLATE.md) for behavior-level records.

