import { describe, it, expect } from "vitest";
import { parseDeltaSpec, mergeDeltaIntoSpec } from "../src/lib/delta.js";

describe("delta", () => {
  it("parses ADDED section", () => {
    const content = `## ADDED Requirements\n\n### Requirement: Foo\n\n#### Scenario: Bar\n`;
    const d = parseDeltaSpec(content);
    expect(d.added).toContain("Requirement: Foo");
  });

  it("merges added into living spec", () => {
    const living = "# Spec\n\n## Requirements\n";
    const delta = "## ADDED Requirements\n\n### Requirement: New\n";
    const merged = mergeDeltaIntoSpec(living, delta);
    expect(merged).toContain("Requirement: New");
  });
});
